import React from "react";
import "primeicons/primeicons.css";
import AttendanceTemplate from "./AttendanceList";
import axiosServer from "@/lib/axiosServer";
import { Profile } from "@/types/profile";

const ProfilePage = async () => {
  const resProfileData = await axiosServer.get("/auth/profile");
  const profileData: Profile = resProfileData.data;
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-12">
        <div className="card">
          <h5>Attendance History</h5>
          <AttendanceTemplate profileData={profileData} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
