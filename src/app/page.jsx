"use client"

import { useAuth } from "../contexts/AuthContext";
import Landing from "../components/landing/Landing";
import ClientDashboard from "../components/client/ClientDashboard";
import AttorneyDashboard from "../components/attorney/AttorneyDashboard";

export default function Home() {
  const { user, isLoading } = useAuth()

  console.log(user)
  if(isLoading) return "Loading..."
  if(user?.userType == "client") return <ClientDashboard />
  if(user?.userType == "attorney") return <AttorneyDashboard />
  if(user?.userType == "staff") return "staff"
  return (
    <div className="font-sans text-white bg-black">
      <Landing />
    </div>
  );
}
