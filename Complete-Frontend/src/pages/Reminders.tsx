
import { useEffect, useState } from "react"; // Import useEffect
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Calendar, Clock, MapPin, Users } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import { useNavigate } from "react-router-dom";
import { fetchEvents, Event } from "../lib/api"; // Import fetchEvents and Event interface
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state

const Reminders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentView, setCurrentView] = useState("reminders");
  const [events, setEvents] = useState<Event[]>([]); // State for fetched events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        setError("Failed to fetch events.");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": // Assuming 'upcoming' status for future events
        return "bg-blue-500";
      case "planning": // Assuming 'planning' status for events in planning
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredEvents = events.filter(event => { // Filter from fetched events
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const eventDate = new Date(event.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize current date to start of day

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "upcoming") return matchesSearch && eventDate >= now; // Filter for upcoming events
    
    return matchesSearch; // Should not reach here if filters are "all" or "upcoming"
  });

  // Calculate stats from fetched events
  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0))).length,
    totalAttendees: 0, // Attendees data is not available in Event interface, placeholder
    inPlanning: 0 // Planning status is not directly available, placeholder
  };

  const handleSendReminder = (eventId: string) => { // Change eventId type to string
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
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
            ))
          ) : error ? (
            <p className="text-red-500 col-span-full">{error}</p>
          ) : filteredEvents.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No events found matching your criteria.</p>
          ) : (
            filteredEvents.map((event) => (
              <Card key={event._id} className="bg-white border-gray-200 hover:shadow-md transition-shadow"> {/* Use event._id */}
                <CardHeader className="relative">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg hover:text-green-600 cursor-pointer">
                      {event.title}
                    </CardTitle>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getStatusColor(new Date(event.date) >= new Date(new Date().setHours(0,0,0,0)) ? "upcoming" : "completed")}> {/* Derive status */}
                        {new Date(event.date) >= new Date(new Date().setHours(0,0,0,0)) ? "Upcoming" : "Completed"}
                      </Badge>
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
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600"
                    onClick={() => handleSendReminder(event._id)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reminders
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
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
        </div>
      </div>
    </div>
  );
};

export default Reminders;
