import SplitTitle from '@/components/SplitTitle';

/* 404 : renvoie vers l'accueil avec les styles existants (pas de nouveau design) */
export default function NotFound() {
  return (
    <header className="page-hero" id="top">
      <div className="hero-glow"></div>
      <div className="wrap">
        <div className="eyebrow fade"><span className="mono">404</span></div>
        <SplitTitle text="Cette page n'existe pas.|_Retour à l'accueil._" />
        <p className="lede fade" style={{ transitionDelay: '.6s' }}><a href="/" className="arrow-link">Retour à l&apos;accueil <span>→</span></a></p>
      </div>
    </header>
  );
}
