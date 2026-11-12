/* Logo A.L FRONT / Adel Loukal : un A dont la jambe droite se prolonge en L, dans un carré arrondi.
   `filled` : version pleine (carré blanc, lettre en creux) pour le favicon et les petites tailles. */
export const LOGO_PATH = 'M5.5 14.5 9 5.5l3.5 9H15';

export default function Logo({ size = 20, filled = false, color = '#fff', bg = '#08090a' }: { size?: number; filled?: boolean; color?: string; bg?: string }) {
  return filled ? (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="18" height="18" rx="5" fill={color} />
      <path d={LOGO_PATH} stroke={bg} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="18" height="18" rx="5" stroke={color} strokeWidth="1.5" />
      <path d={LOGO_PATH} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
