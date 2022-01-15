import "../styles/globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import { AppProps } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import Layout from "../components/ui-layout/Layout";

const publicPages: string[] = [ '/sign-in/[[...index]]', '/sign-up/[[...index]]']

function MyApp({ Component, pageProps }: AppProps) {
  // Get the pathname
  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider>
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <>
          <SignedIn>
          <Layout>

            <Component {...pageProps} />
            </Layout>
          </SignedIn>
          <SignedOut>
            <main>
              <p>
                Please{" "}
                <Link href="/sign-in">
                  <a className=" font-bold text-indigo-700">sign in</a>
                </Link>{" "}
                to access this page.
              </p>
            </main>
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
}
export default MyApp;
