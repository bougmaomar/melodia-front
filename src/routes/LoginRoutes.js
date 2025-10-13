import { lazy } from 'react';

// project-imports
import GuestGuard from 'utils/route-guard/GuestGuard';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/auth/auth1/login')));
const AuthArtistRegister = Loadable(lazy(() => import('pages/auth/auth1/artist-register')));
const AuthAgentRegister = Loadable(lazy(() => import('pages/auth/auth1/agent-register')));
const AuthStationRegister = Loadable(lazy(() => import('pages/auth/auth1/station-register')));
// const AuthRegister = Loadable(lazy(() => import('pages/auth/auth1/register')));
const AuthRegisterRole = Loadable(lazy(() => import('pages/auth/auth1/register-role')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/auth1/forgot-password')));
const AuthCheckMail = Loadable(lazy(() => import('pages/auth/auth1/check-mail')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/auth1/reset-password')));
const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/auth1/code-verification')));

// ==============================|| AUTH ROUTES ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <GuestGuard>
          <CommonLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: '/',
          element: <AuthLogin />
        },
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'artist/register',
          element: <AuthArtistRegister />
        },
        {
          path: 'agent/register',
          element: <AuthAgentRegister />
        },
        {
          path: 'station/register',
          element: <AuthStationRegister />
        },
        {
          path: 'register-roles',
          element: <AuthRegisterRole />
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />
        },
        {
          path: 'check-mail',
          element: <AuthCheckMail />
        },
        {
          path: 'reset-password',
          element: <AuthResetPassword />
        },
        {
          path: 'code-verification',
          element: <AuthCodeVerification />
        }
      ]
    }
  ]
};

export default LoginRoutes;
