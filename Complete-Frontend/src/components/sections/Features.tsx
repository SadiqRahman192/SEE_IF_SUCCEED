import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  Mail,
  FileText,
} from "lucide-react";
import Navigation from "../layout/Navigation";
const features = [
  {
    icon: Calendar,
    title: "AI-Powered Planning",
    description:
      "Let our AI assistant help you plan every detail of your event with intelligent suggestions and automated workflows.",
    color: "text-green-500",
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description:
      "Optimize schedules automatically based on attendee availability and venue constraints.",
    color: "text-gray-600",
  },
  {
    icon: User,
    title: "Attendee Management",
    description:
      "Effortlessly manage guest lists, RSVPs, and communications with our intuitive tools.",
    color: "text-green-500",
  },
  {
    icon: CheckCircle,
    title: "Task Automation",
    description:
      "Automate repetitive tasks and never miss important deadlines with smart reminders.",
    color: "text-gray-600",
  },
  {
    icon: Mail,
    title: "Email Integration",
    description:
      "Send beautiful, personalized invitations and updates with our integrated email system.",
    color: "text-green-500",
  },
  {
    icon: FileText,
    title: "Document Generation",
    description:
      "Generate contracts, invoices, and reports automatically with custom templates.",
    color: "text-gray-600",
  },
];

export const Features = () => {
  return (
    <>
      {/* <Navigation /> */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Event Planning
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools empowers you to create memorable
              events with unprecedented efficiency and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <feature.icon className={`h-12 w-12 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
