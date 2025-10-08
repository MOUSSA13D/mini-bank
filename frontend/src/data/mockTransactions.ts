import type { Transaction } from '../types/Transaction';

// Aligned with mockAgents
// Distributeurs: Ibrahima Sarr (DIS1759746574902UJWT4), Khady Gueye (DIS1759764650604Z22GX),
// Boubacar Diop (DIS17596981233310Q0S), Mamadou Ndiaye (DIS1759660903659EFGH), Cheikh Sow (DIS1759888888888SOW)
// Clients: Aissatou Fall (CLI17596069037411JKL), Fatou Diallo (CLI1759000000000MAR)

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: 'Depot',
    montant: 50000,
    date: '2025-10-01T09:30:00Z',
    reference: 'TRX175970000001',
    statut: 'Succès',
    expediteur: 'Agent serge',
    destinataire: 'Ibrahima Sarr',
    accountNumber: 'DIS1759746574902UJWT4',
    userType: 'Distributeur',
  },
  {
    id: 2,
    type: 'Depot',
    montant: 120000,
    date: '2025-10-03T10:40:00Z',
    reference: 'TRX175970000002',
    statut: 'Succès',
    expediteur: 'Agent serge',
    destinataire: 'Mamadou Ndiaye',
    accountNumber: 'DIS1759660903659EFGH',
    userType: 'Distributeur',
  },
  {
    id: 3,
    type: 'Transfert',
    montant: 15000,
    date: '2025-10-01T11:15:00Z',
    reference: 'TRX175970000003',
    statut: 'Succès',
    expediteur: 'Cheikh Sow',
    destinataire: 'Fatou Diallo',
    accountNumber: 'CLI1759000000000MAR',
    userType: 'Client',
  },
  {
    id: 4,
    type: 'Transfert',
    montant: 8000,
    date: '2025-10-02T14:05:00Z',
    reference: 'TRX175970000004',
    statut: 'Échec',
    expediteur: 'Boubacar Diop',
    destinataire: 'Aissatou Fall',
    accountNumber: 'CLI17596069037411JKL',
    userType: 'Client',
  },
  {
    id: 5,
    type: 'Transfert',
    montant: 30000,
    date: '2025-10-03T16:22:00Z',
    reference: 'TRX175970000005',
    statut: 'Échec',
    expediteur: 'Khady Gueye',
    destinataire: 'Aissatou Fall',
    accountNumber: 'CLI17596069037411JKL',
    userType: 'Client',
  },
];
