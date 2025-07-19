"use client";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import Modal from '../components/Modal';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [cardLoading, setCardLoading] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [coursesList, setCoursesList] = useState([]);

  useEffect(() => {
    fetch('/api/faculty')
      .then(res => res.json())
      .then(data => {
        setFaculty(data);
        setLoading(false);
      });
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCoursesList(data));
  }, []);

  const filteredFaculty = faculty.filter(faculty => {
    const name = `${faculty.first_name} ${faculty.last_name}`.toLowerCase();
    const specializations = faculty.specialization.join(' ').toLowerCase();
    return (
      name.includes(search.toLowerCase()) ||
      specializations.includes(search.toLowerCase())
    );
  });

  async function handleCardClick(faculty) {
    setCardLoading(faculty.id);
    try {
      const res = await fetch(`/api/faculty/${faculty.id}`);
      const data = await res.json();
      setModalData(data);
    } finally {
      setTimeout(() => setCardLoading(null), 400);
    }
  }

  function closeModal() {
    setModalData(null);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-700">
      <Header />
      <main className="flex-1 flex flex-col items-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-4 mt-4">Faculty</h1>
        {/* Search Bar */}
        <div className="w-full max-w-2xl flex items-center mb-8 px-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search faculty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base shadow-md bg-white/90 placeholder-gray-400 transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
            </span>
          </div>
        </div>
        <div className="w-full max-w-7xl grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2">
          {loading && (
            <div className="col-span-full text-center text-white text-lg opacity-70">Loading...</div>
          )}
          {!loading && filteredFaculty.length === 0 && (
            <div className="col-span-full text-center text-white text-lg opacity-70">No faculty found.</div>
          )}
          {filteredFaculty.map(faculty => {
            const shownSpecs = faculty.specialization.slice(0, 3);
            const moreCount = faculty.specialization.length - 3;
            return (
              <div
                key={faculty.id}
                className={
                  "bg-white/90 rounded-xl shadow-lg p-4 px-2 border-2 border-yellow-400 flex flex-col items-center justify-around h-[240px] w-75 mx-auto transition-all duration-200 cursor-default hover:cursor-pointer hover:-translate-y-2 hover:shadow-[0_0_24px_4px_rgba(255,215,0,0.5)] hover:border-yellow-500 hover-shadow-pulse-gold" +
                  (cardLoading === faculty.id ? ' opacity-60 pointer-events-none' : '')
                }
                onClick={() => handleCardClick(faculty)}
              >
                <div className="flex flex-col items-center justify-around">
                  <h2 className="text-base font-semibold text-purple-900 mb-1">
                    Dr. {faculty.first_name} {faculty.last_name}
                  </h2>
                  <span className="text-sm text-blue-700 font-medium mb-2">Assistant Professor</span>
                  <span className="text-xs font-semibold text-gray-700 mb-1">Research Interests</span>
                  <div className="flex flex-wrap justify-center gap-2 mb-1">
                    {shownSpecs.map((spec, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium border border-blue-200">
                        {spec}
                      </span>
                    ))}
                    {moreCount > 0 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium border border-gray-200">
                        +{moreCount} more
                      </span>
                    )}
                  </div>
                </div>
                {cardLoading === faculty.id && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <span className="bg-yellow-200 text-yellow-900 px-4 py-1 rounded-full shadow">Loading...</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
      <Modal open={!!modalData} onClose={closeModal}>
        {modalData && (
          <div className="flex flex-col items-center w-full max-w-2xl min-w-[350px]">
            <h2 className="text-3xl font-bold text-purple-900 mb-2 text-center">Dr. {modalData.first_name} {modalData.last_name}</h2>
            <div className="text-base text-gray-700 mb-4 text-center">{modalData.email}</div>
            <div className="grid grid-cols-2 gap-2 w-full mb-4">
              <div className="text-xs text-gray-500">Faculty ID:</div>
              <div className="text-xs text-gray-900">{modalData.id}</div>
              <div className="text-xs text-gray-500">Department:</div>
              <div className="text-xs text-gray-900">{modalData.department}</div>
              <div className="text-xs text-gray-500">Office:</div>
              <div className="text-xs text-gray-900">{modalData.office_location}</div>
              <div className="text-xs text-gray-500">Office Hours:</div>
              <div className="text-xs text-gray-900">{modalData.office_hours}</div>
              <div className="text-xs text-gray-500">Specializations:</div>
              <div className="text-xs text-gray-900">{modalData.specialization.join(', ')}</div>
            </div>
            {/* Courses Taught */}
            {coursesList.length > 0 && (
              <div className="w-full bg-yellow-50 rounded-xl p-4 mt-2">
                <div className="text-lg font-semibold text-yellow-900 mb-1">Courses Taught</div>
                {(() => {
                  const taught = coursesList.filter(c => c.faculty_id === modalData.id);
                  if (taught.length === 0) return <div className="text-xs text-gray-500">No courses found</div>;
                  return (
                    <ul className="list-disc pl-5 text-sm text-purple-900">
                      {taught.map(c => (
                        <li key={c.id}><span className="font-semibold">{c.name}</span> <span className="text-xs text-gray-500">({c.code})</span></li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
} 