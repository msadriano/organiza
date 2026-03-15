"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResetSuccess() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (countdown === 0) {
      router.push("/login");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
      </div>

      <div className="text-center flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-foreground">
          Senha alterada com sucesso!
        </h2>
        <p className="text-muted-foreground">
          Você será redirecionado para o login em{" "}
          <span className="font-semibold text-foreground">{countdown}</span>{" "}
          segundo{countdown === 1 ? "" : "s"}...
        </p>
      </div>

      <Link href="/login" className="w-full">
        <Button className="w-full">Ir para o login agora</Button>
      </Link>
    </div>
  );
}
