import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import HeroSection from "./components/dashboard/HeroSection";
import HowItWorks from "./components/dashboard/HowItWorks";
import Categories from "./components/dashboard/Categories";
import CTASection from "./components/dashboard/CTASection";
import FeaturedJobs from "./components/dashboard/FeaturedJobs.jsx";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <HeroSection />
      <FeaturedJobs />
      <HowItWorks />
      <Categories />
      <CTASection />
      <Footer />
    </div>
  );
}
