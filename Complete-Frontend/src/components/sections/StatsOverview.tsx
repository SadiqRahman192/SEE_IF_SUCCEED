
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchEvents, fetchPendingTasks } from "@/lib/api";

export const StatsOverview = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalAttendees, setTotalAttendees] = useState(0); // Still a placeholder
  const [pendingTasks, setPendingTasks] = useState(0);

  useEffect(() => {
    const getStats = async () => {
      try {
        const events = await fetchEvents();
        setTotalEvents(events.length);

        // For total attendees, assuming it's the sum of attendees across all events.
        // If there's no attendee field in Event, this will remain 0 or be based on event count.
        // For now, let's just set it to total events as a placeholder.
        setTotalAttendees(events.length); // Still a placeholder

        const tasks = await fetchPendingTasks();
        setPendingTasks(tasks.length);

      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    getStats();
  }, []);

  const stats = [
    {
      title: "Total Events",
      value: totalEvents.toString(),
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Pending Events", // Clarified label
      value: totalAttendees.toString(),
      icon: User,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Tasks", // Updated label
      value: pendingTasks.toString(),
      icon: CheckCircle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between ">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
