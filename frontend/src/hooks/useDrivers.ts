import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as driversApi from '../api/drivers';

const DRIVERS_KEY = ['drivers'];

export function useDrivers(filters: driversApi.DriverFilters) {
  return useQuery({
    queryKey: [...DRIVERS_KEY, filters],
    queryFn: () => driversApi.listDrivers(filters),
  });
}

export function useAvailableDrivers() {
  return useQuery({
    queryKey: [...DRIVERS_KEY, 'available'],
    queryFn: driversApi.listAvailableDrivers,
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: driversApi.createDriver,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DRIVERS_KEY }),
  });
}

export function useSuspendDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => driversApi.suspendDriver(id, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DRIVERS_KEY }),
  });
}
