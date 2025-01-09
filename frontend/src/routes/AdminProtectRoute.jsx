import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


const AdminProtectedRoute = ({ children }) => {

  const adminIsisAuthenticated = useSelector((state) => state.admin.isAuthenticated)


  if (!adminIsisAuthenticated) {
    return <Navigate to="/admin/login" />;
  }


  return children;
};
export default AdminProtectedRoute;