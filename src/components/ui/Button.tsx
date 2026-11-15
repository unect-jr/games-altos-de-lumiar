import { motion, type HTMLMotionProps } from "motion/react";

type Variante = "primario" | "secundario" | "fantasma";

type ButtonProps = HTMLMotionProps<"button"> & {
  variante?: Variante;
};

const estilos: Record<Variante, string> = {
  primario: "bg-folha-600 text-creme-50 shadow-botao active:shadow-botao-pressionado",
  secundario: "bg-creme-50 text-mata-900 shadow-botao active:shadow-botao-pressionado",
  fantasma: "bg-transparent text-current underline-offset-4 hover:underline",
};

/** Botão grande e "gordinho", com alvo de toque ≥ 56 px. */
export function Button({ variante = "primario", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`inline-flex min-h-toque min-w-toque items-center justify-center gap-2 rounded-botao px-6 font-titulo text-botao font-semibold ${estilos[variante]} ${className}`}
      {...props}
    />
  );
}
