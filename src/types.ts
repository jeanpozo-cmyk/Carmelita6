// User Roles
export type UserRole = 'GUEST' | 'USER' | 'AFFILIATE' | 'SUPERADMIN';

// Financial Tree Structure
export interface FinancialRecord {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  category: string;
  date: string;
  urgency?: 'RED' | 'YELLOW' | 'GREEN'; // Vitality tagging
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  businessType: string;
  credits: number; // Carmelita Credits (CC)
  onboardingComplete: boolean;
  avatar?: string;
  bio?: string;
  badges?: string[];
}

// Tools Data Models
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface Debt {
  id: string;
  creditor: string;
  totalAmount: number;
  interestRate: number; // Annual %
  minPayment: number;
  emotionalScore: number; // 1-10 How much stress it causes
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  unit: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  temperature: 'COLD' | 'WARM' | 'HOT'; // Sales lead temp
  lastContact: string;
  notes: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'CLIENT' | 'PAYMENT' | 'DELIVERY';
}

// Agency / AI Tools
export interface AgencyJob {
  id: string;
  type: 'COPY' | 'IMAGE' | 'VIDEO' | 'STRATEGY';
  prompt: string;
  result?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: number;
}

// Support Ticket definition
export interface SupportTicket {
  id: string;
  userId: string;
  issue: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
}

// LMS / University
export interface CourseModule {
  id: string;
  title: string;
  desc: string;
  content: string; // HTML or Markdown
  quizQuestion?: string;
  quizAnswer?: string; // Correct answer option
}