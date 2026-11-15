import { useEffect, useMemo, useState } from "react";
import { progressoAlbum } from "../album/titulos";
import { AlbumProgress } from "../components/album/AlbumProgress";
import { AlbumSlot } from "../components/album/AlbumSlot";
import { BirdDetail } from "../components/album/BirdDetail";
import { aves } from "../data/aves";
import type { Ave } from "../data/types";
import { GameShell } from "../layouts/GameShell";
import { useSessao } from "../store/sessao";

const IDS_AVES = aves.map((ave) => ave.id);

/** Álbum de aves: progresso, título e grade com todas as aves do lodge. */
export function Album() {
  const { progresso, vistas, marcarVistas } = useSessao();
  const { descobertas } = progresso;
  const [aberta, setAberta] = useState<Ave | null>(null);

  // as novas são calculadas uma vez, ao entrar; depois ficam marcadas como vistas
  const [novas] = useState(() => new Set(Object.keys(descobertas).filter((id) => !vistas.includes(id))));
  useEffect(() => marcarVistas(), [marcarVistas]);

  const resumo = useMemo(() => progressoAlbum(descobertas, IDS_AVES), [descobertas]);

  return (
    <GameShell titulo="Álbum">
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <AlbumProgress progresso={resumo} />

        <div className="-mx-2 min-h-0 flex-1 overflow-y-auto px-2 pt-2 pb-4 [touch-action:pan-y]">
          <ul className="grid grid-cols-2 gap-3 [perspective:60rem] sm:grid-cols-3 md:grid-cols-4">
            {aves.map((ave, indice) => (
              <li key={ave.id}>
                <AlbumSlot
                  ave={ave}
                  descoberta={ave.id in descobertas}
                  nova={novas.has(ave.id)}
                  indice={indice}
                  onAbrir={setAberta}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {aberta && <BirdDetail key={aberta.id} ave={aberta} onFechar={() => setAberta(null)} />}
    </GameShell>
  );
}
