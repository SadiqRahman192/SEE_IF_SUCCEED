
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Calendar, Clock, MapPin, Users } from "lucide-react";
import  Navigation  from "@/components/layout/Navigation";
import { useNavigate } from "react-router-dom";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'planning' | 'completed';
  category: string;
  description: string;
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Annual Company Retreat",
    date: "2024-06-15",
    time: "09:00",
    location: "Mountain Resort",
    attendees: 120,
    status: "upcoming",
    category: "Conference",
    description: "Annual team building and strategy retreat for all company employees."
  },
  {
    id: 2,
    title: "Product Launch Event",
    date: "2024-06-20",
    time: "14:00",
    location: "Convention Center",
    attendees: 500,
    status: "planning",
    category: "Product Launch",
    description: "Launching our new flagship product with media and stakeholders."
  },
  {
    id: 3,
    title: "Team Building Workshop",
    date: "2024-06-25",
    time: "10:00",
    location: "Office Conference Room",
    attendees: 25,
    status: "upcoming",
    category: "Workshop",
    description: "Interactive workshop to improve team collaboration and communication."
  },
  {
    id: 4,
    title: "Client Presentation",
    date: "2024-07-01",
    time: "15:30",
    location: "Virtual Event",
    attendees: 15,
    status: "planning",
    category: "Meeting",
    description: "Quarterly business review and presentation to key clients."
  }
];

const Reminders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentView, setCurrentView] = useState("reminders"); // Default to "reminders" for this page

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500";
      case "planning":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "upcoming") return matchesSearch && event.status === "upcoming";
    if (activeFilter === "planning") return matchesSearch && event.status === "planning";
    
    return matchesSearch;
  });

  const stats = {
    totalEvents: mockEvents.length,
    upcomingEvents: mockEvents.filter(e => e.status === "upcoming").length,
    totalAttendees: mockEvents.reduce((sum, e) => sum + e.attendees, 0),
    inPlanning: mockEvents.filter(e => e.status === "planning").length
  };

  const handleSendReminder = (eventId: number) => {
    navigate(`/reminders/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3 mb-2">
            <Mail className="h-8 w-8 text-green-500" />
            <h1 className="text-3xl font-bold text-gray-900">Send Event Reminders</h1>
          </div>
          <p className="text-gray-600">Select an event to send reminder emails to attendees</p>
        </div>

        {/* Filters Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search events by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              className={activeFilter === "all" ? "bg-green-500 hover:bg-green-600" : ""}
              onClick={() => setActiveFilter("all")}
            >
              All Events
            </Button>
            <Button
              variant={activeFilter === "upcoming" ? "default" : "outline"}
              className={activeFilter === "upcoming" ? "bg-green-500 hover:bg-green-600" : ""}
              onClick={() => setActiveFilter("upcoming")}
            >
              Upcoming
            </Button>
            <Button
              variant={activeFilter === "planning" ? "default" : "outline"}
              className={activeFilter === "planning" ? "bg-green-500 hover:bg-green-600" : ""}
              onClick={() => setActiveFilter("planning")}
            >
              Planning
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="relative">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg hover:text-green-600 cursor-pointer">
                    {event.title}
                  </CardTitle>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{event.category}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {event.attendees} attendees
                  </div>
                </div>
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => handleSendReminder(event.id)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminders
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
                <p className="text-sm text-gray-600">Total Events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</p>
                <p className="text-sm text-gray-600">Upcoming Events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{stats.totalAttendees}</p>
                <p className="text-sm text-gray-600">Total Attendees</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{stats.inPlanning}</p>
                <p className="text-sm text-gray-600">In Planning</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
