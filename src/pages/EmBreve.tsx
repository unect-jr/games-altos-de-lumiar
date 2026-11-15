import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { GameShell } from "../layouts/GameShell";

type EmBreveProps = { titulo: string };

/** Placeholder das telas ainda não implementadas. */
export function EmBreve({ titulo }: EmBreveProps) {
  const navigate = useNavigate();
  return (
    <GameShell titulo={titulo}>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <p className="font-titulo text-titulo text-mata-900">Em breve!</p>
        <p className="text-tinta-suave">Esta parte ainda está sendo preparada.</p>
        <Button onClick={() => navigate("/")}>Voltar ao início</Button>
      </div>
    </GameShell>
  );
}
