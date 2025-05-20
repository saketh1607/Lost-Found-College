import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const LoginPage = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            VNRVJIET Lost & Found
          </h1>
          <p className="text-gray-600 text-sm">
            Use your institutional {' '}
            <span className="font-medium text-blue-600">@vnrvjiet.in</span> email
          </p>
        </div>

        <SignIn 
          path="/login" 
          routing="path"
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none bg-white w-full',
              header: 'hidden',
              formFieldLabel: 'text-gray-600',
              formFieldInput: 'border-gray-200 focus:border-blue-500 bg-white',
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg',
              footerActionLink: 'text-blue-600 hover:text-blue-700',
              socialButtons: 'gap-2',
              socialButton: 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700',
              dividerLine: 'bg-gray-200',
              dividerText: 'text-gray-400',
              identityPreview: 'border-gray-200 bg-white',
              footer: 'hidden',
              formHeaderTitle: 'text-gray-800',
              formHeaderSubtitle: 'text-gray-500'
            },
            variables: {
              colorPrimary: '#2563eb',
              colorText: '#4b5563',
              colorInputText: '#374151',
              colorBackground: '#ffffff',
              colorInputBackground: '#ffffff'
            }
          }}
        />

        <p className="mt-6 text-xs text-gray-400 text-center">
          Exclusive access for VNRVJIET members
        </p>
      </div>
    </div>
  );
};

export default LoginPage;