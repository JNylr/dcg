import { About } from "@/components/About";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Hero />
      <About />
      <ContactForm />
      <Footer />
    </div>
  );
}
