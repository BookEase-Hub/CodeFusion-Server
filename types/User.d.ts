export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: 'user' | 'admin';
  subscriptionPlan: 'free' | 'premium';
  subscriptionStatus: 'active' | 'inactive' | 'trial';
  trialEndsAt?: Date;
  billingInfo?: {
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  linkedAccounts?: {
    provider?: string;
    accountId?: string;
    accessToken?: string;
  }[];
  createdAt: Date;
}
