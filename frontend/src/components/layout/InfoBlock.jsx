export function InfoBlock({ label, children, icon: Icon, color = "blue" }) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      {Icon && <Icon className={`w-5 h-5 text-${color}-500`} />}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="text-gray-900 font-medium">{children}</div>
      </div>
    </div>
  );
}
