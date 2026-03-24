export type FeatureStatus = 'Open' | 'In Progress' | 'Completed';

export type FeaturePriority = 'Low' | 'Medium' | 'High';

export interface Feature {
  id: number;
  title: string;
  description: string;
  status: FeatureStatus;
  priority: FeaturePriority;
  created_at: string;
}

export type FeatureFormValues = Pick<
  Feature,
  'title' | 'description' | 'priority' | 'status'
>;
