import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../features/auth/hooks/useRole';
import { Spinner } from '../ui';

interface ProtectedRouteProps {
  requireRole?: 'admin';
  requireOnboarding?: boolean;
  requireSubscription?: boolean;
}

export function ProtectedRoute({
  requireRole,
  requireOnboarding = true,
  requireSubscription = true,
  children,
}: PropsWithChildren<ProtectedRouteProps>) {
  const { loading, user, profile, role, subscriptionStatus } = useRole();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (requireOnboarding && role !== 'admin' && (!profile || !profile.onboarding_done)) {
    return <Navigate to="/onboarding" replace />;
  }
  if (requireRole === 'admin' && role !== 'admin') return <Navigate to="/" replace />;
  if (requireSubscription && !requireRole && role !== 'admin' && subscriptionStatus !== 'active') {
    return <Navigate to="/bloqueado" replace />;
  }

  return <>{children}</>;
}
