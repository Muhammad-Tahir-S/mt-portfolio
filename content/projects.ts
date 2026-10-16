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
    summary: "Audience builder, campaign flow, and the user radar.",
    slug: "addressable",
    theme: { background: "#f7e8ff", light: true },
    study: {
      display: "From audiences to the user radar",
      voice: "The overview had to stay still while the data moved.",
      body: "I shipped the audience builder, the campaign flow, and the marketing overview. The user radar came next, with wallets and charts on one screen.",
      services: ["Interface", "Data visualization", "Design system"],
      caption: "Marketing overview. This frame waits for a still.",
    },
  },
  {
    title: "Worknet AI",
    summary: "Exam screens, a chat widget, and the metric beside the thread.",
    slug: "worknet-ai",
    theme: { background: "#1c2830", light: false },
    study: {
      display: "A chat that stays on the exam",
      voice: "The metric sits beside the thread.",
      body: "I built the exam screens and the chat widget. The metric component sits beside that thread.",
      services: ["Interface", "Chat", "Metrics"],
      caption: "Exam screen. This frame waits for a still.",
    },
  },
  {
    title: "Datafy",
    summary: "Volume tables, log tables, and charts for cloud storage.",
    slug: "datafy",
    theme: { background: "#d3dcfd", light: true },
    study: {
      display: "Tables and charts for each volume",
      voice: "A row should update before the server answers.",
      body: "I built the volume tables, the log tables, and the utilization charts. Optimistic updates kept a volume row current while storage status changed.",
      services: ["Interface", "Data visualization", "Tables"],
      caption: "Volume table. This frame waits for a still.",
    },
  },
  {
    title: "TalentRek",
    summary: "The theme, the form controls, and the skills a trek starts from.",
    slug: "talentrek",
    theme: { background: "#ffe1aa", light: true },
    study: {
      display: "A theme before the first trek",
      voice: "A trek starts from a skill.",
      body: "I set up the monorepo and the Chakra theme. I added the skills endpoint that a trek is built from.",
      services: ["Interface", "Design system", "API"],
      caption: "Trek form. This frame waits for a still.",
    },
  },
  {
    title: "Collabscape",
    summary: "Sign-in, a calendar, and the form that creates a post.",
    slug: "collabscape",
    theme: { background: "#d7ebe3", light: true },
    study: {
      display: "Sign-in, then the calendar",
      voice: "The post form sits on the calendar.",
      body: "I built sign-in, account connection, and the calendar. The post form sits on that calendar.",
      services: ["Interface", "Calendar", "Forms"],
      caption: "Post calendar. This frame waits for a still.",
    },
  },
  {
    title: "Tempo",
    summary: "A workflow canvas, and a tracker shipped in two weeks.",
    slug: "tempo",
    theme: { background: "#121212", light: false },
    study: {
      display: "A canvas, then a tracker",
      voice: "The canvas shipped with a dark theme.",
      body: "I built the workflow canvas, with forms, templates, and the panel layout. I then shipped an internal tracker in two weeks.",
      services: ["Interface", "Canvas", "Dashboard"],
      caption: "Workflow canvas. This frame waits for a still.",
    },
  },
  {
    title: "Doculess",
    summary: "Weekly interface releases across twelve investor demos.",
    slug: "doculess",
    theme: { background: "#e2e8ff", light: true },
    study: {
      display: "A weekly release for the demo",
      voice: "The demo needed a steady front end.",
      body: "I led weekly interface releases across twelve investor demos. I also planned a new front-end architecture for Doculess.",
      services: ["Interface", "Architecture", "Demos"],
      caption: "Demo interface. This frame waits for a still.",
    },
  },
  {
    title: "Bloco",
    summary: "The version-two ticketing interface, and API work beside it.",
    slug: "bloco",
    theme: { background: "#0d100f", light: false },
    study: {
      display: "Version two of the ticket",
      voice: "The new interface sits beside the API.",
      body: "I took the ticketing interface through the version-two revamp. API work sat beside that interface.",
      services: ["Interface", "API", "Migration"],
      caption: "Ticket flow. This frame waits for a still.",
    },
  },
  {
    title: "First Active 365",
    summary: "Maintenance and review on a live staffing site.",
    slug: "first-active-365",
    theme: { background: "#26006e", light: false },
    study: {
      display: "A live site, kept in review",
      voice: "The client site stayed in service.",
      body: "I maintained the live staffing site. Peer review sat beside that delivery.",
      services: ["Maintenance", "Review", "Interface"],
      caption: "Client site. This frame waits for a still.",
    },
  },
  {
    title: "Ascent",
    summary: "A leaderboard shell and a trend chart.",
    slug: "ascent",
    theme: { background: "#331832", light: false },
    study: {
      display: "A chart on the leaderboard",
      voice: "The list and the chart share one shell.",
      body: "I built the sign-in shell, the sidebar, and the leaderboard cards. The trend chart sits on that page.",
      services: ["Interface", "Data visualization", "Motion"],
      caption: "Leaderboard. This frame waits for a still.",
    },
  },
  {
    title: "Feedback Forum",
    summary: "Posts, votes, comments, and filters on one board.",
    slug: "feedback-forum",
    theme: { background: "#0d192c", light: false },
    study: {
      display: "A post, a vote, and a filter",
      voice: "The board only shows what the database allows.",
      body: "I built sign-in, posts, comments, and voting. Filters and search came next, with reads locked to the database.",
      services: ["Interface", "Authentication", "Data"],
      caption: "Feedback board. This frame waits for a still.",
    },
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
