import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface TaskListProps {
  filters: {
    status: string | undefined;
    priority: string | undefined;
    searchTerm: string;
  };
  onEditTask: (task: any) => void;
}

export default function TaskList({ filters, onEditTask }: TaskListProps) {
  const tasks = useQuery(api.tasks.getUserTasks, {
    status: filters.status as any,
    priority: filters.priority as any,
  });
  
  const searchResults = useQuery(
    api.tasks.searchTasks,
    filters.searchTerm.trim() 
      ? { searchTerm: filters.searchTerm, status: filters.status as any }
      : "skip"
  );

  const deleteTask = useMutation(api.tasks.deleteTask);
  const updateTask = useMutation(api.tasks.updateTask);

  const displayTasks = filters.searchTerm.trim() ? searchResults : tasks;

  if (displayTasks === undefined) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask({ taskId: taskId as any });
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTask({ taskId: taskId as any, status: status as any });
      toast.success("Task status updated");
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (displayTasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center border border-gray-200">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-500">
          {filters.searchTerm.trim() 
            ? "Try adjusting your search or filters"
            : "Create your first task to get started"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayTasks.map((task) => (
        <div
          key={task._id}
          className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status.replace("-", " ")}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              
              <p className="text-gray-600 mb-3">{task.description}</p>
              
              {task.dueDate && (
                <p className="text-sm text-gray-500 mb-3">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              
              <p className="text-xs text-gray-400">
                Created: {new Date(task._creationTime).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              {/* Status Quick Actions */}
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              
              <button
                onClick={() => onEditTask(task)}
                className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50"
                title="Edit task"
              >
                ✏️
              </button>
              
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
