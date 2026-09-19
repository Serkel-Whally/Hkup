import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { buttonVariants } from "@/components/ui/button";
import { RainbowButton } from "@/app/components/rainbow-button";

export function Navbar() {
  return (
    <div className="flex items-center justify-between py-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="Logo" width={180} height={60} className="w-[180px] h-auto" style={{ height: 'auto' }} />
      </Link>
      <Link href="/dashboard">
        <RainbowButton>Get Started</RainbowButton>
      </Link>
    </div>
  );
}