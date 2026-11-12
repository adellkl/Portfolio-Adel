import { ImageResponse } from 'next/og';
import Logo from '@/components/Logo';

/* Icône pour l'écran d'accueil iOS (180×180) : le logo de la nav sur fond --void */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#08090a' }}>
      <Logo size={110} filled />
    </div>,
    size,
  );
}
