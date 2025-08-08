import { Link, useNavigate } from "react-router-dom";

// eslint-disable-next-line
export default function LinkButton({ children, to }) {
  const navigate = useNavigate();
  const className =
    "text-sm bg-indigo-500 hover:bg-indigo-700 p-2 rounded-lg ml-3 mt-2";

  if (to === "-1")
    return (
      <button onClick={() => navigate(-1)} className={className}>
        {children}
      </button>
    );
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}
