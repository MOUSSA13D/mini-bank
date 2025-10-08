import { useRef, useState } from 'react';

export interface ProfileData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  photoUrl?: string | null;
}

interface ProfilePageProps {
  profile: ProfileData;
  onSave: (data: ProfileData) => void;
  onBack?: () => void;
}

export const ProfilePage = ({ profile, onSave, onBack }: ProfilePageProps) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(profile.photoUrl ?? null);
  const [prenom, setPrenom] = useState<string>(profile.prenom);
  const [nom, setNom] = useState<string>(profile.nom);
  const [email, setEmail] = useState<string>(profile.email);
  const [telephone, setTelephone] = useState<string>(profile.telephone);
  const [adresse, setAdresse] = useState<string>(profile.adresse);

  function onPick() {
    fileRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPhoto(url);
  }

  function save() {
    onSave({ prenom, nom, email, telephone, adresse, photoUrl: photo });
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Mon Profil</h1>
        {onBack && (
          <button onClick={onBack} className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800">Retour</button>
        )}
      </div>

      {/* Photo de profil */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Photo de profil</h2>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl overflow-hidden">
            {photo ? (
              <img src={photo} alt="Profil" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7h2a5 5 0 1 1 10 0h2c0-3.866-3.134-7-7-7z" />
              </svg>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onPick} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 hover:bg-gray-50">
              AJOUTER UNE PHOTO
            </button>
            <button onClick={() => setPhoto(null)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200">
              SUPPRIMER LA PHOTO
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          </div>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Informations personnelles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Nom *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Prénom *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Email **</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Téléphone</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-600 mb-1">Adresse</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={save} className="px-4 py-2 rounded-lg bg-purple-700 text-white hover:opacity-90">Enregistrer</button>
          <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={onBack}>Annuler</button>
        </div>
      </div>
    </div>
  );
};
