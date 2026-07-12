import { useQuery } from '@tanstack/react-query';
import { searchLocations } from '../api/geocode';
import { useDebouncedValue } from './useDebouncedValue';

const MIN_QUERY_LENGTH = 3;

export function useLocationSearch(rawQuery: string) {
  const query = useDebouncedValue(rawQuery.trim(), 350);

  return useQuery({
    queryKey: ['geocode', query],
    queryFn: () => searchLocations(query),
    enabled: query.length >= MIN_QUERY_LENGTH,
    staleTime: 60_000,
  });
}
