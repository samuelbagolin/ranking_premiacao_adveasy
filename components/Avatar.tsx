
import React from 'react';

interface AvatarProps {
  src: string;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar: React.FC<AvatarProps> = ({ src, name, className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-slate-700 ring-2 ring-slate-600/50 ${sizeMap[size]} ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={name} 
          className="h-full w-full object-cover" 
          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`; }}
        />
      ) : (
        <span className="font-medium text-slate-300">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default Avatar;
