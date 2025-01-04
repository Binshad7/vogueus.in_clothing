import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { tokenRefresh } from '../store/middlewares/user/user_auth'
import { useDispatch } from 'react-redux'
function UserProtectedRoute({element}) {
  const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem('isAuthenticated')||null)
  useEffect(() => {
    console.log('user protected route render');
    dispatch(tokenRefresh())
  }, [dispatch]) 
   
  return  user? element : <Navigate to='/login' />
}

export default UserProtectedRoute
