import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useOutlet } from "react-router";

/** Congela o conteúdo da rota para a animação de saída mostrar a tela antiga. */
function OutletCongelado() {
  const outlet = useOutlet();
  const [congelado] = useState(outlet);
  return congelado;
}

/** Raiz do app: transição suave (fade + leve deslocamento) entre telas. */
export function RootLayout() {
  const { pathname } = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-dvh"
      >
        <OutletCongelado />
      </motion.div>
    </AnimatePresence>
  );
}
