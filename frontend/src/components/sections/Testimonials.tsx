
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Event Coordinator",
    company: "Corporate Events Inc.",
    content: "EventMaster Pro transformed how we handle corporate events. The AI suggestions are incredibly accurate and save us hours of planning time.",
    rating: 5,
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "Wedding Planner",
    company: "Dream Weddings",
    content: "The automation features are game-changing. I can now manage twice as many weddings with the same level of detail and care.",
    rating: 5,
    avatar: "MC"
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "Tech Solutions LLC",
    content: "Our conference attendance increased by 40% thanks to the intelligent email campaigns and attendee management tools.",
    rating: 5,
    avatar: "ER"
  },
  {
    name: "David Thompson",
    role: "Non-profit Coordinator",
    company: "Community First",
    content: "Finally, an event platform that understands our budget constraints while delivering professional results every time.",
    rating: 5,
    avatar: "DT"
  },
  {
    name: "Lisa Park",
    role: "Festival Organizer",
    company: "Music & Arts Festival",
    content: "Managing a multi-day festival with 50+ vendors has never been easier. The dashboard gives us complete visibility.",
    rating: 5,
    avatar: "LP"
  },
  {
    name: "Robert Kim",
    role: "Corporate Trainer",
    company: "Leadership Academy",
    content: "The task automation and reminder system ensures nothing falls through the cracks. Our events run like clockwork now.",
    rating: 5,
    avatar: "RK"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Event Professionals Worldwide
          </h2>
          <p className="text-xl text-gray-600">
            See what our customers have to say about their experience
          </p>
        </div>
      </div>

      {/* First slider moving left */}
      <div className="relative mb-8">
        <div className="flex animate-slide-left space-x-6">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <Card key={index} className="flex-shrink-0 w-96 bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Second slider moving right */}
      <div className="relative">
        <div className="flex animate-slide-right space-x-6">
          {[...testimonials.slice(3), ...testimonials.slice(3)].map((testimonial, index) => (
            <Card key={index} className="flex-shrink-0 w-96 bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
