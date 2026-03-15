"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/cliente";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { EyeOffIcon } from "lucide-react";
import ErrorMessage from "@/components/shared/ErrorMessage";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useState } from "react";

interface LoginInputs {
  email: string;
  password: string;
}

const formSchema = z.object({
  email: z.string().email("E-mail inválido, entre com o e-mail corretamente"),
  password: z.string().min(1, "Informe sua senha"),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createClient();
  const inputType = showPassword ? "text" : "password";
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (dataForm: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: dataForm.email,
        password: dataForm.password,
      });

      if (error) {
        setHasError(true);
        setIsLoading(false);
        //console.error("Erro do Supabase:", error);
      } else if (data) {
        router.push("/");
      }
    } catch (err) {
      //console.error("Erro ao fazer login:", err);
      setHasError(true);
      setIsLoading(true);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-7"
    >
      {hasError && (
        <ErrorMessage>
          Email ou senha incorretos. Por favor, tente novamente.
        </ErrorMessage>
      )}
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
            ></Input>
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
                  type={inputType}
                  aria-invalid={fieldState.invalid}
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                />
                <InputGroupAddon align={"inline-end"}>
                  <EyeOffIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
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

        <Link
          href="/forgot-password"
          className="text-xs text-primary inline-flex w-full justify-end"
        >
          Esqueci minha senha
        </Link>
      </div>
      <Button type="submit" variant={"default"} disabled={isLoading}>
        {isLoading ? "Processando..." : "Entrar"}
      </Button>
    </form>
  );
}
