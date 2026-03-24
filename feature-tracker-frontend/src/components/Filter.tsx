import type { Dispatch, SetStateAction } from 'react';
import type { FeatureStatus } from '../types/Feature';

interface FilterProps {
  setStatus: Dispatch<SetStateAction<FeatureStatus | ''>>;
}

function Filter({ setStatus }: FilterProps) {
  return (
    <label className="filter-control">
      <span>Status filter</span>
      <select className="text-input" onChange={(e) => setStatus(e.target.value as FeatureStatus | '')}>
        <option value="">All requests</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </label>
  );
}

export default Filter;
