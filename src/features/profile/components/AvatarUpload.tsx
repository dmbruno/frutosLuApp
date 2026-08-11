import { useRef } from 'react';
import { Camera } from 'lucide-react';
import { Avatar } from '../../../components/ui';

interface AvatarUploadProps {
  avatarUrl: string | null;
  fullName: string;
  onUpload: (file: File) => void;
  uploading?: boolean;
}

export function AvatarUpload({ avatarUrl, fullName, onUpload, uploading }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative inline-block shrink-0">
      <Avatar src={avatarUrl} fullName={fullName} size="lg" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label="Cambiar foto de perfil"
        className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white shadow transition hover:bg-neutral-800 disabled:opacity-50"
      >
        <Camera size={15} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) onUpload(file);
        }}
      />
    </div>
  );
}
