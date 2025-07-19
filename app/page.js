import Header from './components/Header';
import LandingHero from './components/LandingHero';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen h-screen flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-700">
      <Header />
      <div className="flex-1 flex flex-col justify-center">
        <LandingHero />
      </div>
      <Footer />
    </div>
  );
}
