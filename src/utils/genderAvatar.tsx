export const Avatar = ({ gender, name, size = 40 }: {
  gender: string;
  name: string;
  size?: number;
}) => {
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&gender=${gender}`;
  
  return (
    <div className="relative">
      <img 
        src={avatarUrl} 
        alt={`${gender} avatar`}
        width={size}
        height={size}
        className="rounded-full ring-2 ring-white shadow-sm bg-gradient-to-br from-blue-500 to-purple-600"
      />
      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
    </div>
  );
};
  