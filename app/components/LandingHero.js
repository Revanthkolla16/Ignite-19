import React from 'react';
import Link from 'next/link';

const buttonBase =
  'px-6 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden focus:outline-none';
const browseCoursesBtn =
  `${buttonBase} bg-yellow-50 text-purple-900 shadow-[0_0_16px_2px_rgba(220,220,255,0.7)] hover-shadow-pulse hover:scale-105`;
const meetFacultyBtn =
  `${buttonBase} bg-white border border-yellow-400 text-yellow-700 shadow-[0_0_16px_2px_rgba(255,215,0,0.5)] hover-shadow-pulse-gold hover:scale-105`;

const LandingHero = () => (
  <section className="h-full w-full flex-1 flex flex-col items-center justify-center">
    <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300 mb-4 text-center">
      Welcome to Wakanda University Portal
    </h1>
    <p className="text-lg md:text-xl text-white mb-8 text-center max-w-2xl">
      Explore our comprehensive course catalog and meet our distinguished faculty. Ignite your learning journey with us!
    </p>
    <div className="flex gap-4">
      <Link href="/courses" className={browseCoursesBtn}>
        <span className="relative z-10">Browse Courses</span>
      </Link>
      <Link href="/faculty" className={meetFacultyBtn}>
        <span className="relative z-10">Meet Faculty</span>
      </Link>
    </div>
  </section>
);

export default LandingHero; 