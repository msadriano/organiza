import Image from "next/image";
import simpleLogo from "@/public/logo-icon-secudary.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  type: "simple" | "complete";
  className?: string;
  classIcon?: string;
}

export default function Logo({ type, className, classIcon }: LogoProps) {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center gap-2",
        className,
      )}
    >
      <Image
        src={simpleLogo}
        alt="Logo do Organiza"
        className={cn(classIcon)}
        priority
      />
      <span className="font-bold">organiza</span>
    </div>
  );
}
