import { Link } from 'react-router-dom';
import { Card, EmptyState, Spinner } from '../../../components/ui';
import type { Program } from '../../../types/domain';

interface TemplateLibraryProps {
  templates: Program[] | undefined;
  loading: boolean;
}

export function TemplateLibrary({ templates, loading }: TemplateLibraryProps) {
  if (loading) return <Spinner />;
  if (!templates || templates.length === 0) {
    return <EmptyState title="Sin plantillas" description="Creá la primera con el botón de arriba." />;
  }

  return (
    <div className="flex flex-col gap-2">
      {templates.map((template) => (
        <Link key={template.id} to={`/admin/plantillas/${template.id}`}>
          <Card className="hover:shadow-md">
            <p className="font-medium">{template.name}</p>
            <p className="text-sm text-neutral-500">
              {template.total_weeks ?? '—'} semanas · ciclo {template.cycle_pattern?.join(',') ?? '—'}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
