import type { Metadata } from "next";
import { ProjectList } from "@/components/dom/project-list";
import { projects } from "@/content/projects";
import styles from "./work.module.css";

export const metadata: Metadata = {
  title: "Projects",
};

export default function WorkPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Projects</h1>
      <ProjectList projects={projects} />
    </main>
  );
}
