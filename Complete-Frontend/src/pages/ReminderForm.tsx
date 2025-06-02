import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Calendar, Clock, MapPin, User, Loader2 } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

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

interface ReminderFormData {
  to_email: string;
  to_name: string;
  custom_message: string;
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
  }
];

const ReminderForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<ReminderFormData>({
    to_email: "",
    to_name: "",
    custom_message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const foundEvent = mockEvents.find(e => e.id === parseInt(eventId || ""));
    setEvent(foundEvent || null);
  }, [eventId]);

  const handleInputChange = (field: keyof ReminderFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const formRef = useRef<HTMLFormElement>(null);

  const isValidEmail = (email: string) => {
    // Basic email regex for validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isValidEmail(form.to_email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid recipient email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formRef.current && event) {
      const templateParams = {
        to_email: form.to_email,
        to_name: form.to_name,
        custom_message: form.custom_message,
        event_title: event.title,
        event_date: new Date(event.date).toLocaleDateString(),
        event_time: event.time,
        event_location: event.location,
        event_attendees: event.attendees,
      };

      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          templateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        setEmailSent(true);
        toast({
          title: "Reminder Sent!",
          description: `Email successfully sent to ${form.to_email}.`,
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to send email:", error);
        toast({
          title: "Failed to Send Reminder",
          description: "There was an error sending the email. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

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

  const [currentView, setCurrentView] = useState("reminders"); // Default to "reminders" for this page

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />
        <div className="container mx-auto px-4 py-8">
          <p>Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Toaster /> {/* Add Toaster component here */}
        {/* Navigation */}
        <div className="mb-6 flex flex-col sm:flex-row gap-2">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/reminders")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Event Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p>{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p>{event.time}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p>{event.location}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <div>
                    <p className="font-medium">Attendees</p>
                    <p>{event.attendees}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        {emailSent && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 rounded-full p-2">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-green-900">Reminder Sent Successfully!</h3>
                <p className="text-sm text-green-700">Email sent to {form.to_email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reminder Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Send Event Reminder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="to_email" className="text-gray-700">
                      Recipient Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="to_email"
                      type="email"
                      placeholder="attendee@example.com"
                      value={form.to_email}
                      onChange={(e) => handleInputChange("to_email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to_name" className="text-gray-700">
                      Recipient Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="to_name"
                      type="text"
                      placeholder="John Doe"
                      value={form.to_name}
                      onChange={(e) => handleInputChange("to_name", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="custom_message" className="text-gray-700">
                    Custom Message (Optional)
                  </Label>
                  <Textarea
                    id="custom_message"
                    rows={4}
                    placeholder="Add a personal message to include in the reminder email..."
                    value={form.custom_message}
                    onChange={(e) => handleInputChange("custom_message", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    This message will be included in the email along with the event details.
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/reminders")}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-green-500 hover:bg-green-600"
                    disabled={isLoading || !form.to_email || !form.to_name}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Reminder
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Email Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Email Preview:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="text-sm">
                  <p><strong>To:</strong> {form.to_email || "attendee@example.com"}</p>
                  <p><strong>Subject:</strong> Reminder: {event.title}</p>
                </div>
                
                <div className="border-t pt-3 space-y-3">
                  <p>Hello {form.to_name || "John Doe"},</p>
                  
                  <p>This is a friendly reminder about the upcoming event:</p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}<br />
                      <strong>Time:</strong> {event.time}<br />
                      <strong>Location:</strong> {event.location}
                    </p>
                  </div>
                  
                  {form.custom_message && (
                    <div>
                      <p><strong>Personal Message:</strong></p>
                      <p className="italic">{form.custom_message}</p>
                    </div>
                  )}
                  
                  <p>We look forward to seeing you there!</p>
                  <p>Best regards,<br />EventMaster Pro Team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReminderForm;
