
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const initialTasks = [
  { id: 1, title: "Send event invitations", completed: false, dueDate: "2024-06-10", priority: "high" },
  { id: 2, title: "Book catering service", completed: true, dueDate: "2024-06-08", priority: "medium" },
  { id: 3, title: "Set up registration system", completed: false, dueDate: "2024-06-12", priority: "high" },
  { id: 4, title: "Prepare welcome packets", completed: false, dueDate: "2024-06-14", priority: "low" },
  { id: 5, title: "Confirm venue details", completed: true, dueDate: "2024-06-05", priority: "high" },
];

export const TaskList = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
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
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
              />
              <div className="flex-1">
                <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </p>
                <p className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
