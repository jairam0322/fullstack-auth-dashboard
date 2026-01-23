interface TaskStatsProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    highPriority: number;
  };
}

export default function TaskStats({ stats }: TaskStatsProps) {
  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      color: "bg-blue-500",
      icon: "📋",
    },
    {
      title: "Pending",
      value: stats.pending,
      color: "bg-yellow-500",
      icon: "⏳",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      color: "bg-orange-500",
      icon: "🔄",
    },
    {
      title: "Completed",
      value: stats.completed,
      color: "bg-green-500",
      icon: "✅",
    },
    {
      title: "High Priority",
      value: stats.highPriority,
      color: "bg-red-500",
      icon: "🔥",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`${card.color} rounded-full p-3 text-white text-xl`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
