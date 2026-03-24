import { useEffect, useState } from 'react';
import API from './services/api';
import FeatureForm from './components/FeatureForm';
import FeatureList from './components/FeatureList';
import Filter from './components/Filter';
import Pagination from './components/Pagination';
import type { Feature, FeatureStatus } from './types/Feature';
import './App.css';

function App() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [editing, setEditing] = useState<Feature | null>(null);
  const [status, setStatus] = useState<FeatureStatus | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFeatures = async () => {
    const response = await API.get<{ data: Feature[]; totalPages: number }>(`?status=${status}&page=${page}&limit=5`);
    setFeatures(response.data.data);
    setTotalPages(response.data.totalPages);
  };

  useEffect(() => {
    void fetchFeatures();
  }, [status, page]);

  return (
    <main className="app-basic">
      <h1>Feature Request Tracker</h1>
      <Filter setStatus={setStatus} />
      <FeatureForm editing={editing} fetchFeatures={fetchFeatures} setEditing={setEditing} />
      <FeatureList features={features} fetchFeatures={fetchFeatures} setEditing={setEditing} />
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </main>
  );
}

export default App;
