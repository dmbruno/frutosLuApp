import { getInitials } from '../../lib/utils/initials';

interface AvatarProps {
  src?: string | null;
  fullName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-11 w-11 text-sm',
  md: 'h-14 w-14 text-lg',
  lg: 'h-24 w-24 text-2xl',
};

export function Avatar({ src, fullName, size = 'sm', className = '' }: AvatarProps) {
  const sizeClass = SIZE_CLASSES[size];

  if (src) {
    return (
      <img
        src={src}
        alt={fullName}
        className={`shrink-0 rounded-full object-cover ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-neutral-100 font-bold text-neutral-600 ${sizeClass} ${className}`}
    >
      {getInitials(fullName)}
    </div>
  );
}
