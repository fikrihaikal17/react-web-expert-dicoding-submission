import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginPage from '../LoginPage';
import { asyncLoginUser } from '../../states/thunks';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('../../hooks/useI18n', () => jest.fn(() => ({
  t: (key) => {
    const dictionary = {
      'auth.emailPlaceholder': 'Email',
      'auth.passwordPlaceholder': 'Password',
      'auth.loginButton': 'Login',
      'auth.loginTitle': 'Login',
      'auth.noAccount': 'No account?',
      'auth.registerHere': 'Register here',
      'auth.loginTitlePage': 'Login - Dicoding Forum App',
    };

    return dictionary[key] || key;
  },
})));

jest.mock('../../states/thunks', () => ({
  asyncLoginUser: jest.fn(),
}));

/**
 * Skenario test:
 * - should render login form fields and submit button.
 * - should dispatch asyncLoginUser and navigate to home when login success.
 */

describe('LoginPage component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => selector({ authUser: null }));
  });

  it('should render login form elements', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('should dispatch login thunk and navigate on success', async () => {
    const user = userEvent.setup();

    asyncLoginUser.mockReturnValue({ type: 'LOGIN_THUNK' });
    mockDispatch.mockResolvedValue(true);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByPlaceholderText('Email'), 'user@test.com');
    await user.type(screen.getByPlaceholderText('Password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(asyncLoginUser).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: 'secret123',
    });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGIN_THUNK' });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
