import { render, screen } from '@testing-library/react';
import App from './App';

test('affiche SmartQueue', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: /^SmartQueue$/i })).toBeInTheDocument();
});
