import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import HeroSection from "./components/Home/HeroSection";
import HowItWorks from "./components/Home/HowItWorks";
import Categories from "./components/Home/Categories";
import CTASection from "./components/Home/CTASection";
import FeaturedJobs from "./components/Home/FeaturedJobs.jsx";

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
