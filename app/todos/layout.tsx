import Navbar from "../components/navbar";

export default function TodosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="">{children}</main>
    </>
  );
}
