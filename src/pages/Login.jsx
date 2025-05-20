// import { SignIn } from '@clerk/clerk-react';
// import { useEffect, useState } from 'react';
// import { useUser } from '@clerk/clerk-react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const { user, isSignedIn } = useUser();
//   const navigate = useNavigate();
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const checkEmail = async () => {
//       if (isSignedIn && user) {
//         const email = user.primaryEmailAddress?.emailAddress || '';
//         if (email === 'saketh1607@gmail.com') {
//           navigate('/admin', { replace: true });
//           return;
//         } else if (!email.endsWith('@vnrvjiet.in')) {
//           navigate('/error', { replace: true });
//           return;
//         } else {
//           navigate('/', { replace: true });
//           return;
//         }
//       }
//       setChecking(false); // Done checking
//     };
//     checkEmail();
//   }, [isSignedIn, user, navigate]);

//   if (checking) {
//     return (
//       <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-screen h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center mx-4">
//         <img src="https://vnrvjiet.ac.in/assets/images/Header-Logo.png" alt="VNRVJIET Logo" className="w-100 h-20 mb-6" />
//         <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
//           <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
//             VNRVJIET Lost & Found
//           </span>
//         </h1>
//         <p className="mb-6 text-center text-gray-600 text-sm">
//           Sign in with your institutional{' '}
//           <span className="font-medium text-blue-600">@vnrvjiet.in</span> email
//         </p>

//         <SignIn
//           appearance={{
//             layout: {
//               socialButtonsVariant: 'blockButton',
//               socialButtonsPlacement: 'bottom'
//             },
//             elements: {
//               rootBox: 'w-full',
//               card: 'shadow-none bg-transparent w-full',
//               headerTitle: 'text-gray-800 text-lg font-semibold',
//               headerSubtitle: 'text-gray-500',
//               formFieldLabel: 'text-gray-600',
//               formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg',
//               footerActionLink: 'text-blue-600 hover:text-blue-700',
//               socialButtons: 'gap-2',
//               socialButton: 'border-gray-200 hover:bg-gray-50',
//               dividerLine: 'bg-gray-200',
//               dividerText: 'text-gray-400',
//               formHeader: 'text-center',
//               identityPreview: 'border-gray-200',
//               footer: 'hidden'
//             },
//             variables: {
//               colorPrimary: '#2563eb'
//             }
//           }}
//           routing="path"
//           path="/login"
//           signUpUrl="/signup"
//           afterSignInUrl="/"
//         />

//         <p className="mt-4 text-sm text-gray-600 text-center">
//           Don&apos;t have an account?{' '}
//           <a href="/signup" className="text-blue-600 hover:text-blue-800 font-medium underline">Sign up</a>
//         </p>

//         <p className="mt-6 text-xs text-gray-400 text-center">
//           Restricted to VNRVJIET institutional accounts only
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { SignIn } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, Navigate } from 'react-router-dom';

const Login = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const checkEmail = async () => {
      if (isSignedIn && user) {
        const email = user.primaryEmailAddress?.emailAddress || '';
        
        if (email === 'saketh1607@gmail.com') {
          setRedirectPath('/admin');
        } else if (!email.endsWith('@vnrvjiet.in')) {
          setRedirectPath('/error');
        } else {
          setRedirectPath('/');
        }
      } else {
        setChecking(false); // Only set checking to false if not signed in
      }
    };
    
    checkEmail();
  }, [isSignedIn, user, navigate]);

  // If we have a redirect path, immediately return a Navigate component
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  if (checking) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center mx-4">
        <img src="https://vnrvjiet.ac.in/assets/images/Header-Logo.png" alt="VNRVJIET Logo" className="w-100 h-20 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            VNRVJIET Lost & Found
          </span>
        </h1>
        <p className="mb-6 text-center text-gray-600 text-sm">
          Sign in with your institutional{' '}
          <span className="font-medium text-blue-600">@vnrvjiet.in</span> email
        </p>

        <SignIn
          appearance={{
            layout: {
              socialButtonsVariant: 'blockButton',
              socialButtonsPlacement: 'bottom'
            },
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none bg-transparent w-full',
              headerTitle: 'text-gray-800 text-lg font-semibold',
              headerSubtitle: 'text-gray-500',
              formFieldLabel: 'text-gray-600',
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg',
              footerActionLink: 'text-blue-600 hover:text-blue-700',
              socialButtons: 'gap-2',
              socialButton: 'border-gray-200 hover:bg-gray-50',
              dividerLine: 'bg-gray-200',
              dividerText: 'text-gray-400',
              formHeader: 'text-center',
              identityPreview: 'border-gray-200',
              footer: 'hidden'
            },
            variables: {
              colorPrimary: '#2563eb'
            }
          }}
          routing="path"
          path="/login"
          signUpUrl="/signup"
          afterSignInUrl="/"
        />

        <p className="mt-4 text-sm text-gray-600 text-center">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:text-blue-800 font-medium underline">Sign up</a>
        </p>

        <p className="mt-6 text-xs text-gray-400 text-center">
          Restricted to VNRVJIET institutional accounts only
        </p>
      </div>
    </div>
  );
};

export default Login;