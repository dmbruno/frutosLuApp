import { useAdherence } from '../../features/students/hooks/useAdherence';
import { signOut } from '../../features/auth/api';
import { AdherenceKpi } from '../../features/dashboard/components/AdherenceKpi';
import { TrafficLightBreakdown } from '../../features/dashboard/components/TrafficLightBreakdown';
import { UpcomingRenewals } from '../../features/dashboard/components/UpcomingRenewals';
import { AttentionAlerts } from '../../features/dashboard/components/AttentionAlerts';
import { ActivityFeed } from '../../features/dashboard/components/ActivityFeed';
import { RecentPrsList } from '../../features/dashboard/components/RecentPrsList';
import { WeeklyHighlights } from '../../features/dashboard/components/WeeklyHighlights';
import { AdherenceTrendChart } from '../../features/dashboard/components/AdherenceTrendChart';
import { ProfileDistributionChart } from '../../features/dashboard/components/ProfileDistributionChart';

export function DashboardPage() {
  const { data: students, isLoading } = useAdherence();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">Dashboard</h1>
        <button
          onClick={() => signOut()}
          className="cursor-pointer text-sm font-medium text-brand-pink transition-opacity hover:opacity-70 md:hidden"
        >
          Cerrar sesión
        </button>
      </div>

      <AdherenceKpi students={students} loading={isLoading} />

      <AttentionAlerts />

      <TrafficLightBreakdown students={students} loading={isLoading} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <UpcomingRenewals students={students} loading={isLoading} />
          <RecentPrsList />
          <WeeklyHighlights />
        </div>
        <ActivityFeed />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdherenceTrendChart />
        <ProfileDistributionChart />
      </div>

      <p className="text-sm text-neutral-500">{students?.length ?? 0} alumnos en total</p>
    </div>
  );
}
