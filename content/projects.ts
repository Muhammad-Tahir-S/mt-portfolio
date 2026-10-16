export type Theme = {
  background: string;
  light: boolean;
};

export type StudyContent = {
  display: string;
  voice: string;
  body: string;
  services: readonly string[];
  caption: string;
};

export type ProjectSummary = {
  title: string;
  summary: string;
  slug?: string;
  theme?: Theme;
  study?: StudyContent;
};

export const paperTheme: Theme = {
  background: "#fff",
  light: true,
};

const inkOnLight = "#1a1a1a";
const inkOnDark = "#f4f0e6";

export function themeInk(theme: Theme) {
  return theme.light ? inkOnLight : inkOnDark;
}

export const projects: readonly ProjectSummary[] = [
  {
    title: "Addressable",
    summary: "Audience builder, campaign dashboard, and faster marketing charts.",
    slug: "addressable",
    theme: { background: "#e7e0d4", light: true },
    study: {
      display: "Faster charts for the marketing overview",
      voice: "The tables grew, and the charts had to keep up.",
      body: "I shipped the audience builder, the campaign dashboard, and the report views. Chart load time on the marketing overview fell by 60 percent.",
      services: ["Interface", "Data visualization", "Design system"],
      caption: "Marketing overview. This frame waits for a still.",
    },
  },
  {
    title: "Worknet AI",
    summary: "Exam screens, a chat widget, and the metrics beside them.",
    slug: "worknet-ai",
    theme: { background: "#1c2830", light: false },
    study: {
      display: "Metrics beside the exam screen",
      voice: "The chat stays on that screen.",
      body: "I built the exam screens and the chat widget. The metrics sit beside them.",
      services: ["Interface", "Chat", "Metrics"],
      caption: "Exam screen. This frame waits for a still.",
    },
  },
  {
    title: "Datafy",
    summary: "Volume tables, log tables, and charts for cloud use.",
  },
  {
    title: "TalentRek",
    summary: "Exam creation, trek creation, and a dashboard.",
  },
  {
    title: "Collabscape",
    summary: "Sign-in, a calendar, and the form that creates a post.",
  },
  {
    title: "Tempo",
    summary: "A workflow canvas, and a tracker shipped in two weeks.",
  },
  {
    title: "Doculess",
    summary: "Weekly interface releases across twelve investor demos.",
  },
  {
    title: "Bloco",
    summary: "The version-two ticketing interface, and API work beside it.",
  },
  {
    title: "First Active 365",
    summary: "Maintenance and review on a live client site.",
  },
  {
    title: "Ascent",
    summary: "A data visualization interface in React and TypeScript.",
  },
  {
    title: "Feedback Forum",
    summary: "A full-stack app for posting and sorting feedback.",
  },
];

export function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function slugFromPath(pathname: string) {
  const path = normalizePath(pathname);
  const prefix = "/work/";
  if (!path.startsWith(prefix)) {
    return null;
  }
  const slug = path.slice(prefix.length);
  if (!slug || slug.includes("/")) {
    return null;
  }
  return slug;
}

export function themeForPath(pathname: string): Theme {
  const slug = slugFromPath(pathname);
  if (!slug) {
    return paperTheme;
  }
  const project = projects.find((item) => item.slug === slug);
  return project?.theme ?? paperTheme;
}

export function nextStudy(slug: string) {
  const studies = projects.filter((item) => item.slug && item.study);
  const index = studies.findIndex((item) => item.slug === slug);
  if (index < 0 || studies.length < 2) {
    return null;
  }
  return studies[(index + 1) % studies.length] ?? null;
}

export function themeBootScript() {
  const map: Record<string, { background: string; color: string }> = {
    "/": {
      background: paperTheme.background,
      color: themeInk(paperTheme),
    },
    "/work": {
      background: paperTheme.background,
      color: themeInk(paperTheme),
    },
  };

  for (const project of projects) {
    if (!project.slug || !project.theme) {
      continue;
    }
    map[`/work/${project.slug}`] = {
      background: project.theme.background,
      color: themeInk(project.theme),
    };
  }

  return `(()=>{var themes=${JSON.stringify(map)};var path=location.pathname;if(path.length>1&&path.endsWith("/"))path=path.slice(0,-1);var theme=themes[path]||themes["/"];if(!theme||!document.body)return;document.documentElement.style.backgroundColor=theme.background;document.body.style.backgroundColor=theme.background;document.body.style.color=theme.color;})();`;
}
