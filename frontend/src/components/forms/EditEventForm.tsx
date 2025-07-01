import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { createEvent, updateEvent, Event } from "@/lib/api";

const formSchema = z.object({
  title: z.string().min(2, { message: "Event title must be at least 2 characters." }),
  date: z.date({ required_error: "Please select a date." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  requiresVenue: z.boolean().default(false).optional(),
  requiresCatering: z.boolean().default(false).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  eventId?: string;
  defaultValues?: FormValues;
  onEventCreatedOrUpdated?: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  eventId,
  defaultValues,
  onEventCreatedOrUpdated,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      title: "",
      date: undefined,
      location: "",
      description: "",
      requiresVenue: false,
      requiresCatering: false,
    },
  });

  const suggestions = {
    title: ["Conference", "Wedding", "Concert", "Workshop", "Festival"],
    location: ["Downtown Hall", "Beach Resort", "City Park", "Convention Center", "Hotel Ballroom"],
    description: [
      "A networking event for professionals",
      "A celebration with live music",
      "An educational workshop for students",
      "A fundraising gala for charity",
      "An outdoor festival for families",
    ],
  };

  const suggestFields = () => {
    const randomTitle = suggestions.title[Math.floor(Math.random() * suggestions.title.length)];
    const randomLocation = suggestions.location[Math.floor(Math.random() * suggestions.location.length)];
    const randomDescription = suggestions.description[Math.floor(Math.random() * suggestions.description.length)];
    form.setValue("title", randomTitle);
    form.setValue("location", randomLocation);
    form.setValue("description", randomDescription);
  };

  const openCustomPrompt = () => {
    const prompt = window.prompt("Enter a custom event description:");
    if (prompt) {
      form.setValue("description", prompt);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const eventData = {
      title: values.title,
      description: values.description,
      date: values.date.toISOString(),
      location: values.location,
      requiresVenue: values.requiresVenue,
      requiresCatering: values.requiresCatering,
    };

    try {
      let event: Event;
      if (eventId) {
        event = await updateEvent(eventId, eventData);
        toast.success("Event updated successfully!");
      } else {
        event = await createEvent(eventData);
        toast.success("Event created successfully!");
      }
      console.log(`Event ${eventId ? "updated" : "created"}:`, event);
      if (onEventCreatedOrUpdated) {
        onEventCreatedOrUpdated();
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(`Error ${eventId ? "updating" : "creating"} event:`, error);
      toast.error(`Failed to ${eventId ? "update" : "create"} event.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-xl max-w-2xl mx-auto mt-10 p-6 text-gray-800 font-sans">
      {/* Button Group for Actions */}
      <div className="pt-6 px-8 flex flex-row flex-wrap items-center text-lg text-gray-600 gap-3">
        <button
          type="button"
          className="inline-flex justify-center gap-2 items-center px-3 py-1 border border-gray-300 rounded-full text-gray-600 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
          aria-label="Get suggestions"
          data-active="true"
          onClick={suggestFields}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"></path>
            <path d="m18 2 4 4-4 4"></path>
            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"></path>
            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"></path>
            <path d="m18 14 4 4-4 4"></path>
          </svg>
          <span>Get suggestions</span>
        </button>
        <button
          type="button"
          className="inline-flex justify-center gap-2 items-center px-3 py-1 border border-gray-300 rounded-full opacity-80 hover:opacity-100 focus:opacity-100 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none data-[active=true]:bg-gray-100 data-[active=true]:border-gray-400 data-[active=true]:opacity-100"
          aria-label="Write custom prompt"
          data-active="false"
          onClick={openCustomPrompt}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.6">
              <path
                d="M3.1665 2.66732C3.1665 2.20708 3.5396 1.83398 3.99984 1.83398H8.6665C8.94265 1.83398 9.1665 1.61013 9.1665 1.33398C9.1665 1.05784 8.94265 0.833984 8.6665 0.833984H3.99984C2.98732 0.833984 2.1665 1.6548 2.1665 2.66732V13.334C2.1665 14.3465 2.98731 15.1673 3.99984 15.1673H11.9998C13.0124 15.1673 13.8332 14.3465 13.8332 13.334V7.33398C13.8332 7.05784 13.6093 6.83398 13.3332 6.83398C13.057 6.83398 12.8332 7.05784 12.8332 7.33398V13.334C12.8332 13.7942 12.4601 14.1673 11.9998 14.1673H3.99984C3.5396 14.1673 3.1665 13.7942 3.1665 13.334V2.66732Z"
                fill="currentColor"
              ></path>
              <path
                d="M7.98217 5.95483L11.9046 2.0324C12.2903 1.64668 12.9157 1.64667 13.3014 2.0324C13.6871 2.41812 13.6871 3.0435 13.3014 3.42922L9.37899 7.35165C9.29696 7.43369 9.19493 7.4929 9.083 7.52343L7.67084 7.90856C7.52154 7.94928 7.38454 7.81228 7.42526 7.66298L7.8104 6.25082C7.84092 6.13889 7.90013 6.03687 7.98217 5.95483Z"
                fill="currentColor"
              ></path>
            </g>
          </svg>
          <span>Write a prompt</span>
        </button>
      </div>

      {/* Form Fields */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-8">
        <p className="text-3xl tracking-tight leading-tight md:text-4xl">
          <span className="opacity-50">Plan an event for </span>
          <span className="relative inline-block min-w-[100px] px-1 border-b-2 border-blue-500 focus-within:border-blue-500">
            <input
              {...form.register("title")}
              className="bg-transparent text-gray-800 focus:outline-none placeholder-gray-800"
              placeholder="event title"
              aria-label="Event title"
              aria-required="true"
            />
          </span>
          <br />
          <span className="opacity-50"> on </span>
          <span className="relative inline-block min-w-[100px] px-1 border-b-2 border-green-500 focus-within:border-green-500">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="bg-transparent text-gray-800 focus:outline-none"
                  aria-label="Select event date"
                >
                  {form.watch("date") ? format(form.watch("date"), "PPP") : "select date"}
                  <CalendarIcon className="ml-2 h-4 w-4 inline opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch("date")}
                  onSelect={(date) => form.setValue("date", date!, { shouldValidate: true })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </span>
          <br />
          <span className="opacity-50"> at </span>
          <span className="relative inline-block min-w-[100px] px-1 border-b-2 border-purple-500 focus-within:border-purple-500">
            <input
              {...form.register("location")}
              className="bg-transparent text-gray-800 focus:outline-none placeholder-gray-800"
              placeholder="event location"
              aria-label="Event location"
              aria-required="true"
            />
          </span>
          <br />
          <span className="opacity-50"> to </span>
          <span className="relative inline-block min-w-[100px] px-1 border-b-2 border-purple-500 focus-within:border-purple-500">
            <input
              {...form.register("description")}
              className="bg-transparent text-gray-800 focus:outline-none placeholder-gray-800"
              placeholder="event purpose"
              aria-label="Event description"
              aria-required="true"
            />
          </span>
        </p>
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="text-red-500 text-sm mt-4">
            <p className="font-semibold">Please correct the following errors:</p>
            <ul className="list-disc list-inside">
              {form.formState.errors.title && <li>{form.formState.errors.title.message}</li>}
              {form.formState.errors.date && <li>{form.formState.errors.date.message}</li>}
              {form.formState.errors.location && <li>{form.formState.errors.location.message}</li>}
              {form.formState.errors.description && <li>{form.formState.errors.description.message}</li>}
            </ul>
          </div>
        )}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Requirements</h3>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...form.register("requiresVenue")}
                className="h-4 w-4 text-green-500 border-gray-600 rounded focus:ring-2 focus:ring-gray-400"
              />
              <span>Venue Needed</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...form.register("requiresCatering")}
                className="h-4 w-4 text-green-500 border-gray-600 rounded focus:ring-2 focus:ring-gray-400"
              />
              <span>Catering Needed</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full py-4 px-8">
          <button
            type="submit"
            className="h-11 inline-flex items-center gap-2 font-semibold text-xl bg-gray-800 text-white px-4 py-2 rounded-full w-full justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={eventId ? "Update event details" : "Create event details"}
            disabled={loading}
          >
            <span className="text-center font-semibold text-xl">
              {loading
                ? eventId
                  ? "Updating Event..."
                  : "Creating Event..."
                : eventId
                ? "Update Event"
                : "Create Event"}
            </span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.47614 2.46329C2.70058 2.24421 3.03764 2.18792 3.32109 2.32219L22.3211 11.3222C22.583 11.4463 22.75 11.7102 22.75 12C22.75 12.2898 22.583 12.5537 22.3211 12.6778L3.32109 21.6778C3.03764 21.8121 2.70058 21.7558 2.47614 21.5367C2.2517 21.3176 2.18728 20.982 2.31467 20.6954L6.17929 12L2.31467 3.30459C2.18728 3.01798 2.2517 2.68238 2.47614 2.46329ZM7.48743 12.75L4.50682 19.4564L18.6647 12.75H7.48743ZM18.6647 11.25H7.48743L4.50682 4.54362L18.6647 11.25Z"
              ></path>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
