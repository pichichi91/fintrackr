import "../styles/globals.scss";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import { AppProps } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import Layout from "../components/ui-layout/Layout";
import { DefaultSeo, NextSeo } from "next-seo";
import { Transition } from "@headlessui/react";

const publicPages: string[] = [
  "/sign-in/[[...index]]",
  "/sign-up/[[...index]]",
];

function MyApp({ Component, pageProps }: AppProps) {
  // Get the pathname
  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider>
      <DefaultSeo
        title="fintrack.io | Track you finances easily"
        openGraph={{
          type: "website",
          locale: "en_IE",
          url: "https://www.fintrackr.io/",
          site_name: "fintrackr",
          description: "Track your expenses easily",
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <NextSeo nofollow={true} />

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
            <Transition
              show={true}
              appear={true}
              enter="transition-opacity duration-200 ease-in"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200 ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="signed-out-bg h-screen flex justify-center items-center text-center">
                <main className="border-2 border-indigo-500 rounded-lg p-12 shadow-lg">
                  <h1 className="super-title"> fintrackr</h1>
                  <p>
                    Please{" "}
                    <Link href="/sign-in">
                      <a className=" font-bold text-indigo-700">sign in</a>
                    </Link>{" "}
                    to access this page.
                  </p>
                </main>
              </div>
            </Transition>
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
}
export default MyApp;
