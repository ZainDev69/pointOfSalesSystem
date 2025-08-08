import { Link, useLocation } from "react-router-dom";

export default function NavigationRoutes() {
  const location = useLocation(); //getting the location of the route
  const navigation = [
    { name: "Products", to: "/products" },
    { name: "Users", to: "/users" },
    { name: "Sales", to: "/sales-report" },
  ];

  return (
    <div className="flex space-x-6">
      {navigation.map((route) => (
        <Link
          key={route.name}
          aria-current={route.current ? "page" : undefined}
          to={route.to}
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            location.pathname === route.to
              ? "bg-gray-900 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
        >
          {route.name}
        </Link>
      ))}
    </div>
  );
}
