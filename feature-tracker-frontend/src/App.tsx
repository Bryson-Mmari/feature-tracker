import { useEffect, useState } from 'react';
import API from './services/api';
import FeatureForm from './components/FeatureForm';
import FeatureList from './components/FeatureList';
import type { Feature } from './types/Feature';
import './App.css';

function App() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [editing, setEditing] = useState<Feature | null>(null);

  const fetchFeatures = async () => {
    const response = await API.get<{ data: Feature[] }>('/');
    setFeatures(response.data.data);
  };

  useEffect(() => {
    void fetchFeatures();
  }, []);

  return (
    <main className="app-basic">
      <h1>Feature Request Tracker</h1>
      <FeatureForm editing={editing} fetchFeatures={fetchFeatures} setEditing={setEditing} />
      <FeatureList features={features} fetchFeatures={fetchFeatures} setEditing={setEditing} />
    </main>
  );
}

export default App;
