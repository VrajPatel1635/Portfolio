import React from 'react';

const variants = {
  primary: "bg-[#0a0a0a] text-white hover:shadow-lg before:absolute before:inset-0 before:w-[45%] before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent before:-translate-x-full before:skew-x-[-15deg] hover:before:animate-[shimmer_0.65s_ease_forwards]",
  outline: "border-2 border-dashed border-[#0a0a0a]/30 text-[#0a0a0a] hover:text-white hover:border-solid hover:border-[#0a0a0a] before:absolute before:inset-0 before:bg-[#0a0a0a] before:scale-x-0 before:origin-left hover:before:scale-x-100 before:transition-transform before:duration-300 before:z-[-1]",
  inversePrimary: "bg-white text-[#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(0,0,0,0.25),0_4px_14px_rgba(0,0,0,0.2)] before:absolute before:inset-0 before:w-[45%] before:bg-gradient-to-r before:from-transparent before:via-black/10 before:to-transparent before:-translate-x-full before:skew-x-[-15deg] hover:before:animate-[shimmer_0.65s_ease_forwards]",
  inverseOutline: "border-2 border-dashed border-white/45 text-white hover:text-[#0a0a0a] hover:border-solid hover:border-white hover:bg-white before:absolute before:inset-0 before:bg-white before:scale-x-0 before:origin-left hover:before:scale-x-100 before:transition-transform before:duration-300 before:z-[-1]"
};

export const Button = ({ variant = 'primary', as = 'button', className, children, ...props }) => {
  const Component = as;
  const baseClasses = "inline-flex items-center justify-center gap-2 px-[36px] py-[15px] font-body text-[13px] font-bold uppercase tracking-[0.18em] rounded-[2px] transition-all duration-300 relative overflow-hidden isolation-auto cursor-pointer";
  return (
    <Component className={`${baseClasses} ${variants[variant]} ${className || ''}`} {...props}>
      {children}
    </Component>
  );
};
