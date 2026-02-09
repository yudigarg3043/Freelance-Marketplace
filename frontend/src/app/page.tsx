import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import HeroSection from "./components/dashboard/HeroSection";
import HowItWorks from "./components/dashboard/HowItWorks";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Footer />
    </div>
  );
}
