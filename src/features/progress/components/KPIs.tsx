interface KPIsProps {
  muscleVolume: { muscle: string; volume_kg: number }[] | undefined;
}

export function KPIs({ muscleVolume }: KPIsProps) {
  const total = (muscleVolume ?? []).reduce((sum, m) => sum + m.volume_kg, 0);

  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
      <p className="font-display text-2xl font-semibold text-brand-pink">{Math.round(total)} kg</p>
      <p className="text-sm text-neutral-500">kilaje total del período</p>
    </div>
  );
}
