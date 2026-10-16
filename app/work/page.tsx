import type { Metadata } from "next";
import Link from "next/link";
import styles from "./work.module.css";

export const metadata: Metadata = {
  title: "Projects",
};

export default function WorkPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Projects</h1>
      <ul className={styles.list}>
        <li>
          <Link className={styles.link} href="/work/study">
            Addressable
          </Link>
        </li>
      </ul>
    </main>
  );
}
