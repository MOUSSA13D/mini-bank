export interface Agent {
  id: number;
  prenom: string;
  nom: string;
  numeroTelephone: string;
  statut: 'Actif' | 'Inactif';
  email?: string;
  accountNumber?: string; // ex: DIS123...
  userType?: 'Client' | 'Distributeur' | 'Agent';
  solde?: number; // FCFA
  userNumber?: string; // 6-digit user number as string, e.g., "123456"
}
