import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => (
  <div className="w-screen h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center mx-4">
      <img src="https://vnrvjiet.ac.in/assets/images/Header-Logo.png" alt="VNRVJIET Logo" className="w-100 h-20 mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          VNRVJIET Lost & Found
        </span>
      </h1>
      <p className="mb-6 text-center text-gray-600 text-sm">
        Sign up with your institutional{' '}
        <span className="font-medium text-blue-600">@vnrvjiet.in</span> email
      </p>
      <SignUp
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
        path="/signup"
        signInUrl="/login"
        afterSignUpUrl="/"
      />
      <p className="mt-6 text-xs text-gray-400 text-center">
        Restricted to VNRVJIET institutional accounts only
      </p>
    </div>
  </div>
);

export default SignUpPage; 