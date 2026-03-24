import API from '../services/api';
import type { Dispatch, SetStateAction } from 'react';
import type { Feature, FeatureStatus } from '../types/Feature';

interface FeatureListProps {
  features: Feature[];
  fetchFeatures: () => Promise<void>;
  setEditing: Dispatch<SetStateAction<Feature | null>>;
}

function FeatureList({ features, fetchFeatures, setEditing }: FeatureListProps) {
  const deleteFeature = async (id: number) => {
    await API.delete(`/${id}`);
    await fetchFeatures();
  };

  const updateStatus = async (id: number, status: FeatureStatus) => {
    await API.patch(`/${id}/status`, { status });
    await fetchFeatures();
  };

  return (
    <div className="feature-list-basic">
      {features.map((feature) => (
        <article key={feature.id}>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
          <p>Priority: {feature.priority}</p>
          <p>Status: {feature.status}</p>
          <select value={feature.status} onChange={(e) => updateStatus(feature.id, e.target.value as FeatureStatus)}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button onClick={() => setEditing(feature)} type="button">Edit</button>
          <button onClick={() => deleteFeature(feature.id)} type="button">Delete</button>
        </article>
      ))}
    </div>
  );
}

export default FeatureList;
