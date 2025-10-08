import type { Agent } from '../types/Agent';
import { StatusBadge } from './StatusBadge';
import { useEffect, useRef } from 'react';
import { Pencil, CircleSlash, CircleCheck, Archive as ArchiveIcon } from 'lucide-react';

interface DataTableProps {
  agents: Agent[];
  selected: number[];
  onToggle: (id: number) => void;
  onToggleAll: (checked: boolean) => void;
  onEdit?: (id: number) => void;
  onToggleStatus?: (id: number, next: 'Actif' | 'Inactif') => void;
  onArchive?: (id: number) => void;
}

function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
}: { checked: boolean; indeterminate: boolean; onChange: (v: boolean) => void }) {
  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);
  return (
    <input
      ref={ref}
      type="checkbox"
      className="w-4 h-4 accent-primary"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
}

function formatAmount(x: number | undefined) {
  if (typeof x !== 'number') return '0 FCFA';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(x);
}

function shortAccount(acc?: string) {
  if (!acc) return '';
  const onlyDigits = acc.replace(/\D/g, '');
  const lastSix = onlyDigits.slice(-6);
  return lastSix.padStart(6, '0');
}

export const DataTable = ({ agents, selected, onToggle, onToggleAll, onEdit, onToggleStatus, onArchive }: DataTableProps) => {
  const allChecked = agents.length > 0 && agents.every((a) => selected.includes(a.id));
  const isIndeterminate = !allChecked && agents.some((a) => selected.includes(a.id));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="w-full text-xs min-w-[800px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-3 py-3 text-left">
              <IndeterminateCheckbox
                checked={allChecked}
                indeterminate={isIndeterminate}
                onChange={(v) => onToggleAll(v)}
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Nom</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 hidden md:table-cell">Email</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 hidden sm:table-cell">Tél</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">N. Compte</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 hidden lg:table-cell">Type</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 hidden md:table-cell">Solde</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Statut</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {agents.map((agent) => (
            <tr key={agent.id} className="hover:bg-gray-50 transition">
              <td className="px-3 py-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary"
                  checked={selected.includes(agent.id)}
                  onChange={() => onToggle(agent.id)}
                />
              </td>
              <td className="px-4 py-3 text-xs text-gray-900">{`${agent.prenom} ${agent.nom}`}</td>
              <td className="px-4 py-3 text-xs text-gray-900 truncate max-w-[160px] hidden md:table-cell">{agent.email ?? ''}</td>
              <td className="px-4 py-3 text-xs text-gray-900 hidden sm:table-cell">{agent.numeroTelephone}</td>
              <td className="px-4 py-3 text-xs text-gray-900">{shortAccount(agent.accountNumber)}</td>
              <td className="px-4 py-3 text-xs text-gray-900 hidden lg:table-cell">{agent.userType ?? ''}</td>
              <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap hidden md:table-cell">{formatAmount(agent.solde)}</td>
              <td className="px-4 py-3"><StatusBadge status={agent.statut} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    title="Modifier"
                    className="p-2 rounded-lg hover:bg-purple-50 text-purple-700"
                    onClick={() => onEdit?.(agent.id)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    title={agent.statut === 'Actif' ? 'Bloquer' : 'Débloquer'}
                    className={`p-2 rounded-lg hover:opacity-90 ${agent.statut === 'Actif' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                    onClick={() => onToggleStatus?.(agent.id, agent.statut === 'Actif' ? 'Inactif' : 'Actif')}
                  >
                    {agent.statut === 'Actif' ? <CircleSlash size={16} /> : <CircleCheck size={16} />}
                  </button>
                  <button
                    title="Archiver"
                    className="p-2 rounded-lg hover:bg-amber-50 text-amber-600"
                    onClick={() => onArchive?.(agent.id)}
                  >
                    <ArchiveIcon size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

