import { useMutation } from '@tanstack/react-query';
import * as jobsApi from '../api/jobs';

export function useRunJob() {
  return useMutation({ mutationFn: jobsApi.runJob });
}
