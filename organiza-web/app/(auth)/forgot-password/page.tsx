import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <section className="w-full flex flex-col items-center justify-center space-y-7">
      <div className="flex flex-col items-center justify-center">
        <h5>Esqueceu sua senha?</h5>
        <p className="text-xs">
          Não se preocupe! Digite seu e-mail e enviaremos um link para
          recuperação
        </p>
      </div>
      <ForgotPasswordForm />
      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar ao Login
      </Link>
    </section>
  );
}
