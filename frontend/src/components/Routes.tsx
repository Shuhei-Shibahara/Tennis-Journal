import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Adjust the import path as necessary

interface AuthRouteProps {
  element: JSX.Element;
  path: string;
  exact?: boolean;
}

export const AuthRoute: React.FC<AuthRouteProps> = ({ element, path, exact }) => {
  const loggedIn = useSelector((state: RootState) => !!state.session.user);
  return (
    <Route
      path={path}
      element={loggedIn ? <Navigate to="/" /> : element}
    />
  );
};

export const ProtectedRoute: React.FC<AuthRouteProps> = ({ element, path, exact }) => {
  const loggedIn = useSelector((state: RootState) => !!state.session.user);
  return (
    <Route
      path={path}
      element={loggedIn ? element : <Navigate to="/login" />}
    />
  );
};