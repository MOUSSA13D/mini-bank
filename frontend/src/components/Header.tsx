import { Menu, User, LogOut, Pencil } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface HeaderProps {
  onMenuClick?: () => void;
  logoSrc?: string;
  onEditProfile?: () => void;
  onLogout?: () => void;
  profileName?: string;
  profileImageSrc?: string;
  profileEmail?: string;
}

export const Header = ({ onMenuClick, logoSrc = '/logo.png', onEditProfile, onLogout, profileName = 'Utilisateur', profileImageSrc, profileEmail }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <header className="relative bg-primary text-white px-6 py-4 flex items-center justify-between">
      {/* Left: Hamburger */}
      <button
        aria-label="Ouvrir le menu"
        className="p-2 hover:bg-white/10 rounded-lg transition"
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </button>

      {/* Center: Logo + Title (absolutely centered) */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
        <img src={logoSrc} alt="Logo" className="w-6 h-6 rounded-md object-contain" />
        <h1 className="text-xl font-semibold">Agent</h1>
      </div>

      {/* Right: name, red avatar with dropdown */}
      <div className="relative flex items-center gap-3" ref={menuRef}>
        <span className="hidden sm:inline text-sm font-medium">{profileName}</span>
        <button
          className="p-1.5 rounded-full transition"
          aria-label="Profil"
          onClick={() => setOpen((v) => !v)}
        >
          {profileImageSrc ? (
            <img src={profileImageSrc} alt="Profil" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">
              <User size={20} />
            </div>
          )}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => { setOpen(false); onEditProfile?.(); }}
            >
              <Pencil size={16} />
              <span>Modifier</span>
            </button>
            <div className="h-px bg-gray-100" />
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
              onClick={() => { setOpen(false); onLogout?.(); }}
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-600">
              <div className="font-medium text-gray-800">{profileName}</div>
              {profileEmail && <div className="truncate">{profileEmail}</div>}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// function computeInitials(name: string) {
//   if (!name) return 'U';
//   const parts = name.trim().split(/\s+/).filter(Boolean);
//   const first = parts[0]?.[0] ?? '';
//   const second = parts.length > 1 ? parts[1][0] : (parts[0]?.[1] ?? '');
//   return (first + second).toUpperCase();
// }
