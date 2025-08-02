export function TextArea({
    label,
    value,
    onChange,
    placeholder = "",
    rows = 3,
    required = false,
    full = false,
    disabled = false,
  }) {
    return (
      <div className={full ? "md:col-span-2" : ""}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            disabled ? "bg-gray-200 text-gray-500" : ""
          }`}
        />
      </div>
    );
  }
  