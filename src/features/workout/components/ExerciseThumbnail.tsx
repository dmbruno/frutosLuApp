import type { Exercise } from '../../../types/domain';

interface ExerciseThumbnailProps {
  exercise: Exercise;
  size?: 'sm' | 'md';
}

const SIZE_CLASSES: Record<NonNullable<ExerciseThumbnailProps['size']>, string> = {
  sm: 'h-12 w-12 text-xl',
  md: 'h-16 w-16 text-2xl',
};

export function ExerciseThumbnail({ exercise, size = 'md' }: ExerciseThumbnailProps) {
  const sizeClass = SIZE_CLASSES[size];

  if (exercise.thumbnail_url) {
    return (
      <img
        src={exercise.thumbnail_url}
        alt={exercise.name}
        className={`${sizeClass} shrink-0 rounded-xl object-cover`}
      />
    );
  }
  return (
    <div className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400`}>
      🏋️
    </div>
  );
}
