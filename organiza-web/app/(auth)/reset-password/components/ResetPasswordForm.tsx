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
import { EyeOffIcon, EyeIcon } from "lucide-react";
import ErrorMessage from "@/components/shared/ErrorMessage";
import PasswordValidator from "@/components/shared/PasswordValidator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const formSchema = z
  .object({
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

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (dataForm: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: dataForm.password,
      });

      if (error) {
        let errorMsg = "Erro ao atualizar senha. Tente novamente.";
        if (error?.status === 429 || error?.message?.includes("rate limit")) {
          errorMsg =
            "Muitas tentativas. Por favor, aguarde alguns minutos e tente novamente.";
        }
        setHasError(true);
        setErrorMessage(errorMsg);
        setIsLoading(false);
      } else {
        router.push("/reset-password/success");
      }
    } catch (err) {
      setHasError(true);
      setErrorMessage("Erro ao atualizar senha. Tente novamente.");
      setIsLoading(false);
    }
  };

  const passwordInputType = showPassword ? "text" : "password";
  const confirmPasswordInputType = showConfirmPassword ? "text" : "password";

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-7"
    >
      {hasError && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <div className="flex flex-col gap-3">
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="gap-2">
              <FieldLabel>Nova senha</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  type={passwordInputType}
                  aria-invalid={fieldState.invalid}
                  placeholder="●●●●●●●●"
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
                placeholder="●●●●●●●●"
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

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Redefinindo..." : "Redefinir senha"}
      </Button>
    </form>
  );
}
