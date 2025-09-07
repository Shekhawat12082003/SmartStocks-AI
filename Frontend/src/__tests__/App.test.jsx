import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

// Mock the store
jest.mock('../store/usePredictionStore', () => ({
  __esModule: true,
  default: () => ({
    latest: { predicted: 150.25, date: '2024-01-01' },
    metrics: { rmse: 5.2, mape: 2.1 },
    history: [],
    fetchLatest: jest.fn(),
    loading: false,
    error: null,
  }),
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('StockPredict')).toBeInTheDocument();
  });

  it('displays KPI cards', () => {
    render(<App />);
    expect(screen.getByText('Latest Predicted Price')).toBeInTheDocument();
    expect(screen.getByText('RMSE')).toBeInTheDocument();
    expect(screen.getByText('MAPE')).toBeInTheDocument();
  });
});
