import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './routes/PublicRoutes';
import PrivateRoute from './routes/PrivateRoutes';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WorkspacePage from './pages/WorkspacePage';
import WorkspaceDashboardPage from './pages/WorkspaceDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="min-h-screen bg-chailm-bg text-chailm-textMain font-sans">
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Auth Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Private Protected Workspace Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/workspace" element={<WorkspaceDashboardPage />} />
          <Route path="/workspace/:workspaceId" element={<WorkspacePage />} />
          <Route path="/workspace/:workspaceId/studio" element={<WorkspacePage />} />
          <Route path="/workspace/:workspaceId/studio/:featureType" element={<WorkspacePage />} />
          <Route path="/workspace/:workspaceId/studio/:featureType/:artifactId" element={<WorkspacePage />} />
          <Route path="/workspace/session/:sessionId" element={<WorkspacePage />} />
        </Route>

        {/* Fallback */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/workspace" replace />} />
      </Routes>
    </div>
  );
}

export default App;
