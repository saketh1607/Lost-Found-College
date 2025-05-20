import { ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const ClerkProviderWithConfig = ({ children }) => {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary: 'bg-blue-500 hover:bg-blue-600',
          footerActionLink: 'text-blue-500 hover:text-blue-600',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
};

export const isAllowedEmail = (email) => {
  return email.endsWith('@vnrvjiet.in') || email === 'saketh1607@gmail.com';
}; 