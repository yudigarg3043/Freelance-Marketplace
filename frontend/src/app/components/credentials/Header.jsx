import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md">
        <Image
          src="/logo.svg"
          alt="FreelanceHub logo"
          width={20}
          height={20}
          priority
        />
      </div>
      <span className="text-xl font-bold text-slate-900">
        Freelance<span className="text-teal-600">Hub</span>
      </span>
    </Link>
  );
}
