import React from 'react';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 mt-12 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Tutorly. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
