"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import {
  Group,
  Mesh,
  ShaderMaterial,
  type MeshStandardMaterial,
  type Texture,
  type WebGLRenderer,
} from "three";
import { rectToWorldOnPlane } from "@/lib/camera";
import {
  publishModule8Sample,
  resetModule8Sample,
  type Module8Motion,
} from "@/lib/module-8-readout";
import { normalizePath } from "@/content/projects";
import {
  STUDY_MODEL_BUDGET,
  STUDY_MODEL_SLUG,
  STUDY_MODEL_URL,
} from "@/lib/study-model";
import { matcapFragmentShader, matcapVertexShader } from "./shaders/matcap-shader";

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const GL_CLASS = "has-study-gl";

type ModelStats = {
  bytes: number;
  loadMs: number;
  frameMs: number;
  addedMs: number;
};

function studyPath() {
  return `/work/${STUDY_MODEL_SLUG}`;
}

function createMatcapMaterial(texture: Texture) {
  return new ShaderMaterial({
    uniforms: {
      u_matcap: { value: texture },
    },
    vertexShader: matcapVertexShader,
    fragmentShader: matcapFragmentShader,
    toneMapped: false,
  });
}

async function loadStudyModel(gl: WebGLRenderer) {
  const loader = new GLTFLoader();
  const ktx2 = new KTX2Loader().setTranscoderPath("/basis/");
  ktx2.detectSupport(gl);
  loader.setKTX2Loader(ktx2);
  loader.setMeshoptDecoder(MeshoptDecoder);

  const started = performance.now();
  await MeshoptDecoder.ready;
  const response = await fetch(STUDY_MODEL_URL);
  const buffer = await response.arrayBuffer();
  const gltf = await new Promise<GLTF>((resolve, reject) => {
    loader.parse(buffer, "", resolve, reject);
  });
  const loadMs = performance.now() - started;
  let texture: Texture | null = null;

  gltf.scene.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return;
    }

    const previous = child.material as MeshStandardMaterial;
    texture = previous.map;
    child.frustumCulled = false;
  });

  if (!texture) {
    ktx2.dispose();
    throw new Error("The study model has no matcap.");
  }

  const material = createMatcapMaterial(texture);

  gltf.scene.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return;
    }

    const previous = child.material as MeshStandardMaterial;
    previous.dispose();
    child.material = material;
  });

  return {
    scene: gltf.scene,
    material,
    ktx2,
    bytes: buffer.byteLength,
    loadMs,
  };
}

/**
 * One compressed model, bound to one study frame.
 * It spins while the frame is in view. Hover spins it faster.
 */
export function StudyModel() {
  const pathname = usePathname();
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const onStudy = normalizePath(pathname) === studyPath();
  const groupRef = useRef<Group>(null);
  const spinRef = useRef<Group>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const hovered = useRef(false);
  const yaw = useRef(0);
  const entered = useRef(false);
  const baseline = useRef<number[]>([]);
  const lastStamp = useRef(0);
  const stats = useRef<ModelStats>({
    bytes: 0,
    loadMs: 0,
    frameMs: 0,
    addedMs: 0,
  });
  const [scene, setScene] = useState<Group | null>(null);

  useEffect(() => {
    if (!onStudy) {
      document.documentElement.classList.remove(GL_CLASS);
      elementRef.current = null;
      resetModule8Sample();
      return;
    }

    const element = document.querySelector<HTMLElement>("[data-study-model]");
    elementRef.current = element;

    if (!element) {
      return;
    }

    const onEnter = () => {
      hovered.current = true;
    };
    const onLeave = () => {
      hovered.current = false;
    };

    element.addEventListener("pointerenter", onEnter);
    element.addEventListener("pointerleave", onLeave);

    return () => {
      element.removeEventListener("pointerenter", onEnter);
      element.removeEventListener("pointerleave", onLeave);
      hovered.current = false;
    };
  }, [onStudy]);

  useEffect(() => {
    if (!onStudy) {
      return;
    }

    let cancelled = false;
    let dispose: (() => void) | null = null;

    loadStudyModel(gl)
      .then((model) => {
        if (cancelled) {
          model.material.dispose();
          model.ktx2.dispose();
          return;
        }

        stats.current.bytes = model.bytes;
        stats.current.loadMs = model.loadMs;
        dispose = () => {
          model.material.dispose();
          model.ktx2.dispose();
        };
        document.documentElement.classList.add(GL_CLASS);
        setScene(model.scene);
      })
      .catch((error: unknown) => {
        console.error(error);
        document.documentElement.classList.remove(GL_CLASS);
        resetModule8Sample();
      });

    return () => {
      cancelled = true;
      dispose?.();
      document.documentElement.classList.remove(GL_CLASS);
      setScene(null);
    };
  }, [gl, onStudy]);

  // Priority stays at 0. A higher priority stops the canvas render.
  useFrame((_, delta) => {
    const group = groupRef.current;
    const spin = spinRef.current;
    const element = elementRef.current;

    if (!onStudy || !scene || !group || !spin || !element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const reduce = window.matchMedia(REDUCE_QUERY).matches;
    const inView =
      rect.top < viewport.height * 0.92 &&
      rect.bottom > viewport.height * 0.08 &&
      rect.width > 1;
    const onScreen =
      rect.bottom > 0 &&
      rect.top < viewport.height &&
      rect.right > 0 &&
      rect.left < viewport.width &&
      rect.width > 1;

    group.visible = onScreen;

    const now = performance.now();
    const gap = lastStamp.current === 0 ? 0 : now - lastStamp.current;
    lastStamp.current = now;
    const sane = gap > 0 && gap < 50;

    if (!inView) {
      entered.current = false;

      if (sane) {
        baseline.current.push(gap);

        if (baseline.current.length > 24) {
          baseline.current.shift();
        }
      }
    } else if (!entered.current && sane) {
      entered.current = true;
      const samples = [...baseline.current].sort((left, right) => left - right);
      const middle = samples[Math.floor(samples.length / 2)] ?? gap;
      stats.current.frameMs = gap;
      stats.current.addedMs = Math.max(0, gap - middle);
    }

    let motion: Module8Motion = "rest";

    if (reduce) {
      motion = "reduced";
    } else if (hovered.current && inView) {
      motion = "hover";
    } else if (inView) {
      motion = "view";
    }

    const speed = motion === "hover" ? 0.9 : motion === "view" ? 0.35 : 0;
    // The ticker hands this clock milliseconds. One tick can be the whole session.
    const step = Math.min(Math.max(delta, 0), 50) / 1000;
    yaw.current += speed * step;
    spin.rotation.y = yaw.current;

    if (onScreen) {
      const plane = rectToWorldOnPlane(rect, camera, 0, viewport);

      if (plane) {
        group.position.set(plane.x, plane.y, plane.z);
        group.quaternion.copy(plane.quaternion);
        const fit = Math.min(plane.width, plane.height) * 0.34;
        group.scale.setScalar(fit);
      }
    }

    publishModule8Sample({
      ready: true,
      slug: STUDY_MODEL_SLUG,
      bytes: stats.current.bytes,
      budget: STUDY_MODEL_BUDGET,
      codec: "meshopt + ktx2",
      motion,
      yaw: yaw.current,
      loadMs: stats.current.loadMs,
      frameMs: stats.current.frameMs,
      addedMs: stats.current.addedMs,
    });
  });

  if (!onStudy || !scene) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <group ref={spinRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}
