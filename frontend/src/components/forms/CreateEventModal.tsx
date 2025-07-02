import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EventForm, { FormValues } from "./EditEventForm"; // Import EventForm and FormValues
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateEventModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleEventCreatedOrUpdated = () => {
    setOpen(false); // Close modal on successv
    navigate("/"); // Navigate to home or dashboard after creation
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-6 text-gray-800">
        {/* <DialogHeader> */}
          {/* <DialogTitle>Create New Event</DialogTitle> */}
          {/* <DialogDescription> */}
            {/* Fill in the details below to create a new event. */}
          {/* </DialogDescription> */}
        {/* </DialogHeader> */}
        <EventForm onEventCreatedOrUpdated={handleEventCreatedOrUpdated} /> {/* Use EventForm here */}
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
