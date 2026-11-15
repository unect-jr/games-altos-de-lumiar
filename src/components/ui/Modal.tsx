import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { IconFechar } from "./icons";

type ModalProps = {
  /** Nome acessível da janela (ex.: nome da ave). */
  rotulo: string;
  onFechar: () => void;
  children: ReactNode;
};

/**
 * Janela sobreposta com `<dialog>` nativo: foco preso, Esc fecha, fundo inerte.
 * Toque no fundo escuro também fecha. Monte só quando estiver aberta.
 */
export function Modal({ rotulo, onFechar, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (dialogo && !dialogo.open) dialogo.showModal();
    return () => dialogo?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={rotulo}
      onCancel={(e) => {
        e.preventDefault(); // quem fecha é o pai, desmontando
        onFechar();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
      className="m-auto w-[min(92vw,32rem)] overflow-visible bg-transparent p-0 backdrop:bg-mata-950/60"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-h-[90dvh] overflow-y-auto rounded-cartao bg-creme-100 p-3 shadow-cartao [touch-action:pan-y]"
      >
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 flex size-toque items-center justify-center rounded-full bg-mata-900 text-creme-50 shadow-botao active:shadow-botao-pressionado"
        >
          <IconFechar className="size-7" />
        </button>
        {children}
      </motion.div>
    </dialog>
  );
}
