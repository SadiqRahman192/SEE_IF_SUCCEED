
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Clock, User, Calendar } from "lucide-react";

const suggestions = [
  {
    icon: Calendar,
    title: "Schedule Vendor Meeting",
    description: "Based on your event timeline, consider scheduling a final vendor meeting 2 weeks before the event.",
    priority: "Medium",
    color: "text-blue-500"
  },
  {
    icon: User,
    title: "Send Reminder Emails",
    description: "It's time to send reminder emails to attendees. This typically improves attendance by 15%.",
    priority: "High",
    color: "text-red-500"
  },
  {
    icon: Clock,
    title: "Update Event Timeline",
    description: "Your current timeline shows some overlapping activities. Consider adjusting the schedule.",
    priority: "Low",
    color: "text-green-500"
  },
  {
    icon: Lightbulb,
    title: "Budget Optimization",
    description: "I found 3 ways to reduce costs by 12% without compromising event quality.",
    priority: "Medium",
    color: "text-yellow-500"
  }
];

export const AIAssistant = () => {
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
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <suggestion.icon className={`h-5 w-5 mt-1 ${suggestion.color}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        suggestion.priority === 'High' ? 'bg-red-100 text-red-700' :
                        suggestion.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {suggestion.priority} Priority
                      </span>
                      <Button size="sm" variant="outline">Apply Suggestion</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
