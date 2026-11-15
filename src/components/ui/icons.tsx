// Ícones do app via Phosphor (@phosphor-icons/react). Este arquivo só dá nomes
// de domínio e um peso padrão. Decorativos: quem usa define o rótulo acessível.
import {
  ArrowClockwise,
  BookOpenText,
  Bird,
  CaretLeft,
  CaretRight,
  ChatCircleDots,
  Check,
  MapTrifold,
  MusicNotes,
  SpeakerHigh,
  SpeakerSlash,
  Star,
  type IconWeight,
} from "@phosphor-icons/react";

type IconProps = { className?: string };

/** Props comuns: decorativo (aria-hidden), peso do Phosphor. */
function props(className: string | undefined, weight: IconWeight) {
  return { className, weight, "aria-hidden": true, focusable: false } as const;
}

export function IconSilhueta({ className }: IconProps) {
  return <Bird {...props(className, "fill")} />;
}

export function IconCanto({ className }: IconProps) {
  return <MusicNotes {...props(className, "fill")} />;
}

export function IconPasseio({ className }: IconProps) {
  return <MapTrifold {...props(className, "fill")} />;
}

export function IconAlbum({ className }: IconProps) {
  return <BookOpenText {...props(className, "fill")} />;
}

export function IconVoltar({ className }: IconProps) {
  return <CaretLeft {...props(className, "bold")} />;
}

export function IconAvancar({ className }: IconProps) {
  return <CaretRight {...props(className, "bold")} />;
}

export function IconCerto({ className }: IconProps) {
  return <Check {...props(className, "bold")} />;
}

/** "Quase": balão de pensamento (nada de X vermelho). */
export function IconQuase({ className }: IconProps) {
  return <ChatCircleDots {...props(className, "fill")} />;
}

export function IconRepetir({ className }: IconProps) {
  return <ArrowClockwise {...props(className, "bold")} />;
}

export function IconSom({ className, ligado }: IconProps & { ligado: boolean }) {
  const Componente = ligado ? SpeakerHigh : SpeakerSlash;
  return <Componente {...props(className, "fill")} />;
}

export function IconEstrela({ className, cheia = true }: IconProps & { cheia?: boolean }) {
  return <Star {...props(className, cheia ? "fill" : "bold")} />;
}
