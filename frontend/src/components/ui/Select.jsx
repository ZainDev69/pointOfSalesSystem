export function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select {label}</option>
        {options.map((opt, index) => (
          <option key={`${opt.value}-${index}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
