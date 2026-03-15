import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import ConfirmClient from "./components/ConfirmClient";

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center">
          <Spinner />
          <p className="font-bold text-sm">Processando...</p>
          <p className="text-sm text-center">
            Por favor aguarde enquanto nós processamos sua solicitação. Não
            atualize a página.
          </p>
        </div>
      }
    >
      <ConfirmClient />
    </Suspense>
  );
}
