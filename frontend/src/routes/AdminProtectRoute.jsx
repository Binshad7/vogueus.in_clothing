import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


const AdminProtectedRoute = ({ children }) => {

  const { isAuthenticated, admin } = useSelector((state) => state.admin)

  if (admin?.isBlock) {
    <Navigate to="/admin/login" />
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }



  return children;
};
export default AdminProtectedRoute;