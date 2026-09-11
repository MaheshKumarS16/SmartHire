import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateJob from "./pages/CreateJob";
import MyJobs from "./pages/MyJobs";
import EditJob from "./pages/EditJob";
import Applicants from "./pages/Applicants";
import NotFound from "./pages/NotFound";

import { useAuth } from "./context/AuthContext";


function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}

      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />


        {/* Candidate Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="CANDIDATE">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute allowedRole="CANDIDATE">
              <MyApplications />
            </ProtectedRoute>
          }
        />


        {/* Recruiter Routes */}

        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-job"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <MyJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-job/:id"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <EditJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/applicants/:jobId"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <Applicants />
            </ProtectedRoute>
          }
        />


        {/* 404 */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}


export default App;