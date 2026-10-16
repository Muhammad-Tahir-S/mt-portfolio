import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TransitionLink } from "@/components/motion/transition-link";
import { nextStudy, projects } from "@/content/projects";
import { StudyTitle } from "./study-title";
import styles from "./study.module.css";

// The article has to be in the document before the transition photographs it.
export const instant = false;

export function generateStaticParams() {
  return projects.flatMap((item) => (item.slug ? [{ slug: item.slug }] : []));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) {
    return { title: "Study" };
  }
  return { title: project.title };
}

export default async function StudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project?.study || !project.theme || !project.slug) {
    notFound();
  }

  const next = nextStudy(project.slug);

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <p className={styles.label}>{project.title}</p>
        <StudyTitle>{project.study.display}</StudyTitle>
        <p className={styles.voice}>{project.study.voice}</p>
        <p className={styles.body}>{project.study.body}</p>
        <ul className={styles.services}>
          {project.study.services.map((service) => (
            <li key={service} className={styles.label}>
              {service}
            </li>
          ))}
        </ul>
        <figure className={styles.figure}>
          <div className={styles.frame} aria-hidden="true" />
          <figcaption className={styles.caption}>{project.study.caption}</figcaption>
        </figure>
        {next?.slug ? (
          <TransitionLink className={styles.next} href={`/work/${next.slug}`}>
            Next, {next.title}
          </TransitionLink>
        ) : null}
      </article>
    </main>
  );
}
