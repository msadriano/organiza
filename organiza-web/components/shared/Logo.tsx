import Image from "next/image";
import simpleLogo from "@/public/logo-icon-secudary.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  type: "simple" | "complete";
  className: string;
}

export default function Logo({ type, className }: LogoProps) {
  return (
    <div
      className={cn(
        "flex flex-row w-10 items-center justify-center ",
        className,
      )}
    >
      <Image src={simpleLogo} alt="Logo do Organiza" priority/>
    </div>
  );
}
