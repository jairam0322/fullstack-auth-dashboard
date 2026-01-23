import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import TaskStats from "./TaskStats";
import ProfileSection from "./ProfileSection";
import SearchAndFilter from "./SearchAndFilter";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"tasks" | "profile">("tasks");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: undefined as any,
    priority: undefined as any,
    searchTerm: "",
  });

  const userProfile = useQuery(api.profiles.getUserProfile);
  const taskStats = useQuery(api.tasks.getTaskStats);

  if (userProfile === undefined || taskStats === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {userProfile.user?.email?.split("@")[0] || "User"}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "tasks"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Profile
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "tasks" ? (
        <div className="space-y-6">
          {/* Task Statistics */}
          <TaskStats stats={taskStats} />

          {/* Search and Filter */}
          <SearchAndFilter filters={filters} onFiltersChange={setFilters} />

          {/* Add Task Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Task
            </button>
          </div>

          {/* Task List */}
          <TaskList
            filters={filters}
            onEditTask={handleEditTask}
          />

          {/* Task Form Modal */}
          {showTaskForm && (
            <TaskForm
              task={editingTask}
              onClose={handleCloseForm}
            />
          )}
        </div>
      ) : (
        <ProfileSection userProfile={userProfile} />
      )}
    </div>
  );
}
