import { ListenStage } from "../components/jogo/ListenStage";
import { QuizLayout } from "../components/jogo/QuizLayout";
import { IconCanto } from "../components/ui/icons";
import { useQuizRodada } from "../quiz/useQuizRodada";

export function Canto() {
  // o canto toca no gesto de "Começar" / "Próxima" e de novo no acerto
  const quiz = useQuizRodada("canto", { tocarAoPerguntar: true, tocarAoAcertar: true });
  const { ave, revelada, estado } = quiz;

  return (
    <QuizLayout
      titulo="Canto"
      quiz={quiz}
      intro={{
        icone: <IconCanto className="size-20" />,
        pergunta: "Quem está cantando?",
        texto: "Ouça o canto e escolha a ave. São 5 aves!",
      }}
      // no Difícil, só o nome
      opcoesComFoto={estado.rodada.dificuldade !== "dificil"}
      renderPalco={(toast) => (
        <ListenStage key={`${estado.indice}-${ave.id}`} ave={ave} revelada={revelada} className="flex-1">
          {toast}
        </ListenStage>
      )}
    />
  );
}
