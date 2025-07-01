import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, User } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  attendees: number;
  progress: number;
  status: string;
  eventId: string; // Add eventId prop
}

export const EventCard = ({ title, date, location, attendees, progress, status, eventId }: EventCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500";
      case "Planning":
        return "bg-yellow-500";
      case "Almost Ready":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Link to={`/event/${eventId}`}> {/* Wrap with Link */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge className={getStatusColor(status)}>{status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {location}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              {attendees} attendees
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
