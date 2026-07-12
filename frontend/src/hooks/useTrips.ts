import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as tripsApi from '../api/trips';

const TRIPS_KEY = ['trips'];
const VEHICLES_KEY = ['vehicles'];
const DRIVERS_KEY = ['drivers'];
function invalidateTripRelated(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: TRIPS_KEY });
  queryClient.invalidateQueries({ queryKey: VEHICLES_KEY });
  queryClient.invalidateQueries({ queryKey: DRIVERS_KEY });
}

export function useTrips(filters: tripsApi.TripFilters) {
  return useQuery({
    queryKey: [...TRIPS_KEY, filters],
    queryFn: () => tripsApi.listTrips(filters),
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripsApi.createTrip,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TRIPS_KEY }),
  });
}

export function useDispatchTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripsApi.dispatchTrip,
    onSuccess: () => invalidateTripRelated(queryClient),
  });
}

export function useCompleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: tripsApi.CompleteTripInput }) => tripsApi.completeTrip(id, input),
    onSuccess: () => invalidateTripRelated(queryClient),
  });
}

export function useCancelTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripsApi.cancelTrip,
    onSuccess: () => invalidateTripRelated(queryClient),
  });
}
