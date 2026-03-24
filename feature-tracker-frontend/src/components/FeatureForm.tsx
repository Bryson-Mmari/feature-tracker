import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import API from '../services/api';
import type { Feature, FeaturePriority, FeatureStatus } from '../types/Feature';

interface FeatureFormProps {
  editing: Feature | null;
  fetchFeatures: () => Promise<void>;
  setEditing: Dispatch<SetStateAction<Feature | null>>;
}

function FeatureForm({ editing, fetchFeatures, setEditing }: FeatureFormProps) {
  const [title, setTitle] = useState(editing?.title ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [priority, setPriority] = useState<FeaturePriority>(editing?.priority ?? 'Medium');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      title,
      description,
      priority,
      status: (editing?.status ?? 'Open') as FeatureStatus,
    };

    if (editing) {
      await API.put(`/${editing.id}`, payload);
      setEditing(null);
    } else {
      await API.post('/', payload);
    }

    setTitle('');
    setDescription('');
    setPriority('Medium');
    await fetchFeatures();
  };

  return (
    <form className="feature-form-basic" onSubmit={handleSubmit}>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <select value={priority} onChange={(e) => setPriority(e.target.value as FeaturePriority)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button type="submit">{editing ? 'Update' : 'Add'}</button>
    </form>
  );
}

export default FeatureForm;
