import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { getProfile, createProfile } from '../api';

export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (user && profileQuery.isSuccess && profileQuery.data === null) {
      createProfile(user.id, user.email ?? 'Sin nombre').then(() => {
        queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      });
    }
  }, [user, profileQuery.isSuccess, profileQuery.data, queryClient]);

  return {
    loading: authLoading || (!!user && profileQuery.isLoading),
    user,
    profile: profileQuery.data ?? null,
    role: profileQuery.data?.role ?? null,
    subscriptionStatus: profileQuery.data?.subscription_status ?? null,
  };
}
