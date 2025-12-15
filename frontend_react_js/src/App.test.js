import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navbar and About section heading', () => {
  render(<App />);
  const nav = screen.getByRole('navigation', { name: /main navigation/i });
  expect(nav).toBeInTheDocument();

  const aboutHeading = screen.getByRole('heading', { name: /about me/i });
  expect(aboutHeading).toBeInTheDocument();
});
