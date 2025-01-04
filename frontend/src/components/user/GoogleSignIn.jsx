import GoogleLogo from '../../assets/img/Google.png';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { userLoginWithGoogle, userRegisterWihtGoogle } from '../../store/middlewares/user/user_auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { use, useEffect } from 'react';

const GoogleSignIn = ({ signup }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {isAuthenticated} = useSelector(state => state.user)

  const signin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` },
        });
        console.log('Google Sign-In Data:', data);
        const userData = {
          email: data.email,
          userName: data.name,
          image: data.picture,
          googleId: data.sub,
          isVerified: data.email_verified,
        };

        if (signup === 'signup') {
          dispatch(userRegisterWihtGoogle(userData));

        } else {
          dispatch(userLoginWithGoogle(userData));

        }
      } catch (error) {
        console.error('Google Sign-In Error:', error);
        toast.error('Something went wrong while processing your Google Sign-In.');
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      toast.error('Google Sign-In failed. Please try again.');
    },
  });

  useEffect(() => {
   if(isAuthenticated){
     navigate('/')
    }
  }, [isAuthenticated]);

  return (
    <button
      onClick={signin}
      className='flex justify-center items-center border w-full rounded border-gray-600 h-[48px] hover:bg-slate-50'
    >
      <img src={GoogleLogo} alt='google-icon' />
      <p className='px-2 text-gray-500'>Continue With Google</p>
    </button>
  );
};

export default GoogleSignIn;
