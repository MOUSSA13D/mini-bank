import type { Transaction } from '../types/Transaction';

function formatAmount(x: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(x);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('fr-FR', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export const CancelTransactionsTable = ({ data }: { data: Transaction[] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
      <table className="w-full text-sm min-w-[900px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Numéro</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Montant</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Propriétaire</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acteurs</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-3 text-gray-900 text-sm">{t.reference}</td>
              <td className="px-6 py-3 text-gray-900 text-sm whitespace-nowrap">{formatDate(t.date)}</td>
              <td className="px-6 py-3 text-gray-900 text-sm">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">{t.type}</span>
              </td>
              <td className="px-6 py-3 text-gray-900 text-sm whitespace-nowrap">{formatAmount(t.montant)}</td>
              <td className="px-6 py-3 text-gray-900 text-sm">
                <div className="flex items-center gap-2">
                  <span>{t.destinataire || t.expediteur || '—'}</span>
                  {t.userType && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-gray-300 text-gray-700">
                      {t.userType}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-3 text-gray-700 text-xs">
                <div>Dist: {t.destinataire || '-'}</div>
                <div>Agent: {t.expediteur || '-'}</div>
              </td>
              <td className="px-6 py-3 text-gray-900 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.statut === 'Succès' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {t.statut === 'Succès' ? 'Validée' : 'Échec'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
