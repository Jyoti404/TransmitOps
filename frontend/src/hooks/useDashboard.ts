import { useQuery } from '@tanstack/react-query';
import * as dashboardApi from '../api/dashboard';

export function useDashboardKpis(filters: dashboardApi.DashboardFilters) {
  return useQuery({
    queryKey: ['dashboard-kpis', filters],
    queryFn: () => dashboardApi.getDashboardKpis(filters),
    // Polling stand-in for the socket.io live-push bonus feature (not built —
    // cut per the build plan's priority list). 10s keeps it feeling live
    // without hammering the Redis-cached endpoint.
    refetchInterval: 10_000,
  });
}
