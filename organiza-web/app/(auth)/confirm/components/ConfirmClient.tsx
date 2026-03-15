"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/cliente";
import { useEffect, useState } from "react";
import ConfirmSignup from "./ConfirmSignup";
import { ConfirmRecovery } from "./ConfirmRecovery";

export default function ConfirmClient() {
  const params = useSearchParams();
  const route = useRouter();
  const code = params.get("code");
  const urlType = params.get("type");
  const [error, setError] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (!code) return;

    const exchangeCode = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return route.push("/");
      } else {
        console.error("Error exchanging code for session:", error);
      }
    };

    exchangeCode();
  }, [code]);

  if (code && !error) return null;

  if (error) return <p>Erro ao processar login. Tente novamente.</p>;

  return (
    <div>{urlType === "signup" ? <ConfirmSignup /> : <ConfirmRecovery />}</div>
  );
}
