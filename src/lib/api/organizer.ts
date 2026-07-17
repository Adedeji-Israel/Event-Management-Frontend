// lib/api/organizer.ts
import api from "@/lib/AxiosInterceptor";

export type OrganizerRequestStatus = "none" | "pending" | "approved" | "rejected";

export interface OrganizerRequestUser {
    _id: string;
    fullName: string;
    email: string;
    dateOfBirth: string;
    organizerRequest: OrganizerRequestStatus;
}

export const requestOrganizerAccess = async () => {
    const { data } = await api.patch("/dashboard/user/request-organizer");
    return data;
};

export const fetchOrganizerRequests = async () => {
    const { data } = await api.get<{
        success: boolean;
        count: number;
        data: OrganizerRequestUser[];
    }>("/dashboard/admin/organizer-requests");
    return data.data;
};

export const approveOrganizerRequest = async (id: string) => {
    const { data } = await api.patch(`/dashboard/admin/organizer-requests/${id}/approve`);
    return data;
};

export const rejectOrganizerRequest = async (id: string) => {
    const { data } = await api.patch(`/dashboard/admin/organizer-requests/${id}/reject`);
    return data;
};
