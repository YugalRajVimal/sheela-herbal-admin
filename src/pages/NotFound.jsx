import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
        <Leaf size={28} className="text-green-600" />
      </div>
      <h1 className="font-display font-bold text-6xl text-gray-200 mb-2">404</h1>
      <p className="font-semibold text-xl text-gray-700 mb-2">Page Not Found</p>
      <p className="text-gray-400 text-sm mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <button onClick={() => navigate('/dashboard')} className="btn-primary">
        ← Back to Dashboard
      </button>
    </div>
  );
}
