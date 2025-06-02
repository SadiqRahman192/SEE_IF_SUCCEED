
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Hero = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Plan Perfect Events with{" "}
              <span className="text-green-500">AI Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Streamline your event planning process with our AI-powered platform. From automated scheduling to intelligent task management, we make event planning effortless.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-lg px-8 py-6">
                Start Planning Now
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-500">10K+</div>
                <div className="text-gray-600">Events Planned</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500">500+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500">99%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="p-6 bg-white shadow-2xl">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-green-500 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-green-100 rounded flex items-center px-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <div className="h-2 bg-green-500 rounded w-1/3"></div>
                  </div>
                  <div className="h-8 bg-gray-100 rounded flex items-center px-4">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    <div className="h-2 bg-gray-400 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-yellow-400 rounded-full opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
