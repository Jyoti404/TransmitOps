import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as vehiclesApi from '../api/vehicles';

const VEHICLES_KEY = ['vehicles'];

export function useVehicles(filters: vehiclesApi.VehicleFilters) {
  return useQuery({
    queryKey: [...VEHICLES_KEY, filters],
    queryFn: () => vehiclesApi.listVehicles(filters),
  });
}

export function useAvailableVehicles() {
  return useQuery({
    queryKey: [...VEHICLES_KEY, 'available'],
    queryFn: vehiclesApi.listAvailableVehicles,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vehiclesApi.createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_KEY });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: vehiclesApi.UpdateVehicleInput }) =>
      vehiclesApi.updateVehicle(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_KEY });
    },
  });
}
