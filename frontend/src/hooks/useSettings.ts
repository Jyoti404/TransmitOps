import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as settingsApi from '../api/settings';

const SETTINGS_KEY = ['settings'];

export function useSettings() {
  return useQuery({ queryKey: SETTINGS_KEY, queryFn: settingsApi.getSettings });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SETTINGS_KEY }),
  });
}
