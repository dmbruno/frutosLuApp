interface MagicLinkSentProps {
  email: string;
}

export function MagicLinkSent({ email }: MagicLinkSentProps) {
  return (
    <div className="text-center">
      <p className="font-semibold">Revisá tu email</p>
      <p className="text-sm text-neutral-500">Te enviamos un link de acceso a {email}</p>
    </div>
  );
}
