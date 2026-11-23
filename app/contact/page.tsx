import type { Metadata } from "next";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <p className={styles.label}>Contact</p>
      <h1 className={styles.display} tabIndex={-1}>
        Say hello
      </h1>
      <p className={styles.voice}>One inbox for work and study.</p>
      <p className={styles.body}>
        Write when you want to talk about a product interface, a case study, or
        this site.
      </p>
    </main>
  );
}
