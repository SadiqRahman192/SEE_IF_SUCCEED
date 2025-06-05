
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, CheckCircle, Lightbulb } from "lucide-react";

const stats = [
  {
    title: "Total Events",
    value: "24",
    icon: Calendar,
    color: "text-green-500",
    bgColor: "bg-green-50"
  },
  {
    title: "Total Attendees",
    value: "1,247",
    icon: User,
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    title: "Pending Tasks",
    value: "8",
    icon: CheckCircle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50"
  },
  {
    title: "AI Suggestions",
    value: "12",
    icon: Lightbulb,
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  }
];

export const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
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
