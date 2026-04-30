import { getActivityLogs, getTaskStats } from "@/actions/activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Circle, Clock, AlertCircle, BarChart3 } from "lucide-react";

export default async function DashboardPage() {
  const stats = await getTaskStats();
  const logs = await getActivityLogs();

  if (!stats) return <div>Loading...</div>;

  const statCards = [
    { title: "Total Tasks", value: stats.total, icon: BarChart3, color: "text-blue-600" },
    { title: "To Do", value: stats.todo, icon: Circle, color: "text-gray-600" },
    { title: "In Progress", value: stats.inProgress, icon: Clock, color: "text-yellow-600" },
    { title: "Completed", value: stats.done, icon: CheckCircle2, color: "text-green-600" },
    { title: "High Priority", value: stats.highPriority, icon: AlertCircle, color: "text-red-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-gray-500 mt-1">Overview of your tasks and recent activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {logs.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No activity yet.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-700">
                        {log.user.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <span className="font-semibold">{log.user.name}</span>{" "}
                        {log.action === "created" && "created task"}
                        {log.action === "edited" && "updated task"}
                        {log.action === "moved" && "moved task"}
                        {log.action === "deleted" && "deleted task"}
                        {" "}
                        <span className="font-medium">
                          {log.details && (log.details as any).title ? (log.details as any).title : "a task"}
                        </span>
                        {log.action === "moved" && (log.details as any).status && (
                          <> to <span className="capitalize">{(log.details as any).status.replace('_', ' ')}</span></>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
