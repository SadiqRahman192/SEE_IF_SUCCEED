
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/ui/EventCard";
import { TaskList } from "@/components/ui/TaskList";
import { AIAssistant } from "@/components/ui/AIAssistant";
import { Analytics } from "@/components/ui/Analytics";
import  CreateEventForm  from "@/components/forms/CreateEventModal";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DashboardTabs = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <CreateEventForm />
        <Button 
          variant="outline" 
          className="border-green-500 text-green-600 hover:bg-green-50"
          onClick={() => navigate("/reminders")}
        >
          <Mail className="h-4 w-4 mr-2" />
          Send Reminders
        </Button>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventCard
              title="Annual Company Retreat"
              date="2024-06-15"
              location="Mountain Resort"
              attendees={120}
              progress={75}
              status="In Progress"
            />
            <EventCard
              title="Product Launch Event"
              date="2024-06-20"
              location="Convention Center"
              attendees={500}
              progress={45}
              status="Planning"
            />
            <EventCard
              title="Team Building Workshop"
              date="2024-06-25"
              location="Office Conference Room"
              attendees={25}
              progress={90}
              status="Almost Ready"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <TaskList />
        </TabsContent>
        
        <TabsContent value="ai" className="mt-6">
          <AIAssistant />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};



