"use server";
import axiosServer from "@/lib/axiosServer";
import { errorRequestHandler } from "@/lib/utils";
import { AttendanceType } from "@/types/enum";

const attendAction = async (
  employeeId: number,
  attendanceType: AttendanceType
): Promise<any> => {
  try {
    const formData = {
      employee_id: employeeId,
      attend_type: attendanceType,
    };
    var response = await axiosServer.post(`/attendances/`, formData);
    const result: string = response.data.message;
    return {
      success: true,
      message: result,
    };
  } catch (e: any) {
    return errorRequestHandler(e);
  }
};

export { attendAction };
