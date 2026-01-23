interface SearchAndFilterProps {
  filters: {
    status: string | undefined;
    priority: string | undefined;
    searchTerm: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function SearchAndFilter({ filters, onFiltersChange }: SearchAndFilterProps) {
  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ 
      ...filters, 
      status: status === "all" ? undefined : status 
    });
  };

  const handlePriorityChange = (priority: string) => {
    onFiltersChange({ 
      ...filters, 
      priority: priority === "all" ? undefined : priority 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Tasks
          </label>
          <input
            type="text"
            placeholder="Search by title..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            value={filters.status || "all"}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Priority
          </label>
          <select
            value={filters.priority || "all"}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
}
