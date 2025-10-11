import { useEffect, useState } from 'react';
import logo from '../assets/16_02_44.png';

interface LoginPageProps {
  onLogin?: (email: string, name?: string) => void;
  allowedEmail?: string;
}

export const LoginPage = ({ onLogin, allowedEmail }: LoginPageProps) => {
  const [email, setEmail] = useState('moussa@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Base URL de l'API: utilise VITE_API_BASE en priorité (ex: http://localhost:4000)
  // sinon retombe sur le localhost en dev
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000';

  // Pré-remplir l'email si fourni
  useEffect(() => {
    if (allowedEmail) setEmail(allowedEmail);
  }, [allowedEmail]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setLoading(true);

    try {
      // Correspond à la route backend: server/routes/auth.js -> router.post('/login', ...)
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // Le backend renvoie: { _id, email, fullName, token }
      if (res.ok && data.token) {
        onLogin?.(data.email, data.fullName);
      } else {
        setError(data.message || 'Email ou mot de passe incorrect');
      }
    } catch (err) {
      console.error(err);
      setError('Impossible de contacter le serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Mini Banque" className="h-12 w-auto mb-3" />
          <h1 className="text-3xl font-semibold text-gray-900">Mini Banque</h1>
          <p className="text-gray-500 mt-1">Connexion Agent</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-700 text-white py-3 font-medium hover:opacity-95 disabled:opacity-60"
          >
            {loading ? 'Connexion...' : 'SE CONNECTER'}
          </button>
        </form>
      </div>
    </div>
  );
};
