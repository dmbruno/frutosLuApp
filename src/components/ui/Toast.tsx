interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <div className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white shadow-lg">{message}</div>
  );
}
