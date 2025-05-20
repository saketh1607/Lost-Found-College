import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ItemDetailsPage from './pages/ItemDetailsPage';
import { ItemsProvider } from './contexts/ItemsContext';
import { ChatProvider } from './contexts/ChatContext';
import ChatWindow from './components/ChatWindow';
import DomainProtectedRoute from './components/DomainProtectedRoute';
import ErrorPage from './pages/ErrorPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <ClerkProvider 
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      signInUrl="/login"
      signUpUrl="/signup"
    >
      <ItemsProvider>
        <ChatProvider>
          <Router>
            <Routes>
              {/* Error page route OUTSIDE the main layout */}
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              {/* Main app layout for all other routes */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen w-full flex flex-col bg-gray-100">
                    <Navbar />
                    <main className="flex-1 w-full bg-gray-100 p-4 md:p-8">
                      <div className="w-full">
                        <SignedIn>
                          <Routes>
                            <Route element={<DomainProtectedRoute />}>
                              <Route path="/" element={<Home />} />
                              <Route path="/admin" element={<Admin />} />
                              <Route path="/item/:id" element={<ItemDetailsPage />} />
                            </Route>
                          </Routes>
                        </SignedIn>
                        <SignedOut>
                          <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="*" element={<RedirectToSignIn redirectUrl="/login" />} />
                          </Routes>
                        </SignedOut>
                      </div>
                      <ChatWindow />
                    </main>
                  </div>
                }
              />
            </Routes>
          </Router>
        </ChatProvider>
      </ItemsProvider>
    </ClerkProvider>
  );
}

export default App;