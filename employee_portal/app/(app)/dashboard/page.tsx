"use client";
import { useState, useRef } from "react";
import { AppTopbarRef } from "@/types";
import "primeicons/primeicons.css";
import FormButton from "@/component/FormButton";
import { format } from "date-fns";

export default function DashboardPage() {
  const [count, setCount] = useState(0);
  const topbarRef = useRef<AppTopbarRef>(null);
  const currentDate = new Date();
  return (
    <>
      <div>
        <div className="card">
          <p className="text-lg font-semibold">TODAY ATTENDANCE DATA</p>
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border border-gray-200">
                <td className="py-3 px-4">
                  {format(new Date(), "yyyy-MM-dd")}
                </td>
                <td className="py-3 px-4">Manager</td>
                <td className="py-3 px-4">23/04/18</td>
              </tr>
            </tbody>
          </table>
          <div className="flex gap-4 mt-4">
            <FormButton labelText="Check In" severity="success" />
            <FormButton labelText="Check Out" severity="danger" />
          </div>
        </div>
      </div>
    </>
  );
}
