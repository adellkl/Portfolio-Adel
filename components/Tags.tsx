import { COLORS, type ColorKey } from '@/lib/projects';

/* tagHTML du prototype */
export default function Tags({ stack }: { stack: [string, ColorKey?][] }) {
  return <>{stack.map(([n, c]) => <span className="tag" key={n}>{c ? <i style={{ background: COLORS[c] }}></i> : null}{n}</span>)}</>;
}
