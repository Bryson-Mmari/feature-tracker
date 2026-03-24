import API from '../services/api';
import type { Dispatch, SetStateAction } from 'react';
import type { Feature } from '../types/Feature';

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

  return (
    <div className="feature-list-basic">
      {features.map((feature) => (
        <article key={feature.id}>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
          <p>{feature.priority}</p>
          <p>{feature.status}</p>
          <button onClick={() => setEditing(feature)} type="button">Edit</button>
          <button onClick={() => deleteFeature(feature.id)} type="button">Delete</button>
        </article>
      ))}
    </div>
  );
}

export default FeatureList;
