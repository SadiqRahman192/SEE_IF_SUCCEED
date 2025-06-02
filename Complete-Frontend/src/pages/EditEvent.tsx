import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreateEventForm from '@/components/forms/CreateEventModal';
import { toast } from 'sonner';
import { fetchEventById, Event } from '../lib/api'; // Import Event and fetchEventById
import { FormValues } from '@/components/forms/CreateEventModal'; // Import FormValues
import Navigation from '@/components/layout/Navigation';

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [eventData, setEventData] = useState<FormValues | null>(null); // Use FormValues for state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEventForEdit = async () => { // Renamed to avoid conflict
      if (!id) {
        setLoading(false);
        toast.error("Event ID is missing for editing.");
        return;
      }
      try {
        const data: Event = await fetchEventById(id); // Use fetchEventById
        setEventData({
          title: data.title,
          description: data.description,
          date: new Date(data.date), // Convert date string to Date object
          location: data.location,
          requiresVenue: data.requiresVenue, // Assuming these exist on Event
          requiresCatering: data.requiresCatering, // Assuming these exist on Event
        });
      } catch (error) {
        console.error('Error fetching event for editing:', error);
        // The toast message is already handled by the api.ts function
      } finally {
        setLoading(false);
      }
    };

    getEventForEdit();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Event not found</h2>
        <p className="text-muted-foreground mt-2">
          The event you're trying to edit doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <>
    <Navigation />
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Event</h1>
      <CreateEventForm eventId={id} defaultValues={eventData} />
    </div>
    </>
  );
};

export default EditEvent;
