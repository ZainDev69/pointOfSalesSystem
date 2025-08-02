import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clientList } from "../../components/redux/slice/clients";
import { Search, Filter } from "lucide-react";

export function ClientSearch({ showArchived, currentPage, setCurrentPage }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const clientsPerPage = 10;

  const statusOptions = useSelector(
    (state) => state.clients.clientOptions.status
  );
  const dispatch = useDispatch();

  // Build params for backend
  const getBackendParams = () => {
    const params = { page: currentPage, limit: clientsPerPage };
    if (searchTerm) params.fullName = searchTerm;
    if (filterStatus !== "all") {
      if (filterStatus === "Private") {
        params.ClientID = "PVT"; // Custom handling for private clients
      } else {
        params.status = filterStatus.toLowerCase(); // Convert to lowercase for backend
      }
    }
    if (showArchived) params.Archived = true;
    else params.Archived = false;
    // Sorting
    if (sortField === "name")
      params.sort =
        sortDirection === "asc"
          ? "personalDetails.fullName"
          : "-personalDetails.fullName";
    else if (sortField === "date")
      params.sort = sortDirection === "asc" ? "createdAt" : "-createdAt";
    return params;
  };

  // Fetch clients from backend on filter/sort/page change
  useEffect(() => {
    dispatch(clientList(getBackendParams()));
  }, [
    dispatch,
    searchTerm,
    filterStatus,
    showArchived,
    sortField,
    sortDirection,
    currentPage,
  ]);

  // Reset to first page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, showArchived, sortField, sortDirection]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search clients by Name,ClientID,phone,email or NHS Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            {statusOptions?.length === 0 ? (
              <option disabled>Loading...</option>
            ) : (
              statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))
            )}
          </select>
        </div>
        {/* Sorting Controls */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700">Sort by:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="name">Name</option>
            <option value="date">Date Added</option>
          </select>
          <button
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
            className="border border-gray-300 rounded-lg px-2 py-2"
            title={`Sort ${
              sortDirection === "asc" ? "Descending" : "Ascending"
            }`}
            type="button"
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>
    </div>
  );
}
