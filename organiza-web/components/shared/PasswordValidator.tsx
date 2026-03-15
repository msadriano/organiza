"use client";

import { CheckCircle2, Circle } from "lucide-react";

interface PasswordValidatorProps {
  password: string;
}

function PasswordValidator({ password }: PasswordValidatorProps) {
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const requirements = [
    { label: "Mínimo de 6 caracteres", valid: hasMinLength },
    { label: "Uma letra maiúscula", valid: hasUpperCase },
    { label: "Um caractere especial", valid: hasSpecialChar },
    { label: "Um número", valid: hasNumber },
  ];

  return (
    <div className="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800">
      {requirements.map((requirement, index) => (
        <div key={index} className="flex items-center gap-2">
          {requirement.valid ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-zinc-400 shrink-0" />
          )}
          <span
            className={`text-xs transition-colors ${
              requirement.valid
                ? "text-green-600"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {requirement.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default PasswordValidator;
