"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmRecovery() {
  return (
    <div className="card text-center">
      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 dark:bg-primary/30">
        <Mail size={40} className="text-primary" />
      </div>

      <h3 className="mb-2">E-mail enviado!</h3>
      <p className="text-sm text-muted-foreground mb-8">
        Enviamos um link de recuperação para o seu e-mail. Por favor, verifique
        sua caixa de entrada e spam.
      </p>

      <Link href="/login">
        <Button>Voltar ao Login</Button>
      </Link>

      <p className="mt-6 text-sm text-muted-foreground">
        Não recebeu o e-mail?{" "}
        <Link
          href="/forgot-password"
          className="text-primary hover:underline transition-colors"
        >
          Reenviar
        </Link>
      </p>
    </div>
  );
}
