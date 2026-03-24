export type FeaturePriority = 'Low' | 'Medium' | 'High';

export type FeatureStatus = 'Open' | 'In Progress' | 'Completed';

export interface Feature {
  id?: number;
  title: string;
  description?: string;
  priority: FeaturePriority;
  status: FeatureStatus;
  created_at?: string;
}
