export type ItemType = 'lost' | 'found';

export type ItemStatus =
  | 'Pending'
  | 'Active'
  | 'Potential Match'
  | 'Under Verification'
  | 'Resolved'
  | 'Closed';

export type CategoryType =
  | 'Mobile Phones'
  | 'Wallets'
  | 'Documents'
  | 'Keys'
  | 'Bags'
  | 'Backpacks'
  | 'Laptops'
  | 'Jewellery'
  | 'Watches'
  | 'Glasses'
  | 'Electronics'
  | 'Vehicles'
  | 'Pets'
  | 'Missing Persons'
  | 'Other Items';

export interface ContactPreferences {
  name: string;
  phone: string;
  email: string;
  allowDirectCall: boolean;
  showPhonePublicly: boolean;
  preferredContactMethod: 'chat' | 'phone' | 'email';
}

export interface PersonDetails {
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: string;
  clothingDescription: string;
  lastSeenLocation: string;
  medicalConditions?: string;
}

export interface ItemReport {
  id: string; // e.g. B2U-LST-89210 or B2U-FND-43810
  type: ItemType;
  name: string;
  category: CategoryType;
  description: string;
  photographs: string[];
  date: string; // YYYY-MM-DD
  state: string;
  district: string;
  city: string;
  landmark: string;
  brand?: string;
  colour?: string;
  identificationFeatures: string;
  reward?: string;
  contactPreferences: ContactPreferences;
  status: ItemStatus;
  userId: string;
  reporterName: string;
  createdAt: string;
  updatedAt: string;
  isMissingPerson?: boolean;
  personDetails?: PersonDetails;
  isFlagged?: boolean;
}

export interface MatchReason {
  field: string;
  score: number;
  detail: string;
}

export interface MatchRecord {
  id: string;
  lostReportId: string;
  foundReportId: string;
  matchPercentage: number;
  reasons: string[];
  status: 'Potential' | 'Verified' | 'Rejected' | 'Reunited';
  createdAt: string;
  verifiedByAdmin?: boolean;
}

export interface AppNotification {
  id: string;
  type: 'match' | 'message' | 'status' | 'reunion' | 'system';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  reportId?: string;
  matchId?: string;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  reportId?: string;
  reportName?: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  isBlocked?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  role: 'user' | 'admin';
  avatar: string;
  createdAt: string;
  totalReports: number;
  reunionsCount: number;
  privacy: {
    maskPhone: boolean;
    receiveMatchAlerts: boolean;
    receiveEmailDigests: boolean;
  };
}

export interface DashboardStats {
  totalLost: number;
  totalFound: number;
  successfullyReunited: number;
  activeReports: number;
  potentialMatches: number;
  unreadNotifications: number;
  missingPersonsCount: number;
}
