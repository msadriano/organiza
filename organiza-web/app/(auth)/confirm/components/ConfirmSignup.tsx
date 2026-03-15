"use client";

import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmSignup() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
        <PartyPopper size={40} className="text-primary" />
      </div>

      <div className="flex flex-col items-center justify-center space-y-2">
        <h3 className="text-lg font-semibold">Conta criada com sucesso!</h3>
        <p className="text-sm text-muted-foreground">
          Bem-vindo! Sua conta está pronta para uso. Faça login para começar sua
          jornada.
        </p>
      </div>

      <Link href="/login" className="w-full">
        <Button type="button" variant="default" className="w-full">
          Fazer login
        </Button>
      </Link>
    </div>
  );
}
