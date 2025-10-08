import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { SearchBar } from '../components/SearchBar';
import { DataTable } from '../components/DataTable';
import { Pagination } from '../components/Pagination';
import { mockAgents } from '../data/mockAgents';
import type { Agent } from '../types/Agent';
import { Sidebar, type SidebarKey } from '../components/Sidebar';
import { X, Plus, CheckCircle, Archive } from 'lucide-react';
import logo from '../assets/16_02_44.png';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { CreateUserModal } from '../components/CreateUserModal';
import { TransactionsTable } from '../components/TransactionsTable';
import { CancelTransactionsTable } from '../components/CancelTransactionsTable';
import { ProfilePage, type ProfileData } from './ProfilePage';
import { DepositForm } from '../components/DepositForm';
import { mockTransactions } from '../data/mockTransactions';
import { LoginPage } from './LoginPage';

export const AgentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [active, setActive] = useState<SidebarKey>('Dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [usersTab, setUsersTab] = useState<'actifs' | 'archives'>('actifs');
  const [cancelSearch, setCancelSearch] = useState('');
  const [historyStatus, setHistoryStatus] = useState<'Tous' | 'Validée' | 'Annulée'>('Tous');
  const [showProfile, setShowProfile] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    prenom: 'MOUSSA',
    nom: 'DIATTA',
    email: 'moussa@gmail.com',
    telephone: '+221772000101',
    adresse: 'Dakar, Senegal',
    photoUrl: null,
  });
  const [flash, setFlash] = useState<string | null>(null);
  const [confirmUserAction, setConfirmUserAction] = useState<
    | { id: number; type: 'toggle'; next: 'Actif' | 'Inactif' }
    | { id: number; type: 'archive' }
    | { ids: number[]; type: 'bulkToggle'; next: 'Actif' | 'Inactif' }
    | null
  >(null);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('profile');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setProfile((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {}
  }, []);

  // Filter agents based on search query (includes email and account number)
  const searchLc = searchQuery.toLowerCase();
  const searchFiltered = agents.filter((agent) => {
    const email = (agent.email ?? '').toLowerCase();
    const acc = (agent.accountNumber ?? '').toLowerCase();
    return (
      agent.prenom.toLowerCase().includes(searchLc) ||
      agent.nom.toLowerCase().includes(searchLc) ||
      agent.numeroTelephone.toLowerCase().includes(searchLc) ||
      email.includes(searchLc) ||
      acc.includes(searchLc)
    );
  });
  const filteredAgents = searchFiltered.filter((a) =>
    usersTab === 'actifs' ? a.statut === 'Actif' : a.statut === 'Inactif'
  );

  const actifsCount = agents.filter((a) => a.statut === 'Actif').length;
  const archivesCount = agents.filter((a) => a.statut === 'Inactif').length;

  // Pagination for users: 5 per page
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / pageSize));
  const start = (currentPage - 1) * pageSize;
  const pagedAgents = filteredAgents.slice(start, start + pageSize);

  // Filter transactions by account number (digits) or names (expediteur/destinataire)
  const q = searchQuery.trim().toLowerCase();
  const filteredTransactions = mockTransactions.filter((t) => {
    if (!q) return true;
    const acc = t.accountNumber.replace(/\D/g, '').toLowerCase();
    const exp = (t.expediteur ?? '').toLowerCase();
    const dest = (t.destinataire ?? '').toLowerCase();
    return acc.includes(q.replace(/\D/g, '')) || exp.includes(q) || dest.includes(q);
  });

  // Apply status filter for Historique tab
  const historyData = filteredTransactions.filter((t) => {
    if (historyStatus === 'Tous') return true;
    const isOk = t.statut === 'Succès';
    return historyStatus === 'Validée' ? isOk : !isOk;
  });

  // Only deposits performed by distributors
  const distributorDeposits = filteredTransactions.filter(
    (t) => t.type === 'Depot' && t.userType === 'Distributeur'
  );

  // Cancel page: filter by reference number
  const cancelList = mockTransactions.filter((t) =>
    t.reference.toLowerCase().includes(cancelSearch.trim().toLowerCase())
  );

  // Stats: link numbers to actual data
  const nbDistributeur = new Set(
    mockTransactions.filter((t) => t.userType === 'Distributeur').map((t) => t.accountNumber)
  ).size;
  const nbClient = new Set(
    mockTransactions.filter((t) => t.userType === 'Client').map((t) => t.accountNumber)
  ).size;
  const nbAgent = agents.length;

  // Recent transactions count equals sum of the three blue stats
  const recentCount = nbDistributeur + nbClient + nbAgent;
  // Sort all transactions by most recent
  const recentTransactions = [...mockTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (!isLoggedIn) {
    return <LoginPage allowedEmail={profile.email} onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuClick={() => setDrawerOpen(true)}
        logoSrc={logo}
        onEditProfile={() => setShowProfile(true)}
        onLogout={() => setConfirmLogoutOpen(true)}
        profileName={`${profile.prenom} ${profile.nom}`}
        profileImageSrc={profile.photoUrl ?? undefined}
        profileEmail={profile.email}
      />
      {/* Success toast */}
      {flash && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-2 shadow">
          {flash}
        </div>
      )}
      <main className="container mx-auto px-4 py-8">
        <div>
          {showProfile ? (
            <ProfilePage
              profile={profile}
              onSave={(data) => {
                setProfile(data);
                try { localStorage.setItem('profile', JSON.stringify(data)); } catch {}
                setShowProfile(false);
                setFlash('Enregistrement validé');
                setTimeout(() => setFlash(null), 2000);
              }}
              onBack={() => setShowProfile(false)}
            />
          ) : (
            <>
            {active === 'Dashboard' && (
              <div className="grid gap-4">
                {/* Stats Cards (only on Dashboard) */}
                <div className="flex justify-center gap-6 mb-2">
                  <StatCard label="Nombre de distributeurs" value={nbDistributeur} />
                  <StatCard label="Nombre de clients" value={nbClient} />
                  <StatCard label="Nombre d'agents" value={nbAgent} />
                </div>
                <div className="mb-4">
                  <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>
                <TransactionsTable data={recentTransactions} limit={recentCount} />
              </div>
            )}

            {/* Confirm user action */}
            <ConfirmDialog
              open={!!confirmUserAction}
              title={
                confirmUserAction?.type === 'archive'
                  ? "Archiver l'utilisateur"
                  : confirmUserAction?.type === 'bulkToggle'
                  ? (confirmUserAction.next === 'Inactif' ? 'Bloquer la sélection' : 'Débloquer la sélection')
                  : confirmUserAction?.next === 'Inactif'
                  ? "Bloquer l'utilisateur"
                  : "Débloquer l'utilisateur"
              }
              message={
                confirmUserAction?.type === 'archive'
                  ? "Confirmez-vous l'archivage de cet utilisateur ?"
                  : confirmUserAction?.type === 'bulkToggle'
                  ? `Appliquer le statut ${confirmUserAction.next} à ${confirmUserAction.ids.length} utilisateur(s) ?`
                  : confirmUserAction?.next === 'Inactif'
                  ? "Confirmez-vous le blocage de cet utilisateur ?"
                  : "Confirmez-vous le déblocage de cet utilisateur ?"
              }
              confirmText="Confirmer"
              cancelText="Annuler"
              onCancel={() => setConfirmUserAction(null)}
              onConfirm={() => {
                if (!confirmUserAction) return;
                if (confirmUserAction.type === 'archive') {
                  const { id } = confirmUserAction;
                  setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, statut: 'Inactif' } : a)));
                } else if (confirmUserAction.type === 'toggle') {
                  const { id, next } = confirmUserAction;
                  setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, statut: next } : a)));
                } else if (confirmUserAction.type === 'bulkToggle') {
                  const { ids, next } = confirmUserAction;
                  setAgents((prev) => prev.map((a) => (ids.includes(a.id) ? { ...a, statut: next } : a)));
                  setSelectedIds([]);
                }
                setConfirmUserAction(null);
              }}
            />
            {active === 'Utilisateur' && (
              <>
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 text-white text-sm font-medium hover:opacity-90"
                    onClick={() => setCreateOpen(true)}
                  >
                    Créer un compte
                  </button>
                </div>

                {/* Bulk actions bar when some rows are selected */}
                {selectedIds.length > 0 && (
                  <div className="mb-3 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
                    <div>
                      <span className="font-medium">{selectedIds.length}</span> utilisateur(s) sélectionné(s)
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:opacity-90"
                        onClick={() => setConfirmUserAction({ ids: selectedIds, type: 'bulkToggle', next: 'Inactif' })}
                      >
                        Bloquer la sélection
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-green-600 text-white hover:opacity-90"
                        onClick={() => setConfirmUserAction({ ids: selectedIds, type: 'bulkToggle', next: 'Actif' })}
                      >
                        Débloquer la sélection
                      </button>
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="flex items-center gap-6 mb-4">
                  <button
                    className={`inline-flex items-center gap-2 px-2 py-1 border-b-2 ${usersTab === 'actifs' ? 'border-purple-700 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setUsersTab('actifs')}
                  >
                    <CheckCircle size={16} />
                    <span className="font-medium">Utilisateurs Actifs ({actifsCount})</span>
                  </button>
                  <button
                    className={`inline-flex items-center gap-2 px-2 py-1 border-b-2 ${usersTab === 'archives' ? 'border-purple-700 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setUsersTab('archives')}
                  >
                    <Archive size={16} />
                    <span className="font-medium">Utilisateurs Archivés ({archivesCount})</span>
                  </button>
                </div>
                <div className="mb-8">
                  <SearchBar
                    value={searchQuery}
                    onChange={(v) => {
                      setSearchQuery(v);
                      setCurrentPage(1); // reset to first page on search
                    }}
                    placeholder="Rechercher par Email, ID ou Numéro de compte..."
                  />
                </div>
                <div className="mb-2 text-sm text-gray-600">
                  {selectedIds.length > 0 ? `${selectedIds.length} sélectionné(s)` : 'Aucune sélection'}
                </div>
                <div className="mb-6">
                  <DataTable
                    agents={pagedAgents}
                    selected={selectedIds}
                    onToggle={(id) =>
                      setSelectedIds((prev) =>
                        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                      )
                    }
                    onToggleAll={(checked) =>
                      setSelectedIds(checked ? pagedAgents.map((a) => a.id) : [])
                    }
                    onEdit={(id) => {
                      const user = agents.find((a) => a.id === id);
                      if (user) alert(`Modifier: ${user.prenom} ${user.nom}`);
                    }}
                    onToggleStatus={(id, next) => {
                      setConfirmUserAction({ id, type: 'toggle', next });
                    }}
                    onArchive={(id) => {
                      setConfirmUserAction({ id, type: 'archive' });
                    }}
                  />
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}

            {active === 'Depot' && (
              <div className="grid gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Créditer un Distributeur</h2>
                <DepositForm onSubmit={({ account, amount }) => alert(`Compte ${account} crédité de ${amount.toLocaleString('fr-FR')} FCFA`)} />
              </div>
            )}

            {active === 'Historique' && (
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Historique des Transactions</h2>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Filtrer par statut</label>
                    <select
                      className="border rounded-lg px-3 py-2 text-sm"
                      value={historyStatus}
                      onChange={(e) => setHistoryStatus(e.target.value as any)}
                    >
                      <option>Tous</option>
                      <option>Validée</option>
                      <option>Annulée</option>
                    </select>
                  </div>
                </div>
                <div className="mb-2">
                  <SearchBar value={searchQuery} onChange={setSearchQuery} fullWidth placeholder="Rechercher..." />
                </div>
                <TransactionsTable data={historyData} />
              </div>
            )}

            {active === 'Annuler' && (
              <div className="grid gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Annuler une Transaction</h2>
                <CancelTransactionsTable data={cancelList} />
                <div className="bg-white rounded-2xl shadow-md p-4">
                  <div className="mb-2 text-sm text-gray-700">Rechercher une transaction par numéro</div>
                  <SearchBar
                    value={cancelSearch}
                    onChange={setCancelSearch}
                    placeholder="Numéro de transaction (ex: TRX...)"
                    fullWidth
                  />
                </div>
              </div>
            )}
            </>
          )}
        </div>
      </main>

      

      {/* Drawer for small screens, toggled by hamburger */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Panel */}
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold">Menu</h3>
              <button
                aria-label="Fermer"
                className="p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setDrawerOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <Sidebar
              active={active}
              logoSrc={logo}
              onChange={(k) => {
                setActive(k);
                setDrawerOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Logout confirmation dialog */}
      <ConfirmDialog
        open={confirmLogoutOpen}
        title="Confirmation"
        message="Voulez-vous vous déconnecter ?"
        confirmText="Oui"
        cancelText="Non"
        onConfirm={() => {
          setConfirmLogoutOpen(false);
          setIsLoggedIn(false);
        }}
        onCancel={() => setConfirmLogoutOpen(false)}
      />

      {/* Create user modal */}
      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(p) => {
          const nextId = Math.max(0, ...agents.map((a) => a.id)) + 1;
          const prefix = p.userType === 'Distributeur' ? 'DIS' : p.userType === 'Client' ? 'CLI' : 'AGT';
          const accountNumber = `${prefix}${Date.now()}`;
          const userNumber = String(Math.floor(100000 + Math.random() * 900000));
          const newAgent: Agent = {
            id: nextId,
            prenom: p.prenom,
            nom: p.nom,
            email: p.email,
            numeroTelephone: p.numeroTelephone,
            accountNumber,
            userType: p.userType,
            solde: 0,
            userNumber,
            statut: 'Actif',
          };
          setAgents((prev) => [newAgent, ...prev]);
          setCreateOpen(false);
          setFlash('Compte créé avec succès');
          setTimeout(() => setFlash(null), 2000);
        }}
      />
    </div>
  );
}
