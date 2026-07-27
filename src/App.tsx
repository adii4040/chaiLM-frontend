import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './routes/PublicRoutes';
import PrivateRoute from './routes/PrivateRoutes';
import LandingPage from './pages/LandingPage';
import WorkspacePage from './pages/WorkspacePage';
import WorkspaceDashboardPage from './pages/WorkspaceDashboardPage';
import NotFoundPage from './pages/NotFoundPage';



function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Workspace Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/workspace" element={<WorkspaceDashboardPage />} />
          <Route path="/workspace/:sessionId" element={<WorkspacePage />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          {/* Protected routes */}
        </Route>

        {/* Fallback */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/workspace" replace />} />
      </Routes>
    </div>
  );
}

export default App;
