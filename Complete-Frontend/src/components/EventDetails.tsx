import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'; // Import Input component
import { Calendar, Download, MapPin, Trash, Plus } from 'lucide-react'; // Import Plus icon
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { deleteEvent } from '../lib/api'; // Import deleteEvent
import Navigation from './layout/Navigation';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface EventDetailsProps {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  organizer?: string;
  tasks: Task[];
  onTaskChange?: () => void; // New prop for re-fetching tasks
}

const EventDetails: React.FC<EventDetailsProps> = ({ 
  id, 
  title, 
  date, 
  location, 
  description, 
  organizer, 
  tasks,
  onTaskChange
}) => {
  const navigate = useNavigate();
  // const [eventTasks, setEventTasks] = useState<Task[]>(tasks); // Removed local state

  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  const toggleTask = async (taskId: string) => {
    const taskToUpdate = tasks.find(task => task.id === taskId); // Use tasks prop
    if (!taskToUpdate) return;

    const newCompletedStatus = !taskToUpdate.completed;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: newCompletedStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (onTaskChange) {
        onTaskChange(); // Trigger re-fetch in parent
      }
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  const completedTasksCount = tasks.filter(task => task.completed).length; // Use tasks prop
  const progress = tasks.length > 0 
    ? Math.round((completedTasksCount / tasks.length) * 100) 
    : 0;

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error("Task title cannot be empty.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, { // eventId is 'id' here
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskTitle }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNewTaskTitle('');
      if (onTaskChange) {
        onTaskChange(); // Trigger re-fetch in parent
      }
      toast.success("Task added successfully!");
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Failed to add task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (onTaskChange) {
        onTaskChange(); // Trigger re-fetch in parent
      }
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-event/${id}`);
  };
  
  const handleDelete = async () => {
    try {
      await deleteEvent(id); // Use the imported deleteEvent function
      navigate('/');
    } catch (error) {
      console.error('Error deleting event:', error);
      // The toast message is already handled by the api.ts function
    }
  };
  
  const handleDownloadPdf = () => {
    if (id) {
      window.open(`http://localhost:5000/api/pdf/${id}`, '_blank');
      toast.success('PDF download initiated!');
    } else {
      toast.error('Cannot download PDF: Event ID is missing.');
    }
  };

  return (
    <>
    <Navigation />
    <div className="space-y-6 m-14">
      <div className="flex flex-col-reverse gap-4 md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            Edit Event
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the event
                  and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 mt-0.5 text-event-primary" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 mt-0.5 text-event-primary" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{location}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="font-medium mb-1">Description</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {organizer && (
            <div>
              <p className="font-medium mb-1">Organizer</p>
              <p className="text-sm text-muted-foreground">{organizer}</p>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full md:w-auto text-green-500 border border-green-600" 
            onClick={handleDownloadPdf}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Tasks</CardTitle>
            <p className="text-sm text-muted-foreground">
              {completedTasksCount} of {tasks.length} completed
            </p>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Add a new task"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTask();
                }
              }}
            />
            <Button onClick={handleAddTask} className='bg-green-500'>Add Task</Button>
          </div>
          {tasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No tasks available</p>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <label 
                      htmlFor={`task-${task.id}`}
                      className={`text-sm cursor-pointer flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.title}
                    </label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default EventDetails;
