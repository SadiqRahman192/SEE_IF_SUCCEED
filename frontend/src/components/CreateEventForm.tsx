import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Event title must be at least 2 characters.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  requiresVenue: z.boolean().default(false).optional(),
  requiresCatering: z.boolean().default(false).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateEventFormProps {
  eventId?: string;
  defaultValues?: FormValues;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({
  eventId,
  defaultValues,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [taskSuggestions, setTaskSuggestions] = useState<string[]>([]); // Changed to array of strings

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

  const handleAddTaskFromSuggestion = async (taskTitle: string) => {
    if (!taskTitle.trim()) {
      toast.error("Task title cannot be empty.");
      return;
    }
    if (!eventId) {
      toast.error("Event must be created before adding tasks.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: taskTitle }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(`Task "${taskTitle}" added successfully!`);
      // Optionally, remove the added suggestion from the list
      setTaskSuggestions(prevSuggestions => prevSuggestions.filter(s => s !== taskTitle));
    } catch (error) {
      console.error('Error adding task from suggestion:', error);
      toast.error("Failed to add task from suggestion. Please try again.");
    }
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const method = eventId ? "PUT" : "POST";
    const url = eventId
      ? `http://localhost:5000/api/events/${eventId}`
      : "http://localhost:5000/api/events";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          date: values.date.toISOString(),
          location: values.location,
          requiresVenue: values.requiresVenue,
          requiresCatering: values.requiresCatering,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const event = await response.json();
      console.log(`Event ${eventId ? "updated" : "created"}:`, event);

      toast.success(`Event ${eventId ? "updated" : "created"} successfully!`);
      navigate("/");
    } catch (error) {
      console.error(`Error ${eventId ? "updating" : "creating"} event:`, error);
      toast.error(
        `Failed to ${eventId ? "update" : "create"} event. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async () => {
    setSuggestionsLoading(true);
    setTaskSuggestions([]); // Clear previous suggestions by setting to an empty array
    const values = form.getValues();
    if (!values.title || !values.description) {
      toast.error("Please enter event title and description to get suggestions.");
      setSuggestionsLoading(false);
      return;
    }

    console.log("Attempting to get suggestions with values:", values); // Log before fetch

    try {
      const response = await fetch(
        "http://localhost:5000/api/cohere/suggest-tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventName: values.title,
            eventDescription: values.description,
            venueNeeded: values.requiresVenue,
            cateringNeeded: values.requiresCatering,
          }),
        }
      );

      console.log("Response status:", response.status); // Log response status

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received suggestions data:", data); // Log received data
      // Assuming suggestions are newline-separated, split and filter empty lines
      const parsedSuggestions = data.suggestions.split('\n').map((s: string) => s.trim()).filter(Boolean);
      setTaskSuggestions(parsedSuggestions);
      toast.success("Task suggestions generated!");
    } catch (error) {
      console.error("Error getting task suggestions:", error); // Ensure error is logged
      toast.error("Failed to get task suggestions. Please try again.");
    } finally {
      setSuggestionsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-full pl-3 text-left font-normal ${
                        !field.value ? "text-muted-foreground" : ""
                      }`}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter event description"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Requirements</h3>

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="requiresVenue"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Venue Needed</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requiresCatering"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Catering Needed</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          type="button"
          onClick={getSuggestions}
          className="w-full"
          disabled={suggestionsLoading}
        >
          {suggestionsLoading
            ? "Getting Suggestions..."
            : "Get Task Suggestions"}
        </Button>

        {taskSuggestions.length > 0 && (
          <div className="space-y-2">
            <FormLabel>Suggested Tasks</FormLabel>
            <div className="space-y-2 border rounded-md p-4">
              {taskSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-sm">{suggestion}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTaskFromSuggestion(suggestion)}
                    disabled={!eventId} // Disable if event not yet created
                  >
                    Add Task
                  </Button>
                </div>
              ))}
              {!eventId && (
                <p className="text-xs text-muted-foreground mt-2">
                  * Create the event first to add suggested tasks.
                </p>
              )}
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Event..." : "Create Event"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateEventForm;
