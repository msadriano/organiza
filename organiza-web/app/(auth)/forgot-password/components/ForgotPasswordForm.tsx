"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/cliente";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import ErrorMessage from "@/components/shared/ErrorMessage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const formSchema = z.object({
  email: z.string().email("E-mail inválido, entre com o e-mail corretamente"),
});

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (dataForm: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    try {
      const checkEmailResponse = await fetch(
        `${API_BASE_URL}/api/auth/check-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: dataForm.email }),
        },
      );

      if (!checkEmailResponse.ok) {
        setHasError(true);
        setErrorMessage("Erro ao validar e-mail. Tente novamente.");
        setIsLoading(false);
        return;
      }

      const { exists } = await checkEmailResponse.json();

      if (!exists) {
        setHasError(true);
        setErrorMessage("E-mail não encontrado. Verifique e tente novamente.");
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        dataForm.email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      );

      if (error) {
        let errorMsg = "Erro ao enviar link de recuperação. Tente novamente.";
        if (error?.status === 429 || error?.message?.includes("rate limit")) {
          errorMsg =
            "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
        }
        setHasError(true);
        setErrorMessage(errorMsg);
        setIsLoading(false);
      } else {
        router.push("/confirm?type=forgot");
      }
    } catch (err) {
      setHasError(true);
      setErrorMessage("Erro ao processar sua solicitação. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-7"
    >
      {hasError && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="gap-2">
            <FieldLabel>E-mail</FieldLabel>
            <Input
              placeholder="seu@email.com"
              {...field}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && (
              <FieldError
                className="text-xs text-red-700"
                errors={[fieldState.error]}
              />
            )}
          </Field>
        )}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Enviando..." : "Enviar link de recuperação"}
      </Button>
    </form>
  );
}
