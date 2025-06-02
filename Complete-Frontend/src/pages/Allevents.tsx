import React, { useEffect, useState } from 'react';
import EventCard from '@/components/EventCard'; // EventCardProps is no longer needed here
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, Event } from '../lib/api'; // Import Event interface
import { useAuth } from '../context/AuthContext';
import Navigation from '@/components/layout/Navigation';

const AllEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]); // Use Event interface
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => { // Renamed to avoid conflict with imported fetchEvents
      try {
        const data: Event[] = await fetchEvents(); // Use the imported fetchEvents
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        // The toast message is already handled by the api.ts function
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  return (
    <>
    <Navigation />
    <div className="space-y-8 p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-foreground">All Events</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-52 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="text-muted-foreground mt-1">
            There are no events to display.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} {...event} />
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default AllEvents;
