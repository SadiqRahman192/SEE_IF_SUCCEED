import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditEventForm from '@/components/forms/EditEventForm';
import { toast } from 'sonner';
import { fetchEventById, Event } from '../lib/api';
import Navigation from '@/components/layout/Navigation';

interface Params {
  id?: string;
  [key: string]: string | undefined;
}

const EditEvent: React.FC = () => {
  const { id } = useParams<Params>();
  const [eventData, setEventData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>('dashboard');

  useEffect(() => {
    const getEventForEdit = async () => {
      if (!id) {
        setLoading(false);
        toast.error("Event ID is missing for editing.");
        return;
      }
      try {
        const data: Event = await fetchEventById(id);
        setEventData(data);
      } catch (error) {
        console.error('Error fetching event for editing:', error);
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
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <div className="container mx-auto px-4 space-y-6">
        <h1 className="text-left text-2xl font-bold">Edit Event</h1>
        <EditEventForm
          eventId={id}
          defaultValues={eventData ? {
            title: eventData.title,
            description: eventData.description,
            date: new Date(eventData.date),
            location: eventData.location,
            requiresVenue: eventData.requiresVenue,
            requiresCatering: eventData.requiresCatering,
          } : undefined}
        />
      </div>
    </>
  );
};

export default EditEvent;
