import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as maintenanceApi from '../api/maintenance';

const MAINTENANCE_KEY = ['maintenance'];
const VEHICLES_KEY = ['vehicles'];

function invalidateMaintenanceRelated(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: MAINTENANCE_KEY });
  queryClient.invalidateQueries({ queryKey: VEHICLES_KEY }); // opening/closing flips vehicle status
}

export function useMaintenanceLogs(filters: maintenanceApi.MaintenanceFilters) {
  return useQuery({
    queryKey: [...MAINTENANCE_KEY, filters],
    queryFn: () => maintenanceApi.listMaintenance(filters),
  });
}

export function useOpenMaintenance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: maintenanceApi.openMaintenance,
    onSuccess: () => invalidateMaintenanceRelated(queryClient),
  });
}

export function useCloseMaintenance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: maintenanceApi.closeMaintenance,
    onSuccess: () => invalidateMaintenanceRelated(queryClient),
  });
}
