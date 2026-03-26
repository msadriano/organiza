import Logo from "@/components/shared/Logo";
import { Check } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center px-18">
      <div className="card w-full max-w-md flex flex-col items-center justify-start">
        <Logo type="complete" classIcon="h-8 w-8" className="mb-5 text-3xl" />
        {children}
      </div>
    </div>
  );
}
