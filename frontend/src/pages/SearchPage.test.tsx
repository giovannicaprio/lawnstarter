import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from './SearchPage';

describe('SearchPage', () => {
  it('renders search input and buttons', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/chewbacca/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });

  it('switches between people and movies', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByLabelText(/movies/i));
    expect(screen.getByLabelText(/movies/i)).toBeChecked();
  });
}); 