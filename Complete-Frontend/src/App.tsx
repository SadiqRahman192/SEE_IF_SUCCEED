import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Reminders from "./pages/Reminders";
import ReminderForm from "./pages/ReminderForm";
import NotFound from "./pages/NotFound";
import AllEvents from "./pages/Allevents";
import EventDetailsPage from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";
import CreateEvent from "./pages/CreateEvent";
// import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";

// Layout
import Layout from "./components/Layout";

// Auth Forms
import SignInForm from "./components/forms/SignInForm";
import SignUpForm from "./components/forms/SignUpForm";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth Routes - no layout */}
              <Route path="/signin" element={<SignInForm />} />
              <Route path="/signup" element={<SignUpForm />} />

              {/* Public Routes with Layout */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
              <Route path="/terms" element={<Layout><Terms /></Layout>} />
              <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />

              {/* Private Routes with Layout */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Layout><Dashboard /></Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/allevents"
                element={
                  <PrivateRoute>
                    <Layout>
                      <AllEvents />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/event/:id"
                element={
                  <PrivateRoute>
                    <Layout><EventDetailsPage /></Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-event/:id"
                element={
                  <PrivateRoute>
                    <Layout><EditEvent /></Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/reminders"
                element={
                  <Layout><Reminders /></Layout>
                }
              />
              <Route
                path="/reminders/:eventId"
                element={
                  <Layout><ReminderForm /></Layout>
                }
              />
               <Route
                path="/create-event"
                element={
                  <PrivateRoute>
                    <Layout><CreateEvent /></Layout>
                  </PrivateRoute>
                }
              />
              {/* <Route path="/contact" element={<Layout><Contact /></Layout>} /> */}

              {/* 404 Page with Layout */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;
