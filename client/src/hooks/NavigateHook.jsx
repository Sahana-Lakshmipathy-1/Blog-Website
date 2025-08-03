import { useNavigate } from 'react-router-dom';

export const useNavigationHandler = () => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (typeof path === 'string') {
      navigate(path);
    } else {
      console.warn('Navigation path must be a string');
    }
  };

  return handleClick;
};
