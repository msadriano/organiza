import { Button } from "@/components/ui/button";
import Link from "next/link";
import LoginForm from "./components/LoginForm";
import GoogleButton from "./components/GoogleButton";

export default function LoginPage() {
  return (
    <section className="w-full flex flex-col items-center justify-center space-y-7">
      <div className="flex flex-col items-center justify-center">
        <h5>Bem-vindo de volta</h5>
        <p className="text-xs">Entre com seu e-mail e senha para continuar</p>
      </div>
      <LoginForm />
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <p className="px-4 bg-card text-xs">Ou entre com</p>
        </div>
      </div>
      <GoogleButton />
      <span className="flex flex-row items-center gap-2">
        <p className="text-xs">Não tem uma conta?</p>
        <Link href="/register" className="text-xs text-primary">
          Criar nova conta
        </Link>
      </span>
    </section>
  );
}
