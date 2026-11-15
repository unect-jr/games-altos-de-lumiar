// Ícones SVG simples (flat). Decorativos: quem usa define o rótulo acessível.
type IconProps = { className?: string };

const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  "aria-hidden": true,
  focusable: false,
} as const;

export function IconSilhueta({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        fill="currentColor"
        d="M30 10a6 6 0 0 1 6 5l6 2-6 2.5c-.4 7.5-5.6 13.5-13 15.5l-3 7h-3l2-6.5c-4.5.3-8.5-1-11-3.5l-6 1 4.5-4.5C10.5 25.5 16 21 23 20.5c.5-6 3.2-10.5 7-10.5Z"
      />
      <circle cx="31" cy="15" r="1.6" fill="var(--color-creme-50)" />
    </svg>
  );
}

export function IconCanto({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        fill="currentColor"
        d="M20 8v21.2A6.5 6.5 0 1 0 24 35V16l12-3v12.2A6.5 6.5 0 1 0 40 31V4L20 8Z"
      />
    </svg>
  );
}

export function IconPasseio({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        fill="currentColor"
        d="M24 4c-7.7 0-14 6-14 13.6C10 28 24 44 24 44s14-16 14-26.4C38 10 31.7 4 24 4Zm0 19a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11Z"
      />
    </svg>
  );
}

export function IconAlbum({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        fill="currentColor"
        d="M8 9a3 3 0 0 1 3-3h11v36H11a3 3 0 0 1-3-3V9Zm18-3h11a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H26V6Z"
      />
      <path stroke="var(--color-creme-50)" strokeWidth="2.5" strokeLinecap="round" d="M13 14h5M13 20h5M31 14h5M31 20h5" />
    </svg>
  );
}

export function IconVoltar({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M28 12 16 24l12 12" />
    </svg>
  );
}

export function IconSom({ className, ligado }: IconProps & { ligado: boolean }) {
  return (
    <svg {...base} className={className}>
      <path fill="currentColor" d="M8 18h7l10-8v28l-10-8H8a2 2 0 0 1-2-2V20a2 2 0 0 1 2-2Z" />
      {ligado ? (
        <path
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          d="M31 18a8 8 0 0 1 0 12M35.5 13a15 15 0 0 1 0 22"
        />
      ) : (
        <path stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" d="m31 19 10 10m0-10L31 29" />
      )}
    </svg>
  );
}
