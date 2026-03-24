import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import API from './services/api';
import FeatureList from './components/FeatureList';
import FeatureForm from './components/FeatureForm';
import Filter from './components/Filter';
import Pagination from './components/Pagination';
import type { Feature, FeatureStatus } from './types/Feature';
import './App.css';

interface FeaturesResponse {
  data: Feature[];
  totalPages: number;
}

type ModalState = 'form' | 'view' | 'move' | 'delete' | null;
type ThemeMode = 'light' | 'dark';

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message ?? fallback;
};

const getAvailableStatuses = (status: FeatureStatus): FeatureStatus[] => {
  switch (status) {
    case 'Open':
      return ['In Progress', 'Completed'];
    case 'In Progress':
      return ['Completed'];
    default:
      return [];
  }
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem('feature-tracker-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function App() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [status, setStatus] = useState<FeatureStatus | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editing, setEditing] = useState<Feature | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [featurePendingDelete, setFeaturePendingDelete] = useState<Feature | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [moveStatus, setMoveStatus] = useState<FeatureStatus | ''>('');
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('feature-tracker-theme', theme);
  }, [theme]);

  const fetchFeatures = useCallback(async (currentStatus = status, currentPage = page) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: '5',
      });

      if (currentStatus) {
        params.set('status', currentStatus);
      }

      const res = await API.get<FeaturesResponse>(`?${params.toString()}`);
      setFeatures(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to load features right now.'));
    } finally {
      setIsLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    void fetchFeatures(status, page);
  }, [fetchFeatures, page, status]);

  const summary = useMemo(() => {
    const openCount = features.filter((feature) => feature.status === 'Open').length;
    const inProgressCount = features.filter((feature) => feature.status === 'In Progress').length;
    const doneCount = features.filter((feature) => feature.status === 'Completed').length;

    return { openCount, inProgressCount, doneCount };
  }, [features]);

  const closeModal = () => {
    setEditing(null);
    setSelectedFeature(null);
    setFeaturePendingDelete(null);
    setMoveStatus('');
    setModalState(null);
  };

  const openCreateModal = () => {
    setEditing(null);
    setSelectedFeature(null);
    setModalState('form');
  };

  const openEditModal = (feature: Feature) => {
    if (feature.status === 'Completed') {
      toast.info('Completed features are view only.');
      return;
    }

    setEditing(feature);
    setSelectedFeature(null);
    setModalState('form');
  };

  const openViewModal = (feature: Feature) => {
    setSelectedFeature(feature);
    setEditing(null);
    setModalState('view');
  };

  const openMoveModal = (feature: Feature) => {
    const allowedStatuses = getAvailableStatuses(feature.status);

    if (allowedStatuses.length === 0) {
      toast.info('This feature can only be viewed.');
      return;
    }

    setSelectedFeature(feature);
    setMoveStatus(allowedStatuses[0]);
    setEditing(null);
    setModalState('move');
  };

  const handleDelete = async (feature: Feature) => {
    if (feature.status !== 'Open') {
      toast.warning('Only open features can be deleted.');
      return;
    }

    setFeaturePendingDelete(feature);
    setModalState('delete');
  };

  const confirmDelete = async () => {
    if (!featurePendingDelete) {
      return;
    }

    try {
      await API.delete(`/${featurePendingDelete.id}`);
      toast.success('Feature request removed.');
      await fetchFeatures();
      closeModal();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to delete this feature request.'));
    }
  };

  const handleMove = async () => {
    if (!selectedFeature || !moveStatus) {
      toast.warning('Please choose a status to continue.');
      return;
    }

    const allowedStatuses = getAvailableStatuses(selectedFeature.status);

    if (!allowedStatuses.includes(moveStatus)) {
      toast.warning('That status change is not allowed for this feature.');
      return;
    }

    try {
      setIsMoving(true);
      await API.patch(`/${selectedFeature.id}/status`, { status: moveStatus });
      toast.success(`Feature moved to ${moveStatus}.`);
      await fetchFeatures();
      closeModal();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to update the feature status.'));
    } finally {
      setIsMoving(false);
    }
  };

  const availableStatuses = selectedFeature ? getAvailableStatuses(selectedFeature.status) : [];

  return (
    <>
      <div className="app-shell">
        <section className="hero-card app-header">
          <div className="hero-copy">
            <h1>Feature Requests</h1>
            <p className="hero-text">
              Manage feature requests you already have in your workflow and open any row to review
              the details.
            </p>
          </div>

          <div className="header-actions">
            <button
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="theme-toggle"
              onClick={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))}
              type="button"
            >
              <span className="theme-toggle-icon" aria-hidden="true">
                {theme === 'light' ? 'Dark' : 'Light'}
              </span>
            </button>
            <button className="primary-button add-button" onClick={openCreateModal} type="button">
              Add Feature
            </button>
          </div>
        </section>

        <section className="panel controls-panel">
          <div className="toolbar">
            <Filter setStatus={setStatus} />
          </div>

          <div className="hero-stats compact-stats">
            <article className="stat-card">
              <span className="stat-label">Open</span>
              <strong>{summary.openCount}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-label">In Progress</span>
              <strong>{summary.inProgressCount}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-label">Completed</span>
              <strong>{summary.doneCount}</strong>
            </article>
          </div>
        </section>

        <section className="panel panel-list">
          <div className="panel-heading panel-heading-stack">
            <div>
              <span className="panel-kicker">Requests</span>
              <h2>Feature request list</h2>
            </div>
          </div>

          <FeatureList
            features={features}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={openEditModal}
            onMove={openMoveModal}
            onView={openViewModal}
          />
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </section>
      </div>

      {modalState ? (
        <div className="modal-backdrop" onClick={closeModal} role="presentation">
          <div
            aria-modal="true"
            className="modal-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            {modalState === 'form' ? (
              <>
                <div className="modal-header">
                  <div>
                    <span className="panel-kicker">{editing ? 'Edit feature' : 'New feature'}</span>
                    <h2>{editing ? 'Update feature request' : 'Add feature request'}</h2>
                  </div>
                  <button className="ghost-button" onClick={closeModal} type="button">
                    Close
                  </button>
                </div>

                <FeatureForm
                  key={editing?.id ?? 'new'}
                  fetchFeatures={fetchFeatures}
                  editing={editing}
                  onClose={closeModal}
                  setEditing={setEditing}
                />
              </>
            ) : null}

            {modalState === 'view' && selectedFeature ? (
              <>
                <div className="modal-header">
                  <div>
                    <span className="panel-kicker">Feature details</span>
                    <h2>{selectedFeature.title}</h2>
                  </div>
                  <button className="ghost-button" onClick={closeModal} type="button">
                    Close
                  </button>
                </div>

                <div className="view-grid">
                  <div className="view-item">
                    <span>Description</span>
                    <p>{selectedFeature.description}</p>
                  </div>
                  <div className="view-split">
                    <div className="view-item">
                      <span>Priority</span>
                      <p>{selectedFeature.priority}</p>
                    </div>
                    <div className="view-item">
                      <span>Status</span>
                      <p>{selectedFeature.status}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {modalState === 'delete' && featurePendingDelete ? (
              <>
                <div className="delete-modal">
                  <div className="delete-warning-icon" aria-hidden="true">
                    !
                  </div>
                  <h2>Are you sure?</h2>
                  <p className="delete-copy">
                    Delete &quot;{featurePendingDelete.title}&quot;? This action cannot be undone.
                  </p>
                </div>

                <div className="delete-actions">
                  <button className="danger-button delete-confirm" onClick={confirmDelete} type="button">
                    Yes, proceed!
                  </button>
                  <button className="secondary-button delete-cancel" onClick={closeModal} type="button">
                    Cancel
                  </button>
                </div>
              </>
            ) : null}

            {modalState === 'move' && selectedFeature ? (
              <>
                <div className="modal-header">
                  <div>
                    <span className="panel-kicker">Move feature</span>
                    <h2>{selectedFeature.title}</h2>
                  </div>
                  <button className="ghost-button" onClick={closeModal} type="button">
                    Close
                  </button>
                </div>

                <div className="view-grid">
                  <div className="view-item">
                    <span>Current status</span>
                    <p>{selectedFeature.status}</p>
                  </div>

                  <label className="field">
                    <span>Move to status</span>
                    <select
                      className="text-input"
                      onChange={(e) => setMoveStatus(e.target.value as FeatureStatus)}
                      value={moveStatus}
                    >
                      {availableStatuses.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="modal-actions">
                  <button className="ghost-button" onClick={closeModal} type="button">
                    Cancel
                  </button>
                  <button
                    className="primary-button"
                    disabled={isMoving}
                    onClick={handleMove}
                    type="button"
                  >
                    {isMoving ? 'Moving...' : 'Confirm Move'}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <ToastContainer
        position="top-right"
        autoClose={3200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={theme === 'light' ? 'colored' : 'dark'}
      />
    </>
  );
}

export default App;
