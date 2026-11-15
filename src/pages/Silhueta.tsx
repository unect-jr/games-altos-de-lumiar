import { QuizLayout } from "../components/jogo/QuizLayout";
import { SilhouetteStage } from "../components/jogo/SilhouetteStage";
import { IconSilhueta } from "../components/ui/icons";
import { useQuizRodada } from "../quiz/useQuizRodada";

export function Silhueta() {
  const quiz = useQuizRodada("silhueta", { tocarAoRevelar: true });
  const { ave, revelada, estado } = quiz;

  return (
    <QuizLayout
      titulo="Silhueta"
      quiz={quiz}
      intro={{
        icone: <IconSilhueta className="size-20" />,
        pergunta: "Que ave é essa?",
        texto: "Olhe a sombra e escolha o nome. São 5 aves!",
      }}
      renderPalco={(toast) => (
        <SilhouetteStage key={`${estado.indice}-${ave.id}`} ave={ave} revelada={revelada} className="flex-1">
          {toast}
        </SilhouetteStage>
      )}
    />
  );
}
