import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './routes/PublicRoutes';
import PrivateRoute from './routes/PrivateRoutes';
import WorkspacePage from './pages/WorkspacePage';
import NotFoundPage from './pages/NotFoundPage';

function generateRandomSessionId(): string {
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 11);
  return `session-${uuid}`;
}

function RedirectToNewSession() {
  const newSessionId = generateRandomSessionId();
  return <Navigate to={`/workspace/${newSessionId}`} replace />;
}

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      <Routes>
        {/* Open Route redirects to a new route session */}
        <Route path="/" element={<RedirectToNewSession />} />

        {/* Workspace Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/workspace" element={<RedirectToNewSession />} />
          <Route path="/workspace/:sessionId" element={<WorkspacePage />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          {/* Protected routes */}
        </Route>

        {/* Fallback */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
