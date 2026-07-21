interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-1 py-12 text-center text-neutral-500">
      <p className="font-semibold">{title}</p>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
}
