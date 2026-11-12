import { Fragment, type ReactNode } from 'react';
import TextRotator from './TextRotator';

/* Découpe un titre en mots animés (port de splitWords, rendu serveur).
   "|" = retour à la ligne, "_texte_" = gris */
export default function SplitTitle({ text, delay, as: Tag = 'h1', rotate }: {
  text: string; /** valeur de data-delay, ex. ".1" */ delay?: string; as?: 'h1' | 'h2' | 'h3';
  /** formules qui remplacent tour à tour la ligne grise (_texte_), la 1re étant ce texte */ rotate?: string[];
}) {
  const baseDelay = +(delay || .15);
  let wi = 0;
  const out: ReactNode[] = [];
  text.split('|').forEach((line, li) => {
    if (li) out.push(<br key={`br${li}`} />);
    const muted = line.includes('_');
    const words: ReactNode[] = [];
    if (muted && rotate) {
      // La ligne grise entre comme un seul bloc (délai de son 1er mot), puis roule entre les formules.
      const d = `${baseDelay + wi * .06}s`;
      wi += line.replace(/_/g, '').trim().split(' ').length;
      out.push(<span className="muted" key={`l${li}`}><span className="w w-rot"><span style={{ transitionDelay: d }}><TextRotator items={rotate} /></span></span></span>);
      return;
    }
    line.replace(/_/g, '').trim().split(' ').forEach((w, i) => {
      if (i) words.push(' ');
      words.push(<span className="w" key={i}><span style={{ transitionDelay: `${baseDelay + (wi++) * .06}s` }}>{w}</span></span>);
    });
    out.push(muted ? <span className="muted" key={`l${li}`}>{words}</span> : <Fragment key={`l${li}`}>{words}</Fragment>);
  });
  return <Tag data-split={text} data-delay={delay} className="split">{out}</Tag>;
}
