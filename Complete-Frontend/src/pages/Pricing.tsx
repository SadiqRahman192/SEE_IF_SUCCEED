
import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for small events and getting started",
      features: [
        "Up to 5 events",
        "Basic task management",
        "Email reminders",
        "PDF exports"
      ],
      buttonText: "Get Started",
      buttonVariant: "secondary" as const,
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for event professionals and agencies",
      features: [
        "Unlimited events",
        "AI-powered suggestions",
        "Advanced analytics",
        "Priority support",
        "Custom branding"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with specific needs",
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "Training included"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "secondary" as const,
      popular: false
    }
  ];

  const [currentView, setCurrentView] = useState("pricing"); // Default to "pricing" for this page

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select the perfect plan for your event management needs. Start free and upgrade as you grow.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="max-w-6xl mx-auto mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div 
                  key={plan.name} 
                  className={`relative ${plan.popular ? 'scale-105' : ''}`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <Card 
                    className={`h-full ${
                      plan.popular 
                        ? 'border-green-500 shadow-lg dark:shadow-green-500/20' 
                        : 'border-border'
                    }`}
                  >
                    <CardHeader className="text-center pb-8">
                      <CardTitle className="text-2xl font-bold text-foreground">
                        {plan.name}
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-foreground">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-muted-foreground ml-1">
                            {plan.period}
                          </span>
                        )}
                      </div>
                      <CardDescription className="mt-4 text-muted-foreground">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      {/* Features List */}
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Button 
                        className={`w-full ${
                          plan.buttonVariant === 'default' 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : ''
                        }`}
                        variant={plan.buttonVariant}
                      >
                        {plan.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-4">
              All plans include a 30-day money-back guarantee
            </p>
            <p className="text-sm text-muted-foreground">
              Need help choosing? <a href="/contact" className="text-green-500 hover:text-green-600">Contact our sales team</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
