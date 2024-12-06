import { ReactNode } from 'react';
import { Tv } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600 via-gray-900 to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mb-4 shadow-lg shadow-blue-500/20">
            <Tv className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            IPTV Player
          </h1>
          <p className="text-gray-400">
            Entre com suas credenciais para acessar
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}