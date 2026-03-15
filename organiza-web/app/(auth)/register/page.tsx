import Link from "next/link";
import RegisterForm from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="w-full flex flex-col items-center justify-center space-y-7">
      <div className="flex flex-col items-center justify-center">
        <h5>Criar sua conta</h5>
        <p className="text-xs">Preencha os dados abaixo para começar</p>
      </div>
      <RegisterForm />
      <span className="flex flex-row items-center gap-2">
        <p className="text-xs">Já tem uma conta?</p>
        <Link href="/login" className="text-xs text-primary">
          Fazer login
        </Link>
      </span>
    </section>
  );
}
