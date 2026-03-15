import ResetPasswordForm from "./components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <section className="w-full flex flex-col items-center justify-center space-y-7">
      <div className="flex flex-col items-center justify-center">
        <h5>Criar nova senha</h5>
        <p className="text-xs">Escolha uma senha forte para proteger sua conta</p>
      </div>
      <ResetPasswordForm />
    </section>
  );
}
