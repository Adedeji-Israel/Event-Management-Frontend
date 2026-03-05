import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from '@/pages/LandingPage'
import Signup from "@/pages/Signup"
import Login from '@/pages/Login'
import VerifyAccount from '@/pages/VerifyAccount';
import ForgotPassword from '@/pages/ForgotPassword';
import AllEvents from '@/pages/AllEvents';
import NotFoundPage from '@/pages/NotFoundPage';

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

import DashboardHome from '@/pages/admin/DashboardHome';
import AdminEvents from '@/pages/admin/AdminEvents';
import SingleEvent from '@/pages/SingleEvent';

import OrganizerDashboard from '@/pages/organizer/OrganizerDashboard';
import OrganizerEvents from '@/pages/organizer/OrganizerEvents';
import CreateEvent from '@/pages/organizer/CreateEvent';
import EditEvent from '@/pages/organizer/EditEvent';

import AttendeeDashboard from '@/pages/attendee/AttendeeDashboard';
import AttendeeEvents from '@/pages/attendee/AttendeeEvents';
import AttendeeTickets from '@/pages/attendee/AttendeeTickets';
import UpcomingEvents from '@/pages/attendee/UpcomingEvents';
import PastEvents from '@/pages/attendee/PastEvents';

import CheckoutPageOne from '@/pages/CheckoutPageOne';
import CheckoutPageTwo from '@/pages/CheckoutPageTwo';
import PaymentVerifyPage from '@/pages/PaymentVerifyPage';

import '@/App.css'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/verify-account/:verificationToken" element={<VerifyAccount />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/all-events" element={<AllEvents />} />

        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/events/:eventId/checkout" element={<CheckoutPageOne />} />
          <Route path="/events/:eventId/billing" element={<CheckoutPageTwo />} />
          <Route path="/events/payment/verify" element={<PaymentVerifyPage />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="admin" element={<DashboardHome />} />
            <Route path="admin/events" element={<AdminEvents />} />
            <Route path="events/:eventId" element={<SingleEvent />} />
          </Route> 

          {/* ORGANIZER */}
          <Route element={<ProtectedRoute allowedRoles={["organizer"]} />}>
            <Route path="organizer" element={<OrganizerDashboard />} />
            <Route path="organizer/events" element={<OrganizerEvents />} />
            <Route path="organizer/events/create" element={<CreateEvent />} />
            <Route path="organizer/events/:eventId/edit" element={<EditEvent />} />
          </Route>

          {/* USER */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="attendee" element={<AttendeeDashboard />} />
            <Route path="attendee/events" element={<AttendeeEvents />} />
            <Route path="attendee/events/upcoming" element={<UpcomingEvents />} />
            <Route path="attendee/events/past" element={<PastEvents />} /> 
            <Route path="attendee/my-tickets" element={<AttendeeTickets />} />
          </Route>
        </Route>

        {/* Catch Unknown Routes */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

    </div>
  )
}

export default App
