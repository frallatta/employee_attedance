"use client";
import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import AppTopbar from "@/layout/AppTopbar";
import { AppTopbarRef } from "@/types";

import "primeicons/primeicons.css";

export default function DashboardTemplate({
  employeeCount,
  attendanceCount,
}: {
  employeeCount: number;
  attendanceCount: number;
}) {
  const [count, setCount] = useState(0);
  const topbarRef = useRef<AppTopbarRef>(null);
  return (
    <>
      <div className="flex">
        <div className="border rounded my-4 p-4">
          <p className="font-semibold"> Total Employee</p>
          <p className="text-center text-xl">{employeeCount}</p>
        </div>
        <div className="border rounded m-4 p-4">
          <p className="font-semibold"> Total Attendance Today</p>
          <p className="text-center text-xl">{attendanceCount}</p>
        </div>
      </div>
    </>
  );
}
