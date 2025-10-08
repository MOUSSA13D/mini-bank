import { Users, Banknote, XCircle, History, LayoutDashboard } from 'lucide-react';

export type SidebarKey = 'Dashboard' | 'Utilisateur' | 'Depot' | 'Annuler' | 'Historique';

interface SidebarProps {
  active: SidebarKey;
  onChange: (key: SidebarKey) => void;
  logoSrc?: string;
}

const items: { key: SidebarKey; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { key: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'Utilisateur', label: 'Gestion des Utilisateurs', icon: Users },
  { key: 'Depot', label: 'Dépôt', icon: Banknote },
  { key: 'Annuler', label: 'Annuler', icon: XCircle },
  { key: 'Historique', label: 'Historique', icon: History },
];

export const Sidebar = ({ active, onChange, logoSrc }: SidebarProps) => {
  return (
    <aside className="w-full sm:w-64 bg-white rounded-2xl shadow-md p-4 h-max">
      {/* Top centered logo */}
      {logoSrc && (
        <div className="flex items-center justify-center py-6">
          <img src={logoSrc} alt="Logo" className="w-14 h-14 object-contain" />
        </div>
      )}
      <nav className="space-y-2">
        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition border
              ${active === key ? 'bg-blue-100 text-gray-900 border-blue-200' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
          >
            <Icon size={18} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
