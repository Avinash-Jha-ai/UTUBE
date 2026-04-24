import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logout, fetchMe } from '../state/authSlice';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  const login = (credentials) => dispatch(loginUser(credentials));
  const register = (userData) => dispatch(registerUser(userData));
  const signout = () => dispatch(logout());

  return { user, loading, error, login, register, signout };
};
