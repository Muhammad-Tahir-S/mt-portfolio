import type { Metadata } from "next";
import styles from "./study.module.css";

export const metadata: Metadata = {
  title: "Addressable",
};

const services = ["Interface", "Data visualization", "Design system"] as const;

export default function StudyPage() {
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <p className={styles.label}>Addressable</p>
        <h1 className={styles.display}>
          Faster charts for the marketing overview
        </h1>
        <p className={styles.voice}>
          The tables grew, and the charts had to keep up.
        </p>
        <p className={styles.body}>
          I shipped the audience builder, the campaign dashboard, and the
          report views. Chart load time on the marketing overview fell by 60
          percent.
        </p>
        <ul className={styles.services}>
          {services.map((service) => (
            <li key={service} className={styles.label}>
              {service}
            </li>
          ))}
        </ul>
        <figure className={styles.figure}>
          <div className={styles.frame} aria-hidden="true" />
          <figcaption className={styles.caption}>
            Marketing overview. This frame waits for a still.
          </figcaption>
        </figure>
      </article>
    </main>
  );
}
