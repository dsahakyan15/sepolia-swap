import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SwapCard } from "@/components/swap/SwapCard";
import styles from "./App.module.css";

export function App() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <SwapCard />
        <Footer />
      </main>
    </>
  );
}
