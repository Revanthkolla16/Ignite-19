import React from 'react';
import Link from 'next/link';

const navLinkClass =
  'hover:text-yellow-300 text-white transition-all duration-200 ease-out inline-block transform hover:-translate-y-1 hover:scale-105';

const Header = () => (
  <header className="w-full flex items-center justify-between py-4 px-8 bg-transparent">
    <div className="text-2xl font-bold text-yellow-400">Wakanda University Portal</div>
    <nav className="space-x-6">
      <Link href="/" className={navLinkClass}>Home</Link>
      <Link href="/courses" className={navLinkClass}>Courses</Link>
      <Link href="/faculty" className={navLinkClass}>Faculty</Link>
    </nav>
  </header>
);

export default Header; 