export default function Button({ variant = "light", children, onClick, disabled, className = "" }) {
  const base = "px-6 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all";
  
  const variants = {
    light: "bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200",
    primary: "bg-blue-600 text-white hover:bg-blue-700"
  };
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
