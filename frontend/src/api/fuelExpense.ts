import { apiClient } from './client';
import { Vehicle } from './vehicles';

export interface FuelLog {
  id: string;
  vehicleId: string;
  tripId: string | null;
  liters: string;
  cost: string;
  loggedDate: string;
  vehicle?: Vehicle;
}

export interface Expense {
  id: string;
  vehicleId: string | null;
  tripId: string | null;
  category: string;
  amount: string;
  expenseDate: string;
  vehicle?: Vehicle;
}

export interface FuelLogFilters {
  vehicleId?: string;
}

export interface ExpenseFilters {
  vehicleId?: string;
  category?: string;
}

export interface CreateFuelLogInput {
  vehicleId: string;
  liters: number;
  cost: number;
}

export interface CreateExpenseInput {
  vehicleId?: string;
  category: string;
  amount: number;
}

export async function listFuelLogs(filters: FuelLogFilters = {}): Promise<FuelLog[]> {
  const { data } = await apiClient.get<FuelLog[]>('/fuel-logs', { params: filters });
  return data;
}

export async function createFuelLog(input: CreateFuelLogInput): Promise<FuelLog> {
  const { data } = await apiClient.post<FuelLog>('/fuel-logs', input);
  return data;
}

export async function listExpenses(filters: ExpenseFilters = {}): Promise<Expense[]> {
  const { data } = await apiClient.get<Expense[]>('/expenses', { params: filters });
  return data;
}

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  const { data } = await apiClient.post<Expense>('/expenses', input);
  return data;
}
