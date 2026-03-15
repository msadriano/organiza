"use client";

import { createClient } from "@/lib/supabase/cliente";
import { Button } from "../ui/button";

export default function LogoutButton() {
  const supabase = createClient();

  const handleSession = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };
  return <Button onClick={handleSession}>Sair</Button>;
}
