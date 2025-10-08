import { useEffect, useMemo, useState } from 'react';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: {
    nom: string;
    prenom: string;
    email: string;
    numeroTelephone: string;
    cin: string;
    birthDate: string; // ISO YYYY-MM-DD
    userType: 'Client' | 'Agent' | 'Distributeur';
    adresse?: string;
  }) => void;
}

export const CreateUserModal = ({ open, onClose, onCreate }: CreateUserModalProps) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [numeroTelephone, setNumeroTelephone] = useState('');
  const [cin, setCin] = useState('');
  const [birth, setBirth] = useState('');
  const [userType, setUserType] = useState<'Client' | 'Agent' | 'Distributeur'>('Client');
  const [adresse, setAdresse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setNom(''); setPrenom(''); setEmail(''); setNumeroTelephone(''); setCin(''); setBirth(''); setUserType('Client'); setAdresse(''); setSubmitting(false);
    }
  }, [open]);

  const nameRegex = /[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g; // disallow digits and special chars

  const nomValid = useMemo(() => !!nom.trim() && !nameRegex.test(nom), [nom]);
  const prenomValid = useMemo(() => !!prenom.trim() && !nameRegex.test(prenom), [prenom]);

  const ageValid = useMemo(() => {
    if (!birth) return false;
    const d = new Date(birth);
    if (Number.isNaN(d.getTime())) return false;
    const now = new Date();
    const age = now.getFullYear() - d.getFullYear() - ((now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) ? 1 : 0);
    return age >= 18;
  }, [birth]);

  const isFuture = useMemo(() => {
    if (!birth) return false;
    const d = new Date(birth);
    if (Number.isNaN(d.getTime())) return false;
    const today = new Date();
    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return d.getTime() > today.getTime();
  }, [birth]);

  const todayStr = useMemo(() => {
    const t = new Date();
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, '0');
    const dd = String(t.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const cinValid = useMemo(() => /^\d{12}$/.test(cin), [cin]);

  const canSubmit = nomValid && prenomValid && email.trim() && numeroTelephone.replace(/\D/g, '').length >= 9 && cinValid && ageValid && !isFuture;

  function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    onCreate({ nom: nom.trim(), prenom: prenom.trim(), email: email.trim(), numeroTelephone: numeroTelephone.trim(), cin: cin.trim(), birthDate: birth, userType, adresse: adresse.trim() || undefined });
    setSubmitting(false);
  }

  if (!open) return null;

  function onKey(e: React.KeyboardEvent) { if (e.key === 'Escape') onClose(); }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center" onKeyDown={onKey} tabIndex={-1}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Créer un nouveau compte</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Nom *</label>
            <input
              className={`w-full border rounded-lg px-3 py-2 ${nom && !nomValid ? 'border-red-300' : 'border-gray-300'}`}
              value={nom}
              onChange={(e) => setNom(e.target.value.replace(nameRegex, ''))}
              placeholder="Lettres uniquement"
            />
            {nom && !nomValid && (
              <div className="text-[11px] text-red-600 mt-1">Le nom ne doit contenir que des lettres</div>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Prénom *</label>
            <input
              className={`w-full border rounded-lg px-3 py-2 ${prenom && !prenomValid ? 'border-red-300' : 'border-gray-300'}`}
              value={prenom}
              onChange={(e) => setPrenom(e.target.value.replace(nameRegex, ''))}
              placeholder="Lettres uniquement"
            />
            {prenom && !prenomValid && (
              <div className="text-[11px] text-red-600 mt-1">Le prénom ne doit contenir que des lettres</div>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Email *</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Numéro Carte d'Identité *</label>
            <input
              inputMode="numeric"
              pattern="\\d*"
              className={`w-full border rounded-lg px-3 py-2 ${cin && !cinValid ? 'border-red-300' : 'border-gray-300'}`}
              value={cin}
              onChange={(e) => setCin(e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="12 chiffres"
            />
            {cin && !cinValid ? (
              <div className="text-[11px] text-red-600 mt-1">Le numéro doit contenir exactement 12 chiffres</div>
            ) : (
              <div className="text-[11px] text-gray-500 mt-1">Exactement 12 chiffres</div>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Téléphone *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={numeroTelephone} onChange={(e) => setNumeroTelephone(e.target.value)} placeholder="au moins 9 chiffres" />
            <div className="text-[11px] text-gray-500 mt-1">Au moins 9 chiffres</div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Date de naissance *</label>
            <input
              type="date"
              max={todayStr}
              className={`w-full border rounded-lg px-3 py-2 ${birth && (isFuture || !ageValid) ? 'border-red-300' : 'border-gray-300'}`}
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
            />
            {birth && isFuture ? (
              <div className="text-[11px] text-red-600 mt-1">Veuillez revoir votre date de naissance</div>
            ) : birth && !ageValid ? (
              <div className="text-[11px] text-red-600 mt-1">Vous êtes mineur</div>
            ) : (
              <div className="text-[11px] text-gray-500 mt-1">Minimum 18 ans</div>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Type de compte *</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2" value={userType} onChange={(e) => setUserType(e.target.value as any)}>
              <option value="Client">Client</option>
              <option value="Agent">Agent</option>
              <option value="Distributeur">Distributeur</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-600 mb-1">Adresse</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={onClose}>ANNULER</button>
          <button disabled={!canSubmit || submitting} onClick={submit} className="px-4 py-2 rounded-lg bg-purple-700 text-white hover:opacity-90 disabled:opacity-60">CRÉER LE COMPTE</button>
        </div>
      </div>
    </div>
  );
};
