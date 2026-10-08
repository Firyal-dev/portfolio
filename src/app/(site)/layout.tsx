import Footer from "@/partials/footer";
import Nav from "@/partials/nav";

/** Chrome for real routes only. app/not-found.tsx sits outside this group, so the
 *  404 page renders bare — just the root layout's providers. */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}