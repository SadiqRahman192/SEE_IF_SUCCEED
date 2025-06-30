
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Event } from '@/lib/api'; // Import Event interface

export interface EventCardProps {
  _id: string; // Changed from id to _id
  title: string;
  date: string;
  location: string;
  description: string;
  organizer?: string;
  isUpcoming?: boolean; // Added isUpcoming prop
}

const EventCard: React.FC<EventCardProps> = ({ _id, title, date, location, description, organizer, isUpcoming }) => { // Changed id to _id
  const navigate = useNavigate();
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
  
  const handleView = () => {
    navigate(`/event/${_id}`); // Changed id to _id
  };

  return (
    <Card className={`card-hover ${isUpcoming ? 'bg-yellow-50 border-l-4 border-yellow-500 shadow-md' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg font-semibold ${isUpcoming ? 'text-yellow-800' : ''}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mt-0.5" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5" />
          <span>{location}</span>
        </div>
        {organizer && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <span>Organized by: {organizer}</span>
          </div>
        )}
        <p className="text-sm line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full border border-green-400"
          onClick={handleView}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
