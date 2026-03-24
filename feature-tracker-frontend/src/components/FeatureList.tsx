import type { Feature, FeatureStatus } from '../types/Feature';

interface FeatureListProps {
  features: Feature[];
  isLoading: boolean;
  onDelete: (feature: Feature) => void;
  onEdit: (feature: Feature) => void;
  onMove: (feature: Feature) => void;
  onView: (feature: Feature) => void;
}

const getStatusClassName = (status: FeatureStatus) => {
  switch (status) {
    case 'Completed':
      return 'badge badge-success';
    case 'In Progress':
      return 'badge badge-info';
    default:
      return 'badge badge-warning';
  }
};

const getPriorityClassName = (priority: Feature['priority']) => {
  switch (priority) {
    case 'High':
      return 'badge badge-danger';
    case 'Medium':
      return 'badge badge-info';
    default:
      return 'badge badge-neutral';
  }
};

function FeatureList({ features, isLoading, onDelete, onEdit, onMove, onView }: FeatureListProps) {
  if (isLoading) {
    return <div className="empty-state">Loading feature requests...</div>;
  }

  if (features.length === 0) {
    return (
      <div className="empty-state">
        No feature requests match this filter yet. Try adding one or changing the selected status.
      </div>
    );
  }

  return (
    <div className="feature-table">
      <div className="feature-table-head">
        <span>S/No.</span>
        <span>Title</span>
        <span>Priority</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      {features.map((feature, index) => {
        const canDelete = feature.status === 'Open';
        const canMove = feature.status !== 'Completed';
        const canEdit = feature.status !== 'Completed';

        return (
          <div
            className="feature-table-row"
            key={feature.id}
            onClick={() => onView(feature)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onView(feature);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span className="feature-cell" data-label="S/No.">
              {index + 1}
            </span>

            <span className="feature-cell feature-title-cell" data-label="Title">
              <strong>{feature.title}</strong>
            </span>

            <span className="feature-cell" data-label="Priority">
              <span className={getPriorityClassName(feature.priority)}>{feature.priority}</span>
            </span>

            <span className="feature-cell" data-label="Status">
              <span className={getStatusClassName(feature.status)}>{feature.status}</span>
            </span>

            <span className="feature-cell feature-actions-cell" data-label="Actions">
              <span className="action-row">
                {canEdit ? (
                  <button
                    aria-label="Edit feature"
                    className="icon-button icon-button-edit"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(feature);
                    }}
                    title="Edit"
                    type="button"
                  >
                    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                      <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                      <path d="m12 6 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                    </svg>
                  </button>
                ) : null}

                {canDelete ? (
                  <button
                    aria-label="Delete feature"
                    className="icon-button icon-button-delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(feature);
                    }}
                    title="Delete"
                    type="button"
                  >
                    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                      <path d="M5 7h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                      <path d="M10 11v5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                      <path d="M14 11v5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                      <path d="M7 7l1 12h8l1-12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                      <path d="M9 7V4h6v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                    </svg>
                  </button>
                ) : null}

                {canMove ? (
                  <button
                    aria-label="Move feature status"
                    className="icon-button icon-button-move"
                    onClick={(event) => {
                      event.stopPropagation();
                      onMove(feature);
                    }}
                    title="Move To"
                    type="button"
                  >
                    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                      <path d="M7 7h10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                      <path d="m13 3 4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                      <path d="M17 17H7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                      <path d="M7 13h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                    </svg>
                  </button>
                ) : (
                  <span className="table-note">View only</span>
                )}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default FeatureList;
