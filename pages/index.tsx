import styles from "../styles/Home.module.css";
import { useUser, UserButton } from "@clerk/nextjs";

export default function Home() {
  // Get the current user's firstName
  const { firstName } = useUser();

  return (
    <div className={styles.container}>
      <header>
        {/* Mount the UserButton component */}
        <UserButton />
      </header>
      <main>Hello, {firstName}!</main>
    </div>
  );
}