import { useEffect, useState } from 'react';
import logo from '../assets/16_02_44.png';

export const LoginPage = ({ onLogin, allowedEmail, allowedPassword }: { onLogin?: (email: string) => void; allowedEmail?: string; allowedPassword?: string }) => {
  const DEFAULT_EMAIL = 'moussa@gmail.com';
  const DEFAULT_PASSWORD = '123456';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Prefill email with the profile email if provided
    if (allowedEmail) setEmail(allowedEmail);
  }, [allowedEmail]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setLoading(true);
    // Fake submit then notify parent
    setTimeout(() => {
      setLoading(false);
      const validEmail = allowedEmail ?? DEFAULT_EMAIL;
      const validPassword = allowedPassword ?? DEFAULT_PASSWORD;
      if (email === validEmail && password === validPassword) {
        onLogin?.(email);
      } else {
        setError('Email ou mot de passe incorrect.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          {/* Same logo */}
          <img src={logo} alt="Mini Banque" className="h-12 w-auto mb-3" />
          <h1 className="text-3xl font-semibold text-gray-900">Mini Banque</h1>
          <p className="text-gray-500 mt-1">Connexion Agent</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
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
