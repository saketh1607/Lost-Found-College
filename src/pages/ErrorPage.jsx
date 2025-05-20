import Navbar from '../components/Navbar';

const ErrorPage = () => (
  <div className="min-h-screen w-screen bg-gray-100 flex flex-col">
    <Navbar />
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-800 text-lg">
          This website is only for <span className="font-semibold">@vnrvjiet.in</span> users.
        </p>
      </div>
    </div>
  </div>
);

export default ErrorPage; 