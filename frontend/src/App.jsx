import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/UI/AppLayout";
import ProtectedRoute from "./components/protectedRoute";
import AuthPage from "./pages/Authentication/AuthPage";
import Error from "./components/UI/Error";
import NotFound from "./pages/Not-Found/Not-Found";
import UserPage from "./pages/Users/Users";
import ProductPage from "./pages/Product/Product";
import AddProduct from "./pages/Product/AddProduct";
import CartPage from "./pages/Cart/Cart";
import EditProduct from "./pages/Product/EditProduct";
import EditUser from "./pages/Users/EditUser";
import { CartProvider } from "./components/context/CartContext";
import SalesPage from "./pages/Sales/SalesPage";

const router = createBrowserRouter([
  { path: "/", element: <AuthPage /> },
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/products",
        element: <ProductPage />,
      },
      {
        path: "/add-product",
        element: (
          <ProtectedRoute role="admin">
            <AddProduct />
            //{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-product",
        element: (
          <ProtectedRoute role="admin">
            <EditProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-to-cart",
        element: (
          <CartProvider>
            <CartPage />
          </CartProvider>
        ),
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute role="admin">
            <UserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-user",
        element: (
          <ProtectedRoute role="admin">
            <EditUser />
          </ProtectedRoute>
        ),
      },

      {
        path: "/sales-report",
        element: (
          <ProtectedRoute role="admin">
            <SalesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
