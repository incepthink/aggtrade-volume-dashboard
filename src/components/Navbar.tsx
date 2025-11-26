import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="flex gap-8 max-w-7xl mx-auto p-4">
      <Link href={"/"}>Bot</Link>
      <Link href={"/volume"}>Volume</Link>
    </div>
  );
};
