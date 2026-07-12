import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Vehicles } from './pages/Vehicles';
import { Drivers } from './pages/Drivers';
import { Trips } from './pages/Trips';
import { Placeholder } from './pages/Placeholder';
import { AppShell } from './components/AppShell';
import { ProtectedRoute } from './routes/ProtectedRoute';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/maintenance" element={<Placeholder title="Maintenance" />} />
          <Route path="/fuel-expenses" element={<Placeholder title="Fuel & Expenses" />} />
          <Route path="/reports" element={<Placeholder title="Reports" />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
