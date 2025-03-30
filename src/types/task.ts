interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  reminderDate?: Date;
}

export type { Task }; 