import { Pencil, Trash2 } from "lucide-react";
import Error from "./Error";
import { useDispatch } from "react-redux";
import { deleteUser } from "../redux/slice/users";
import { useNavigate } from "react-router-dom";

export default function Table({ headers, users, tagLine }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleEditUser(row) {
    navigate("/edit-user", { state: { user: row } });
  }

  if (users.length === 0) {
    return <Error message={"No user found"} />;
  }
  return (
    <div className=" my-[150px] mx-12 bg-slate-900 flex flex-col rounded-md justify-center items-center py-5 text-white px-6">
      <h1 className=" self-start font-poppins text-lg mr-110 pb-7">
        {tagLine}
      </h1>
      <table className="w-full">
        <thead>
          <tr className=" font-poppins text-indigo-400">
            {headers.map((header, index) => (
              <th key={index} className="py-3 px-5 border-none text-center ">
                {header}
              </th>
            ))}
            <th className="py-3 px-5"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((row, rowIndex) => (
            <tr
              key={row._id}
              className={`font-playfair text-center ${
                rowIndex !== users.length - 1 ? "border-b border-gray-700" : ""
              }`}
            >
              <td className="flex items-center justify-center gap-4 my-4">
                <span>
                  <img
                    src={`${import.meta.env.VITE_API_URL}/img/users/${
                      row.photo
                    }`}
                    alt="User Image"
                    className="w-10 h-10 rounded-full border-2 border-green-300 animate-pulse"
                  />
                </span>
                <span className="text-sm font-poppins">{row.firstName}</span>
              </td>
              <td className="text-sm font-poppins">{row.email}</td>
              <td>
                <div className=" flex items-center justify-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                  </span>
                </div>
              </td>

              <td className="font-poppins text-sm">{row.role}</td>
              <td className="p-3 px-4">
                <button
                  onClick={() => handleEditUser(row)}
                  className="transition duration-200 ease-in-out text-green-500 hover:text-green-700 px-2 py-1 rounded mr-2 cursor-pointer"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => dispatch(deleteUser(row._id))}
                  className="transition duration-200 ease-in-out text-red-500 px-2 py-1 animate-pulse rounded cursor-pointer hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
