
export type UserRole = "user" | "organizer" | "admin";

export type OrganizerRequestStatus =
  | "none"
  | "pending"
  | "approved"
  | "rejected";

export interface User {
  _id: string;
  fullName: string;
  userName: string;
  email: string;
  dateOfBirth: string; // Date from backend becomes string
  gender: "male" | "female";
  profilePicture: string;
  role: UserRole;
  organizerRequest: OrganizerRequestStatus;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
