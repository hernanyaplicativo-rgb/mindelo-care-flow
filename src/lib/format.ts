export const formatCVE = (value: number): string =>
  `${new Intl.NumberFormat("pt-PT").format(Math.round(value || 0))} CVE`;

export const STATUS_STYLE: Record<string, string> = {
  Pago: "bg-success/15 text-success",
  Pendente: "bg-warning/15 text-warning",
  INPS: "bg-primary/10 text-primary",
  Garantia: "bg-accent/15 text-accent-foreground",
  Cancelado: "bg-destructive/15 text-destructive",
};

export const METHOD_STYLE: Record<string, string> = {
  Numerário: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Vinti4: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  MobiCash: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  Convénio: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  Garantia: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
};

export const statusBadgeClass = (status: string): string =>
  `inline-flex items-center text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
    STATUS_STYLE[status] ?? "bg-muted text-muted-foreground"
  }`;

export const methodBadgeClass = (method: string): string =>
  `inline-flex items-center text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
    METHOD_STYLE[method] ?? "bg-muted text-muted-foreground"
  }`;