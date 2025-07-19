"use client";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect, useRef } from 'react';
import Modal from '../components/Modal';

const DEPT_MAP = {
  ALL: '',
  CSE: 'Computer Science',
  ECE: 'Electronics and Communication',
  MECH: 'Mechanical Engineering',
  SM: 'Smart Manufacturing',
};
const DEPT_KEYS = Object.keys(DEPT_MAP);

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [flashIdx, setFlashIdx] = useState(null);
  const filterRefs = useRef([]);
  const [cardLoading, setCardLoading] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Animate indicator to the active filter
    const idx = DEPT_KEYS.indexOf(selectedDept);
    const el = filterRefs.current[idx];
    if (el) {
      setIndicatorStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [selectedDept]);

  // Remove flash after 180ms
  useEffect(() => {
    if (flashIdx !== null) {
      const timeout = setTimeout(() => setFlashIdx(null), 180);
      return () => clearTimeout(timeout);
    }
  }, [flashIdx]);

  useEffect(() => {
    fetch('/api/faculty')
      .then(res => res.json())
      .then(data => setFacultyList(data));
  }, []);

  const handleFilterClick = idx => {
    setSelectedDept(DEPT_KEYS[idx]);
    setFlashIdx(idx);
  };

  const filteredCourses = courses.filter(course => {
    const matchesDept = selectedDept === 'ALL' ? true : course.department === DEPT_MAP[selectedDept];
    const matchesSearch =
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  async function handleCardClick(course) {
    setCardLoading(course.code);
    try {
      const res = await fetch(`/api/courses/${course.code}`);
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
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-4 mt-4">Courses</h1>
        {/* Search Bar */}
        <div className="w-full max-w-2xl flex items-center mb-4 px-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base shadow-md bg-white/90 placeholder-gray-400 transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
            </span>
          </div>
        </div>
        {/* Department Filter Buttons with flash only */}
        <div className="relative flex gap-3 mb-8 w-full max-w-2xl justify-center">
          {DEPT_KEYS.map((key, idx) => (
            <div key={key} className="relative">
              {/* Golden flash effect */}
              {flashIdx === idx && (
                <span className="absolute inset-0 z-0 rounded-full bg-yellow-400/90 animate-zzpzzp" />
              )}
              <button
                ref={el => (filterRefs.current[idx] = el)}
                className={
                  `relative z-10 px-6 py-2 rounded-full font-semibold border transition-all duration-200 text-base shadow-sm bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 cursor-pointer ` +
                  (selectedDept === key
                    ? 'scale-110 bg-gradient-to-br from-yellow-300 to-yellow-400 text-yellow-900 border-yellow-500 shadow-lg ring-2 ring-yellow-200 animate-[pulse_0.25s]'
                    : 'hover:scale-105 hover:shadow-md hover:from-yellow-200 hover:to-yellow-300 text-yellow-800')
                }
                onClick={() => handleFilterClick(idx)}
              >
                {key === 'ALL' ? 'All' : key}
              </button>
              {/* Flash animation keyframes */}
              <style jsx>{`
                .animate-zzpzzp {
                  animation: zzpzzp 0.18s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes zzpzzp {
                  0% { opacity: 0; transform: scale(0.7); }
                  30% { opacity: 1; transform: scale(1.1); }
                  70% { opacity: 1; transform: scale(1); }
                  100% { opacity: 0; transform: scale(1); }
                }
              `}</style>
            </div>
          ))}
        </div>
        <div className="w-full max-w-7xl grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2">
          {loading && (
            <div className="col-span-full text-center text-white text-lg opacity-70">Loading...</div>
          )}
          {!loading && filteredCourses.length === 0 && (
            <div className="col-span-full text-center text-white text-lg opacity-70">No courses found.</div>
          )}
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className={
                "bg-white/90 rounded-xl shadow-lg p-4 px-2 border-2 border-yellow-400 flex flex-col items-center justify-around h-[240px] w-75 mx-auto transition-all duration-200 cursor-default hover:cursor-pointer hover:-translate-y-2 hover:shadow-[0_0_24px_4px_rgba(255,215,0,0.5)] hover:border-yellow-500 hover-shadow-pulse-gold" +
                (cardLoading === course.code ? ' opacity-60 pointer-events-none' : '')
              }
              onClick={() => handleCardClick(course)}
            >
              <div className="flex flex-col items-center justify-around">
                <h2 className="text-base font-semibold text-purple-900 mb-1">{course.name}</h2>
                <p className="text-gray-700 text-xs mb-2 line-clamp-3 text-center">{course.description}</p>
                <div className="text-xs text-gray-500 mb-1">Department: {course.department}</div>
              </div>
              {cardLoading === course.code && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="bg-yellow-200 text-yellow-900 px-4 py-1 rounded-full shadow">Loading...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
      <Modal open={!!modalData} onClose={closeModal}>
        {modalData && (
          <div className="flex flex-col items-center w-full max-w-2xl min-w-[350px]">
            <h2 className="text-3xl font-bold text-purple-900 mb-2 text-center">{modalData.name}</h2>
            <div className="text-base text-gray-700 mb-4 text-center">{modalData.description}</div>
            <div className="grid grid-cols-2 gap-2 w-full mb-4">
              <div className="text-xs text-gray-500">Course ID:</div>
              <div className="text-xs text-gray-900">{modalData.id}</div>
              <div className="text-xs text-gray-500">Code:</div>
              <div className="text-xs text-gray-900">{modalData.code}</div>
              <div className="text-xs text-gray-500">Department:</div>
              <div className="text-xs text-gray-900">{modalData.department}</div>
              <div className="text-xs text-gray-500">Credits:</div>
              <div className="text-xs text-gray-900">{modalData.credits}</div>
              <div className="text-xs text-gray-500">Prerequisites:</div>
              <div className="text-xs text-gray-900">{modalData.prerequisites && modalData.prerequisites.length > 0 ? modalData.prerequisites.join(', ') : 'None'}</div>
            </div>
            {/* Faculty Info */}
            {facultyList.length > 0 && (
              <div className="w-full bg-yellow-50 rounded-xl p-4 mt-2">
                <div className="text-lg font-semibold text-yellow-900 mb-1">Faculty</div>
                {(() => {
                  const fac = facultyList.find(f => f.id === modalData.faculty_id);
                  if (!fac) return <div className="text-xs text-gray-500">Faculty not found</div>;
                  return (
                    <div>
                      <div className="font-bold text-purple-900">Dr. {fac.first_name} {fac.last_name}</div>
                      <div className="text-xs text-gray-700 mb-1">{fac.email} &mdash; {fac.department}</div>
                      <div className="text-xs text-gray-700 mb-1">Specializations: {fac.specialization.join(', ')}</div>
                      <div className="text-xs text-gray-500">Office: {fac.office_location} | Hours: {fac.office_hours}</div>
                    </div>
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