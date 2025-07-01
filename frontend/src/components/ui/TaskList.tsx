
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchPendingTasks, fetchVendorSuggestions, Task, SuggestedProvider, TaskSuggestionResponse } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Phone, Mail, MessageSquare, Globe } from "lucide-react";

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState<Record<string, boolean>>({});
  const [taskSuggestionsData, setTaskSuggestionsData] = useState<Record<string, TaskSuggestionResponse>>({});
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchPendingTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast.error("Failed to load tasks.");
      } finally {
        setLoadingTasks(false);
      }
    };
    getTasks();
  }, []);

  const toggleTaskCompletion = (id: string) => {
    // This would ideally be an API call to update the task completion status
    setTasks(tasks.map(task => 
      task._id === id ? { ...task, completed: !task.completed } : task
    ));
    toast.info("Task completion status updated locally. (API integration needed)");
  };

  const handleGetSuggestions = async (taskId: string) => {
    setLoadingSuggestions(prev => ({ ...prev, [taskId]: true }));
    try {
      const suggestions = await fetchVendorSuggestions(taskId);
      setTaskSuggestionsData(prev => ({ ...prev, [taskId]: suggestions }));
      setExpandedTasks(prev => ({ ...prev, [taskId]: true })); // Expand after fetching
      toast.success("Vendor suggestions loaded!");
    } catch (error) {
      console.error("Failed to fetch vendor suggestions:", error);
      toast.error("Failed to load vendor suggestions.");
    } finally {
      setLoadingSuggestions(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const toggleExpandTask = (taskId: string) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Management</CardTitle>
      </CardHeader>
      <CardContent>
        {loadingTasks ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="ml-2 text-gray-600">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500">No pending tasks found.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task._id} className="border rounded-lg overflow-hidden">
                <div className="flex items-center space-x-4 p-3 hover:bg-gray-50">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task._id)}
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-600">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {expandedTasks[task._id] && taskSuggestionsData[task._id] && (
                  <div className="p-3 border-t bg-gray-50">
                    <h4 className="font-semibold mb-2">Suggested Task:</h4>
                    <p className="text-gray-800 mb-2">{taskSuggestionsData[task._id].task}</p>
                    {taskSuggestionsData[task._id].suggested_providers.length > 0 ? (
                      <div className="space-y-2">
                        <h5 className="font-semibold mt-3">Top Options Nearby:</h5>
                        {taskSuggestionsData[task._id].suggested_providers.map((provider, index) => (
                          <div key={index} className="border p-2 rounded-md bg-white">
                            <p className="font-medium">{provider.name}</p>
                            <p className="text-sm text-gray-700">{provider.address}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {provider.phone && provider.phone !== 'N/A' && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`tel:${provider.phone.replace(/\s/g, '')}`}>
                                    <Phone className="h-4 w-4 mr-1" /> Call Now
                                  </a>
                                </Button>
                              )}
                              {provider.booking_link && provider.booking_link !== 'N/A' && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={provider.booking_link.startsWith('http') ? provider.booking_link : `http://${provider.booking_link}`} target="_blank" rel="noopener noreferrer">
                                    <Globe className="h-4 w-4 mr-1" /> Visit Website
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No specific provider suggestions found for this task.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
