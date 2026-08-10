interface KPIsProps {
  muscleVolume: { muscle: string; volume_kg: number }[] | undefined;
}

export function KPIs({ muscleVolume }: KPIsProps) {
  const total = (muscleVolume ?? []).reduce((sum, m) => sum + m.volume_kg, 0);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center">
      <p className="font-display text-2xl font-extrabold text-neutral-900">{Math.round(total)} kg</p>
      <p className="text-sm text-neutral-500">kilaje total del período</p>
    </div>
  );
}
