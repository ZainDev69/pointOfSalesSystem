import CartButton from "./CartButton";
import Button from "./Button";
import { Link } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, logoutUser } from "../redux/slice/auth";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import NavigationRoutes from "./NavigationRoutes";

export default function Navbar() {
  const currentUser = useSelector(getCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 h-16 flex items-center justify-between px-4 fixed w-full z-1">
      <h1 className="font-serif text-white right-3 pl-4 text-xl">
        Point of Sale
      </h1>

      {currentUser.role === "admin" ? <NavigationRoutes /> : <Search />}

      <div className="flex items-center justify-center gap-4">
        {currentUser.role != "admin" && (
          <CartButton onClick={() => navigate("/add-to-cart")} />
        )}
        <h1 className="font-inter text-white right-3 pl-4 text-xl">
          {currentUser.firstName}
        </h1>

        <img
          src={`${import.meta.env.VITE_API_URL}/img/users/${currentUser.photo}`}
          alt="User Image"
          className="w-10 h-10 rounded-full border-2 border-green-300 animate-pulse cursor-pointer"
        />
        <Button colorType="primary" onClick={handleLogOut}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
