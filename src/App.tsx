import { Hero } from './components/Hero';
import { About } from './components/About';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Hero />
      <About />
      <ContactForm />
      <Footer />
    </div>
  );
}
