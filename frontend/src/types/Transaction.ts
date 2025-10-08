export type TransactionType = 'Depot' | 'Transfert';
export type TransactionStatus = 'Succès' | 'Échec' | 'En attente';
export type UserType = 'Client' | 'Distributeur';

export interface Transaction {
  id: number;
  type: TransactionType;
  montant: number; // en FCFA
  date: string; // ISO string
  expediteur?: string;
  destinataire?: string;
  reference: string;
  statut: TransactionStatus;
  accountNumber: string;
  userType: UserType;
}
