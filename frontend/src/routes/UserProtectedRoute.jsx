import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { tokenRefresh } from '../store/middlewares/user/user_auth'
import { useDispatch, useSelector } from 'react-redux'
function UserProtectedRoute({ element }) {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(state => state.user)
  useEffect(() => {
    dispatch(tokenRefresh())
  }, [dispatch, isAuthenticated])

  if (user?.isBlock) {
    return <Navigate to='/login' />
  }
  if (!isAuthenticated) {
    return <Navigate to='/login' />
  }
  return element
}

export default UserProtectedRoute
