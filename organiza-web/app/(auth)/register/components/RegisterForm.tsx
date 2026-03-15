"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/cliente";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import ErrorMessage from "@/components/shared/ErrorMessage";
import PasswordValidator from "@/components/shared/PasswordValidator";
import { useState } from "react";
import { z } from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface RegisterInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .max(255, "Nome não pode exceder 255 caracteres"),
    email: z.string().email("E-mail inválido, entre com o e-mail corretamente"),
    password: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Senha deve conter pelo menos um caractere especial",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const supabase = createClient();
  const passwordInputType = showPassword ? "text" : "password";
  const confirmPasswordInputType = showConfirmPassword ? "text" : "password";
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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

      let responseData;
      try {
        responseData = await checkEmailResponse.json();
      } catch (jsonError) {
        setHasError(true);
        setErrorMessage("Erro ao validar e-mail. Tente novamente.");
        setIsLoading(false);
        return;
      }

      const { exists } = responseData;

      if (exists) {
        setHasError(true);
        setErrorMessage(
          "Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.",
        );
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: dataForm.email,
        password: dataForm.password,
        options: {
          data: {
            name: dataForm.name,
          },
        },
      });

      if (error) {
        let errorMsg = "Erro ao criar a conta. Por favor, tente novamente.";
        if (error?.status === 429) {
          errorMsg =
            "Muitas tentativas. Por favor, aguarde alguns minutos e tente novamente.";
        } else if (error?.message?.includes("rate limit")) {
          errorMsg =
            "Muitas tentativas. Por favor, aguarde alguns minutos e tente novamente.";
        }

        setHasError(true);
        setErrorMessage(errorMsg);
        setIsLoading(false);
      } else if (data) {
        await supabase.auth.signOut();
        router.push("/confirm?type=signup");
      }
    } catch (err) {
      setHasError(true);
      setErrorMessage("Erro ao criar a conta. Por favor, tente novamente.");
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
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="gap-2">
            <FieldLabel>Nome completo</FieldLabel>
            <Input
              placeholder="Seu nome"
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

      <div className="flex flex-col gap-3">
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="gap-2">
              <FieldLabel>Senha</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  type={passwordInputType}
                  aria-invalid={fieldState.invalid}
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                />
                <InputGroupAddon align={"inline-end"}>
                  {showPassword ? (
                    <EyeIcon
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer"
                    />
                  ) : (
                    <EyeOffIcon
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer"
                    />
                  )}
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && (
                <FieldError
                  className="text-xs text-red-700"
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <PasswordValidator password={form.watch("password")} />
      </div>

      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="gap-2">
            <FieldLabel>Confirmar senha</FieldLabel>
            <InputGroup>
              <InputGroupInput
                {...field}
                type={confirmPasswordInputType}
                aria-invalid={fieldState.invalid}
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              />
              <InputGroupAddon align={"inline-end"}>
                {showConfirmPassword ? (
                  <EyeIcon
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer"
                  />
                ) : (
                  <EyeOffIcon
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer"
                  />
                )}
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && (
              <FieldError
                className="text-xs text-red-700"
                errors={[fieldState.error]}
              />
            )}
          </Field>
        )}
      />

      <Button type="submit" variant={"default"} disabled={isLoading}>
        {isLoading ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
}
