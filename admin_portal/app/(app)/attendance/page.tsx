import React from "react";
import "primeicons/primeicons.css";
import AttendanceTemplate from "./AttendanceList";
import axiosServer from "@/lib/axiosServer";

const ProfilePage = async () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-12">
        <div className="card">
          <h5>Attendance Data</h5>
          <AttendanceTemplate />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
