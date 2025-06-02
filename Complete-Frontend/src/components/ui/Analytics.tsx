
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Analytics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Registration Rate</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Task Completion</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Budget Utilization</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="text-sm font-medium">Venue Confirmation</span>
              <span className="text-xs text-red-600">2 days</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="text-sm font-medium">Catering Order</span>
              <span className="text-xs text-yellow-600">5 days</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="text-sm font-medium">Final Headcount</span>
              <span className="text-xs text-green-600">8 days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
