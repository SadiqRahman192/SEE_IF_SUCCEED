import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Reminders from "./pages/Reminders";
import ReminderForm from "./pages/ReminderForm";
import NotFound from "./pages/NotFound";
import AllEvents from "./pages/Allevents";
import EventDetailsPage from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="eventmaster-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/signin" element={<SignInForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/" element={<Index />} />
              <Route
                path="/dashboard"
                element={<PrivateRoute><Dashboard /></PrivateRoute>}
              />
              <Route
                path="/allevents"
                element={<PrivateRoute><AllEvents /></PrivateRoute>}
              />
              <Route
                path="/event/:id"
                element={<PrivateRoute><EventDetailsPage /></PrivateRoute>}
              />
              <Route
                path="/edit-event/:id"
                element={<PrivateRoute><EditEvent /></PrivateRoute>}
              />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/reminders/:eventId" element={<ReminderForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;