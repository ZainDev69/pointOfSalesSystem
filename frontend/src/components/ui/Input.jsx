export function Input ({label,value,onChange,placeholder,type = "text",required = false,full = false,disabled = false}){
    return (
        <div className={full ? "md:col-span-2" : ""}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            type={type}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              disabled ? "bg-gray-200 text-gray-500" : ""
            }`}
            disabled={disabled}
          />
        </div>
      );
}