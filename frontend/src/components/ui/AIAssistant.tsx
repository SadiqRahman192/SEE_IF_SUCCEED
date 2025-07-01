import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { fetchEnrichedSuggestions, fetchVendorSuggestionsForTask, SuggestedProvider } from "@/lib/api";

interface AIAssistantProps {
  eventName: string;
  eventDescription: string;
  venueNeeded: boolean;
  cateringNeeded: boolean;
  location: string;
  eventId: string; // Add eventId prop
  onApplySuggestion: (taskTitle: string) => void;
}

// Define a simpler interface for initial task suggestions (without providers)
interface TaskSuggestion {
  task: string;
  category: string;
}

export const AIAssistant = ({
  eventName,
  eventDescription,
  venueNeeded,
  cateringNeeded,
  location,
  eventId, // Destructure eventId
  onApplySuggestion,
}: AIAssistantProps) => {
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]); // Use TaskSuggestion
  const [loadingSuggestions, setLoadingSuggestions] = useState(false); // Renamed for clarity
  const [vendorsByTask, setVendorsByTask] = useState<{ [key: string]: SuggestedProvider[] }>({});
  const [loadingVendorsForTask, setLoadingVendorsForTask] = useState<{ [key: string]: boolean }>({});

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      // Call fetchEnrichedSuggestions without location, as providers are fetched separately
      const data = await fetchEnrichedSuggestions(
        eventName,
        eventDescription,
        venueNeeded,
        cateringNeeded
      );
      setSuggestions(data.suggestions);
      toast.success("AI task suggestions loaded!");
    } catch (error) {
      console.error("Failed to fetch AI task suggestions:", error);
      toast.error("Failed to load AI task suggestions.");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleShowVendors = async (taskTitle: string) => {
    if (!eventId) {
      toast.error("Cannot fetch vendors: No event context available.");
      return;
    }
    setLoadingVendorsForTask(prev => ({ ...prev, [taskTitle]: true }));
    try {
      const data = await fetchVendorSuggestionsForTask(taskTitle, eventId);
      setVendorsByTask(prev => ({ ...prev, [taskTitle]: data.suggested_providers }));
      toast.success(`Vendors loaded for "${taskTitle}"!`);
    } catch (error) {
      console.error(`Failed to fetch vendors for ${taskTitle}:`, error);
      toast.error(`Failed to load vendors for "${taskTitle}".`);
    } finally {
      setLoadingVendorsForTask(prev => ({ ...prev, [taskTitle]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!eventId ? (
            <p className="text-red-500 mb-4">Please create an event first to get AI suggestions and vendor recommendations.</p>
          ) : null}
          <Button
            onClick={handleGetSuggestions}
            disabled={loadingSuggestions || !eventId} // Disable if no eventId
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {loadingSuggestions ? (
              <span className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2 text-white" />
                Generating Suggestions...
              </span>
            ) : (
              <span className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Get AI Task Suggestions
              </span>
            )}
          </Button>

          {suggestions.length > 0 && (
            <div className="mt-4 space-y-3">
              <h3 className="font-semibold">Suggested Tasks:</h3>
              {suggestions.map((sug, index) => (
                <div key={index} className="border p-3 rounded-md bg-gray-50">
                  <p className="font-medium">{sug.task}</p>
                  <Badge variant="secondary" className="mt-1">Category: {sug.category}</Badge>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 mr-2 bg-purple-600 color-white hover:bg-purple-700 text-white hover:text-white"
                    onClick={() => handleShowVendors(sug.task)}
                    disabled={loadingVendorsForTask[sug.task] || !eventId} // Disable if no eventId
                  >
                    {loadingVendorsForTask[sug.task] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (                                                                                       
                      "Show Vendors"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => onApplySuggestion(sug.task)}
                  >
                    Add Task
                  </Button>

                  {vendorsByTask[sug.task] && vendorsByTask[sug.task].length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-semibold">Matching Vendors:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {vendorsByTask[sug.task].map((vendor, vIndex) => (
                          <Card key={vIndex} className="p-3 text-sm">
                            <p className="font-medium">{vendor.name}</p>
                            {vendor.address && vendor.address.trim() !== '' ? (
                              <p className="text-gray-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {vendor.address.split(',').slice(-2).join(', ').trim()} {/* Extract city/last parts of address */}
                              </p>
                            ) : vendor.contact && vendor.contact.trim() !== '' ? (
                              <p className="text-gray-600">
                                Contact: {vendor.contact}
                              </p>
                            ) : vendor.description && vendor.description.trim() !== '' ? (
                              <p className="text-gray-600">
                                {vendor.description}
                              </p>
                            ) : null}
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  {vendorsByTask[sug.task] && vendorsByTask[sug.task].length === 0 && !loadingVendorsForTask[sug.task] && (
                    <p className="text-sm text-gray-500 mt-2">No vendors found for this task.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
