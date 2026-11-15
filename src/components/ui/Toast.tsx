import { motion } from "motion/react";
import { IconCerto, IconQuase, IconSilhueta } from "./icons";

export type TipoToast = "acerto" | "quase" | "info";

type ToastProps = {
  mensagem: string;
  tipo: TipoToast;
  className?: string;
};

const estilos: Record<TipoToast, string> = {
  acerto: "bg-acerto text-creme-50",
  quase: "bg-quase text-mata-950",
  info: "bg-mata-900 text-creme-50",
};

const icones: Record<TipoToast, typeof IconCerto> = {
  acerto: IconCerto,
  quase: IconQuase,
  info: IconSilhueta,
};

/** Aviso curto com ícone + texto (não depende só da cor). Use dentro de <AnimatePresence>. */
export function Toast({ mensagem, tipo, className = "" }: ToastProps) {
  const Icone = icones[tipo];
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2 font-titulo text-botao font-semibold shadow-cartao ${estilos[tipo]} ${className}`}
    >
      <Icone className="size-7 shrink-0" />
      <span>{mensagem}</span>
    </motion.div>
  );
}
