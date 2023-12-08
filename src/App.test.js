/* eslint-disable testing-library/await-async-query */
/* eslint-disable testing-library/await-async-utils */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mockData = [
  {
    TrainId: '023',
    TrainNumber: '750',
    CarCount: 8,
    DirectionNum: 2,
    CircuitId: 2942,
    DestinationStationCode: 'J03',
    LineCode: 'BL',
    SecondsAtLocation: 7,
    ServiceType: 'Normal',
  },
  {
    TrainId: '024',
    TrainNumber: '40',
    CarCount: 2,
    DirectionNum: 2,
    CircuitId: 2942,
    DestinationStationCode: 'J03',
    LineCode: 'GR',
    SecondsAtLocation: 7,
    ServiceType: 'NoPassengers',
  },
];

const mockFetch = () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ TrainPositions: mockData }),
    })
  );
};

beforeEach(() => {
  window.matchMedia = jest.fn().mockImplementation(() => {
    return {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
  });
});

test('renders spinner when loading data', () => {
  render(<App />);

  const spinner = screen.getByTestId('loading');
  expect(spinner).toBeInTheDocument();

  // Simulate data fetching and await loading state to disappear
  mockFetch();
  waitFor(() => expect(screen.queryByTestId('loading')).toBeNull());
});

test('renders the app header', async () => {
  mockFetch();
  render(<App />);

  // Wait for data fetching and header rendering
  const header = await screen.findByText('WMATA Train Positions');
  expect(header).toBeInTheDocument();
});

test('renders train data table after data is fetched', async () => {
  mockFetch();
  render(<App />);

  // Verify table headers and cells
  await screen.findByText('Train Number');
  expect(screen.getByText('750')).toBeInTheDocument();
});

test('toggles theme correctly', async () => {
  mockFetch();
  render(<App />);

  expect(document.body).not.toHaveClass('dark-theme');
  const toggleButton = await screen.findByTestId('toggle-icon');

  // Verify dark theme applied
  await toggleButton.click();
  expect(document.body).toHaveClass('dark-theme');
});

test('filters train data based on service selection', async () => {
  mockFetch();
  render(<App />);
  waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
  const select = await screen.findByRole('combobox', { name: 'Service Type' });
  expect(select).toBeInTheDocument();
  await userEvent.selectOptions(select, 'Normal');

  // Verify only filtered trains are displayed
  expect(screen.getByRole('option', { name: 'Normal' }).selected).toBe(true);
  const secondOption = screen.getByRole('option', { name: 'No Passengers' });
  expect(screen.getByText('No Passengers')).toBeInTheDocument(1); // Only as option in select, not in table
});
