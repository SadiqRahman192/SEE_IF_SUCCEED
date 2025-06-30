import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/ui/EventCard";
import { TaskList } from "@/components/ui/TaskList";
import { AIAssistant } from "@/components/ui/AIAssistant";
import { Analytics } from "@/components/ui/Analytics";
import CreateEventForm from "@/components/forms/CreateEventModal";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchEvents, Event } from "../../lib/api"; // Import fetchEvents and Event interface
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state

export const DashboardTabs = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
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

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <CreateEventForm />
        <Button 
          variant="outline" 
          className="border-green-500 text-green-600 hover:bg-green-50"
          onClick={() => navigate("/reminders")}
        >
          <Mail className="h-4 w-4 mr-2" />
          Send Reminders
        </Button>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-3"> {/* Changed to grid-cols-4 */}
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
              ))
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : events.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No events created yet. Create one!</p>
            ) : (
              events.map((event) => (
                <EventCard
                  key={event._id}
                  title={event.title}
                  date={new Date(event.date).toLocaleDateString()}
                  location={event.location}
                  // These fields are not directly available from the Event interface,
                  // so we'll use placeholders or derive them if possible.
                  // For a real application, you'd fetch/calculate these.
                  attendees={0} // Placeholder
                  progress={0} // Placeholder
                  status="N/A" // Placeholder
                  eventId={event._id} // Pass event ID for navigation/details
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <TaskList />
        </TabsContent>
        
        <TabsContent value="ai" className="mt-6">
          {/* Pass props from the first event, or default values if no events */}
          <AIAssistant 
            eventName={events.length > 0 ? events[0].title : "General Event Planning"}
            eventDescription={events.length > 0 ? events[0].description : "Assistance for general event planning tasks."}
            venueNeeded={events.length > 0 ? events[0].requiresVenue || false : false}
            cateringNeeded={events.length > 0 ? events[0].requiresCatering || false : false}
            location={events.length > 0 ? events[0].location : "Anywhere"}
            eventId={events.length > 0 ? events[0]._id : ""} // Pass eventId
            onApplySuggestion={(taskTitle) => console.log(`Applied suggestion: ${taskTitle}`)}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
