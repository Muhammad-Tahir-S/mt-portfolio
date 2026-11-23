import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "mt.dev",
};

export default function Home() {
  return (
    <main className={styles.page}>
      <p className={styles.label}>Portfolio</p>
      <h1 className={styles.brand} tabIndex={-1}>
        mt.dev
      </h1>
      <p className={styles.voice}>Care before effects.</p>
      <p className={styles.body}>
        I build product interfaces. This site is a study of one continuous
        space: a real document first, then motion, then WebGL.
      </p>
      <Link className={styles.cta} href="/work">
        View projects
      </Link>
    </main>
  );
}
