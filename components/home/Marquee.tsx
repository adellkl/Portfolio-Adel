/* Outils (tirés des projets), en 3 copies pour une boucle sans fin, même sur très grand écran */
const tools = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Supabase', 'Vercel', 'GSAP', 'Framer Motion', 'Motion', 'Express', 'DeepL API', 'Resend'];

export default function Marquee() {
  return (
    <div className="strip">
      <small>Les outils de mes projets</small>
      <div className="marquee"><div className="track" id="track">{[...tools, ...tools, ...tools].map((t, i) => <span key={i} aria-hidden={i >= tools.length || undefined}>{t}</span>)}</div></div>
    </div>
  );
}
