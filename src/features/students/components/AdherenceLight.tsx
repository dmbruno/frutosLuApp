interface AdherenceLightProps {
  trafficLight: 'verde' | 'amarillo' | 'rojo';
}

const COLORS: Record<string, string> = {
  verde: 'bg-green-500',
  amarillo: 'bg-amber-400',
  rojo: 'bg-red-500',
};

export function AdherenceLight({ trafficLight }: AdherenceLightProps) {
  return <span className={`inline-block h-3 w-3 shrink-0 rounded-full ${COLORS[trafficLight]}`} title={trafficLight} />;
}
