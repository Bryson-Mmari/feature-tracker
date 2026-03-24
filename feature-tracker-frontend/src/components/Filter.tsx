import type { Dispatch, SetStateAction } from 'react';
import type { FeatureStatus } from '../types/Feature';

interface FilterProps {
  setStatus: Dispatch<SetStateAction<FeatureStatus | ''>>;
}

function Filter({ setStatus }: FilterProps) {
  return (
    <select onChange={(e) => setStatus(e.target.value as FeatureStatus | '')}>
      <option value="">All</option>
      <option value="Open">Open</option>
      <option value="In Progress">In Progress</option>
      <option value="Completed">Completed</option>
    </select>
  );
}

export default Filter;
