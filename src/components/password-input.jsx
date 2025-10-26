import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function PasswordInput({ className, showPassword, onTogglePassword, ...props }) {
  const [internalShowPassword, setInternalShowPassword] = useState(false);
  
  const isControlled = showPassword !== undefined;
  const passwordVisible = isControlled ? showPassword : internalShowPassword;
  
  const handleToggle = () => {
    if (isControlled && onTogglePassword) {
      onTogglePassword(!showPassword);
    } else {
      setInternalShowPassword(!internalShowPassword);
    }
  };

  return (
    <div className="relative">
      <Input
        type={passwordVisible ? 'text' : 'password'}
        autoComplete="new-password"
        className={cn('pr-10', className)}
        {...props}
      />
      <button
        type="button"
        onClick={handleToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8892b0] hover:text-[#64ffda] transition-colors focus:outline-none"
        tabIndex={-1}
      >
        {passwordVisible ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}