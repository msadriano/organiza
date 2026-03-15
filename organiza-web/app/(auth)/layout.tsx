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
        <Logo type="simple" className="mb-5" />
        {children}
      </div>
    </div>
  );
}
