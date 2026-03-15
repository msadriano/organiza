import { CircleAlert } from "lucide-react";

export default function ErrorMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-red-50 border border-red-200 text-xs rounded-lg text-red-700 p-3 flex flex-row gap-2 items-center justify-start">
      <CircleAlert className="text-red-700" size={17} />
      <span>{children}</span>
    </div>
  );
}
