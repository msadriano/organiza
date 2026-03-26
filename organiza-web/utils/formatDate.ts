export function formatDate(date: Date | null) {
  if (!date) return "Sem data de conclusão";
  return new Intl.DateTimeFormat("pt-BR").format(date);
}
