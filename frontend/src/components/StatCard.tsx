interface StatCardProps {
  label: string;
  value: number;
}

export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="bg-blue-600 rounded-full shadow-md w-40 h-40 flex flex-col items-center justify-center">
      <p className="text-white/90 text-sm text-center mb-2 px-2">{label}</p>
      <p className="text-white text-4xl font-bold">{value}</p>
    </div>
  );
};
