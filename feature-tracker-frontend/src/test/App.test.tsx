import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import App from '../App.tsx';
import API from '../services/api.ts';
import type { Feature } from '../types/Feature.ts';

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
}));

vi.mock('../services/api.ts', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: toastMocks,
}));

type MockedApi = Record<'get' | 'post' | 'put' | 'patch' | 'delete', Mock>;

const mockedApi = API as unknown as MockedApi;

const createFeature = (overrides: Partial<Feature> = {}): Feature => ({
  id: 1,
  title: 'Feature alpha',
  description: 'Detailed feature summary',
  priority: 'Medium',
  status: 'Open',
  created_at: '2026-03-24T10:00:00.000Z',
  ...overrides,
});

const featureResponse = (features: Feature[], totalPages = 1) => ({
  data: {
    data: features,
    totalPages,
  },
});

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads features and opens the view modal when a row is clicked', async () => {
    mockedApi.get.mockResolvedValueOnce(
      featureResponse([
        createFeature(),
        createFeature({ id: 2, title: 'Done item', status: 'Completed' }),
      ])
    );

    render(<App />);

    expect(await screen.findByText('Feature alpha')).toBeInTheDocument();
    expect(mockedApi.get).toHaveBeenCalledWith('?page=1&limit=5');

    await userEvent.click(screen.getByRole('button', { name: /Feature alpha/i }));

    expect(await screen.findByText('Feature details')).toBeInTheDocument();
    expect(screen.getByText('Detailed feature summary')).toBeInTheDocument();
  });

  it('creates a feature from the add modal and refreshes the list', async () => {
    mockedApi.get
      .mockResolvedValueOnce(featureResponse([]))
      .mockResolvedValueOnce(featureResponse([createFeature({ title: 'Fresh request' })]));
    mockedApi.post.mockResolvedValueOnce({ data: { message: 'created' } });

    render(<App />);

    await screen.findByText('Feature request list');
    await userEvent.click(screen.getByRole('button', { name: 'Add Feature' }));
    await userEvent.type(screen.getByPlaceholderText('For example: Add team voting'), 'Fresh request');
    await userEvent.type(
      screen.getByPlaceholderText('Describe the user problem, expected impact, or rough acceptance criteria.'),
      'Users need a cleaner way to submit feedback.'
    );
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Priority' }), 'High');
    await userEvent.click(screen.getByRole('button', { name: 'Create Request' }));

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith('/', {
        title: 'Fresh request',
        description: 'Users need a cleaner way to submit feedback.',
        priority: 'High',
        status: 'Open',
      });
    });

    expect(toastMocks.success).toHaveBeenCalledWith('Feature request created successfully.');
  });

  it('shows a confirmation modal before deleting and deletes only after confirmation', async () => {
    mockedApi.get
      .mockResolvedValueOnce(featureResponse([createFeature()]))
      .mockResolvedValueOnce(featureResponse([]));
    mockedApi.delete.mockResolvedValueOnce({ data: { message: 'deleted' } });

    render(<App />);

    expect(await screen.findByText('Feature alpha')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Delete feature' }));

    expect(await screen.findByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Delete "Feature alpha"? This action cannot be undone.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Yes, proceed!' }));

    await waitFor(() => {
      expect(mockedApi.delete).toHaveBeenCalledWith('/1');
    });
    expect(toastMocks.success).toHaveBeenCalledWith('Feature request removed.');
  });

  it('opens the move modal with only allowed statuses and submits the move', async () => {
    mockedApi.get
      .mockResolvedValueOnce(featureResponse([
        createFeature({ id: 4, title: 'In-flight task', status: 'In Progress' }),
      ]))
      .mockResolvedValueOnce(featureResponse([
        createFeature({ id: 4, title: 'In-flight task', status: 'Completed' }),
      ]));
    mockedApi.patch.mockResolvedValueOnce({ data: { message: 'updated' } });

    render(<App />);

    expect(await screen.findByText('In-flight task')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Move feature status' }));

    expect(await screen.findByText('Current status')).toBeInTheDocument();
    const statusSelect = screen.getByRole('combobox', { name: 'Move to status' });
    expect(within(statusSelect).getByRole('option', { name: 'Completed' })).toBeInTheDocument();
    expect(within(statusSelect).queryByRole('option', { name: 'Open' })).not.toBeInTheDocument();

    await userEvent.selectOptions(statusSelect, 'Completed');
    await userEvent.click(screen.getByRole('button', { name: 'Confirm Move' }));

    await waitFor(() => {
      expect(mockedApi.patch).toHaveBeenCalledWith('/4/status', { status: 'Completed' });
    });
    expect(toastMocks.success).toHaveBeenCalledWith('Feature moved to Completed.');
  });

  it('toggles and persists the theme mode', async () => {
    mockedApi.get.mockResolvedValueOnce(featureResponse([]));

    render(<App />);

    await screen.findByText('Feature request list');
    expect(document.documentElement.dataset.theme).toBe('dark');

    await userEvent.click(screen.getByRole('button', { name: 'Switch to light mode' }));

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(window.localStorage.getItem('feature-tracker-theme')).toBe('light');
  });
});
