import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="flex gap-8 max-w-7xl mx-auto p-4">
      <Link href={"/"}>Volume</Link>
      <Link href={"/bot"}>Bot</Link>
    </div>
  );
};
