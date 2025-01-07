import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { tokenRefresh } from '../store/middlewares/user/user_auth'
import { useDispatch, useSelector } from 'react-redux'
function UserProtectedRoute({element}) {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.user.isAuthenticated)
  useEffect(() => {
    console.log('user protected route render');
    dispatch(tokenRefresh())
  }, [dispatch,isAuthenticated]) 
   
  return  isAuthenticated? element : <Navigate to='/login' />
}

export default UserProtectedRoute
