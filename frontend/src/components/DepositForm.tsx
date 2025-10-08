import { useState } from 'react';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];

export const DepositForm = ({ onSubmit }: { onSubmit?: (payload: { account: string; amount: number }) => void }) => {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState<number | ''>('');

  const minAmount = 100; // FCFA
  const valid = account.trim().length >= 5 && typeof amount === 'number' && amount >= minAmount;

  const handleQuick = (v: number) => setAmount(v);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    onSubmit?.({ account: account.trim(), amount: amount as number });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Créditer un compte Distributeur</h3>

      <label className="block text-sm text-gray-700 mb-2">Numéro de compte Distributeur</label>
      <input
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        type="text"
        placeholder="Numéro de compte Distributeur"
        className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
      />

      <div className="mb-2 text-sm font-medium text-gray-700">Montants rapides :</div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {QUICK_AMOUNTS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => handleQuick(v)}
            className={`px-3 py-2 rounded-xl border transition ${amount === v ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
          >
            {v.toLocaleString('fr-FR')}
          </button>
        ))}
      </div>

      <label className="block text-sm text-gray-700 mb-2">Montant (FCFA)</label>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
        inputMode="numeric"
        type="number"
        min={minAmount}
        placeholder="Montant (FCFA)"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <div className="text-xs text-gray-500 mt-2">Montant minimum : {minAmount.toLocaleString('fr-FR')} FCFA ou choisissez un montant rapide ci-dessus</div>

      <button
        type="submit"
        disabled={!valid}
        className={`mt-6 w-full px-4 py-3 rounded-xl font-semibold transition ${valid ? 'bg-primary text-white hover:opacity-90' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
      >
        CRÉDITER LE DISTRIBUTEUR
      </button>
    </form>
  );
};
