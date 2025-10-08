interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

export const SearchBar = ({ value, onChange, placeholder = 'Rechercher', fullWidth = false }: SearchBarProps) => {
  return (
    <div className={fullWidth ? 'w-full' : 'w-full max-w-md mx-auto'}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-6 py-3 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-purple-500 ${fullWidth ? 'text-left' : 'text-center'}`}
      />
    </div>
  );
};
