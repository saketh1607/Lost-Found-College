import Navbar from './Navbar';
import ChatWindow from './ChatWindow';

const MainLayout = ({ children }) => (
  <div className="min-h-screen w-full flex flex-col bg-gray-100">
    <Navbar />
    <main className="flex-1 w-full bg-gray-100 p-4 md:p-8">
      <div className="w-full">{children}</div>
      <ChatWindow />
    </main>
  </div>
);

export default MainLayout; 