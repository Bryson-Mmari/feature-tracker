import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import API from '../services/api';
import type { Feature, FeatureFormValues } from '../types/Feature';

interface FeatureFormProps {
  fetchFeatures: () => Promise<void>;
  editing: Feature | null;
  onClose: () => void;
  setEditing: Dispatch<SetStateAction<Feature | null>>;
}

const initialFormState: FeatureFormValues = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Open',
};

const getFormValues = (editing: Feature | null): FeatureFormValues =>
  editing
    ? {
        title: editing.title,
        description: editing.description,
        priority: editing.priority,
        status: editing.status,
      }
    : initialFormState;

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message ?? fallback;
};

function FeatureForm({ fetchFeatures, editing, onClose, setEditing }: FeatureFormProps) {
  const [form, setForm] = useState<FeatureFormValues>(() => getFormValues(editing));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.warning('Please add a title before submitting.');
      return;
    }

    if (!form.description.trim()) {
      toast.info('A short description will help teammates understand the request.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (editing) {
        await API.put(`/${editing.id}`, {
          title: form.title,
          description: form.description,
          priority: form.priority,
          status: editing.status,
        });
        setEditing(null);
        toast.success('Feature request updated successfully.');
      } else {
        await API.post('/', {
          ...form,
          status: 'Open',
        });
        toast.success('Feature request created successfully.');
      }

      setForm(initialFormState);
      await fetchFeatures();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, 'We could not save this feature request.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="feature-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Feature title</span>
        <input
          className="text-input"
          placeholder="For example: Add team voting"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          className="text-input text-area"
          placeholder="Describe the user problem, expected impact, or rough acceptance criteria."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
        />
      </label>

      <label className="field">
        <span>Priority</span>
        <select
          className="text-input"
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value as FeatureFormValues['priority'] })
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </label>

      <div className="modal-actions">
        <button className="ghost-button" onClick={onClose} type="button">
          Cancel
        </button>
        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving...' : editing ? 'Update Request' : 'Create Request'}
        </button>
      </div>
    </form>
  );
}

export default FeatureForm;
