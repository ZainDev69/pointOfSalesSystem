export function Section ({icon,title,children}){
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {children}
        </div>
      );
}