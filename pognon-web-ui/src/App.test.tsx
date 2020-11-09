import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders homepage', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Welcome to pognon_ts!/i);
  expect(linkElement).toBeInTheDocument();
});
