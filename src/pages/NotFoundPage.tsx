import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h1 className="text-4xl font-bold text-slate-300">404 - Page Not Found</h1>
      <p className="text-slate-400">The page you are looking for does not exist.</p>
      <Link to="/" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm transition">
        Go Back Home
      </Link>
    </div>
  );
}
