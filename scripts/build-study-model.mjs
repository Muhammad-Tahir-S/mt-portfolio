/**
 * Build the study gem.
 * The mesh uses EXT_meshopt_compression.
 * The matcap uses KTX2 with Basis ETC1S.
 * One primitive holds one geometry codec. Draco is the other codec.
 * This file does not stack Draco on Meshopt.
 *
 * The encoder wasm is a build tool. It is not part of the site.
 */
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { Document, NodeIO } from "@gltf-transform/core";
import {
  EXTMeshoptCompression,
  KHRTextureBasisu,
} from "@gltf-transform/extensions";
import { meshopt } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = resolve(root, "scripts/.cache/libktx");
const outFile = resolve(root, "public/models/study-sphere.glb");
const budget = 1.5 * 1024 * 1024;
const libktxZip =
  "https://github.com/KhronosGroup/KTX-Software/releases/download/v4.4.2/KTX-Software-4.4.2-Web-libktx.zip";

function gem() {
  const scale = [1.15, 0.72, 0.42];
  const vertices = [
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, 1],
    [-1, 0, 0],
    [0, 0, -1],
    [0, -1, 0],
  ].map(([x, y, z]) => [x * scale[0], y * scale[1], z * scale[2]]);
  const faces = [
    [0, 2, 1],
    [0, 3, 2],
    [0, 4, 3],
    [0, 1, 4],
    [5, 1, 2],
    [5, 2, 3],
    [5, 3, 4],
    [5, 4, 1],
  ];
  const positions = [];
  const normals = [];
  const indices = [];

  faces.forEach((face) => {
    const points = face.map((index) => vertices[index]);
    const [a, b, c] = points;
    const ux = b[0] - a[0];
    const uy = b[1] - a[1];
    const uz = b[2] - a[2];
    const vx = c[0] - a[0];
    const vy = c[1] - a[1];
    const vz = c[2] - a[2];
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const length = Math.hypot(nx, ny, nz) || 1;
    nx /= length;
    ny /= length;
    nz /= length;
    const base = positions.length / 3;

    for (const point of points) {
      positions.push(point[0], point[1], point[2]);
      normals.push(nx, ny, nz);
    }

    indices.push(base, base + 1, base + 2);
  });

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices),
  };
}

function matcapPixels(size) {
  const pixels = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = ((x + 0.5) / size) * 2 - 1;
      const ny = 1 - ((y + 0.5) / size) * 2;
      const falloff = nx * nx + ny * ny;
      const nz = Math.sqrt(Math.max(0, 1 - falloff));
      const light = Math.max(0, nx * -0.35 + ny * 0.55 + nz * 0.75);
      const shade = 0.22 + light * light * 0.78;
      const index = (y * size + x) * 4;
      pixels[index] = Math.round(28 + shade * 200);
      pixels[index + 1] = Math.round(34 + shade * 186);
      pixels[index + 2] = Math.round(42 + shade * 160);
      pixels[index + 3] = 255;
    }
  }

  return pixels;
}

async function ensureLibktx() {
  const jsPath = resolve(cacheDir, "libktx.js");
  const wasmPath = resolve(cacheDir, "libktx.wasm");

  try {
    await stat(jsPath);
    await stat(wasmPath);
    return { jsPath, wasmPath };
  } catch {
    await mkdir(cacheDir, { recursive: true });
    const response = await fetch(libktxZip);

    if (!response.ok) {
      throw new Error(`The KTX encoder download failed: ${response.status}`);
    }

    const archive = Buffer.from(await response.arrayBuffer());
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const run = promisify(execFile);
    const zipPath = resolve(cacheDir, "libktx.zip");
    await writeFile(zipPath, archive);
    await run("unzip", ["-o", zipPath, "-d", cacheDir]);
    return { jsPath, wasmPath };
  }
}

async function encodeMatcap(pixels, size) {
  const { jsPath, wasmPath } = await ensureLibktx();
  const require = createRequire(jsPath);
  const source = await readFile(jsPath, "utf8");
  const wasm = await readFile(wasmPath);
  const context = {
    console,
    process,
    Buffer,
    TextDecoder,
    TextEncoder,
    URL,
    WebAssembly,
    performance,
    setTimeout,
    clearTimeout,
    require,
    module: { exports: {} },
    exports: {},
    __dirname: cacheDir,
    __filename: jsPath,
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  const ktx = await context.createKtxModule({ wasmBinary: wasm });
  const info = new ktx.textureCreateInfo();
  info.vkFormat = ktx.VkFormat.R8G8B8A8_UNORM;
  info.baseWidth = size;
  info.baseHeight = size;
  info.baseDepth = 1;
  info.numDimensions = 2;
  info.numLevels = 1;
  info.numLayers = 1;
  info.numFaces = 1;
  info.isArray = false;
  info.generateMipmaps = false;

  const texture = new ktx.ktxTexture(
    info,
    ktx.TextureCreateStorageEnum.ALLOC_STORAGE,
  );
  const code = texture.setImageFromMemory(0, 0, 0, pixels, pixels.byteLength);

  if (code !== ktx.ErrorCode.SUCCESS && code !== 0) {
    throw new Error(`KTX image write failed: ${code}`);
  }

  const basis = new ktx.basisParams();
  basis.uastc = false;
  basis.qualityLevel = 128;
  basis.compressionLevel = 2;
  basis.threadCount = 1;
  const compressed = texture.compressBasis(basis);

  if (compressed !== ktx.ErrorCode.SUCCESS && compressed !== 0) {
    throw new Error(`Basis compress failed: ${compressed}`);
  }

  const bytes = texture.writeToMemory();
  const copy = new Uint8Array(bytes);
  texture.delete();
  return copy;
}

async function main() {
  await MeshoptEncoder.ready;

  const meshData = gem();
  const matcap = await encodeMatcap(matcapPixels(128), 128);
  const document = new Document();
  const buffer = document.createBuffer();
  document.createExtension(KHRTextureBasisu).setRequired(true);

  const position = document
    .createAccessor()
    .setType("VEC3")
    .setArray(meshData.positions)
    .setBuffer(buffer);
  const normal = document
    .createAccessor()
    .setType("VEC3")
    .setArray(meshData.normals)
    .setBuffer(buffer);
  const indices = document
    .createAccessor()
    .setType("SCALAR")
    .setArray(meshData.indices)
    .setBuffer(buffer);
  const texture = document
    .createTexture("matcap")
    .setMimeType("image/ktx2")
    .setImage(matcap);
  const material = document
    .createMaterial("matcap")
    .setBaseColorTexture(texture)
    .setMetallicFactor(0)
    .setRoughnessFactor(1);
  const primitive = document
    .createPrimitive()
    .setAttribute("POSITION", position)
    .setAttribute("NORMAL", normal)
    .setIndices(indices)
    .setMaterial(material);
  const mesh = document.createMesh("study-gem").addPrimitive(primitive);
  const node = document.createNode("study-gem").setMesh(mesh);
  const scene = document.createScene("study").addChild(node);
  document.getRoot().setDefaultScene(scene);

  await document.transform(meshopt({ encoder: MeshoptEncoder, level: "medium" }));

  const io = new NodeIO()
    .registerExtensions([EXTMeshoptCompression, KHRTextureBasisu])
    .registerDependencies({ "meshopt.encoder": MeshoptEncoder });

  await mkdir(dirname(outFile), { recursive: true });
  await io.write(outFile, document);

  const file = await stat(outFile);

  if (file.size > budget) {
    throw new Error(`The model is ${file.size} bytes. The budget is ${budget}.`);
  }

  console.log(`Wrote ${outFile} (${file.size} bytes).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
