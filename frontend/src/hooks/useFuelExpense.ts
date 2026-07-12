import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as fuelExpenseApi from '../api/fuelExpense';

const FUEL_LOGS_KEY = ['fuel-logs'];
const EXPENSES_KEY = ['expenses'];

export function useFuelLogs(filters: fuelExpenseApi.FuelLogFilters) {
  return useQuery({
    queryKey: [...FUEL_LOGS_KEY, filters],
    queryFn: () => fuelExpenseApi.listFuelLogs(filters),
  });
}

export function useCreateFuelLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fuelExpenseApi.createFuelLog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FUEL_LOGS_KEY }),
  });
}

export function useExpenses(filters: fuelExpenseApi.ExpenseFilters) {
  return useQuery({
    queryKey: [...EXPENSES_KEY, filters],
    queryFn: () => fuelExpenseApi.listExpenses(filters),
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fuelExpenseApi.createExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });
}
