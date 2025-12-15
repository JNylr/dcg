import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, User, Mail, MessageSquare, Gamepad2 } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gamingInterests: '',
    experience: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        gamingInterests: '',
        experience: '',
        message: '',
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div id="register" className="relative py-24 px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,159,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,217,255,0.05),transparent_50%)]"></div>

      <div className="relative max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-white mb-4">
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Register Your Interest
            </span>
          </h2>
          <p className="text-gray-400">
            Be the first to know when tickets go on sale and receive exclusive updates
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl blur-xl opacity-10"></div>
          
          <form
            onSubmit={handleSubmit}
            className="relative bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-8 space-y-6"
          >
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-white mb-2">
                <User className="w-4 h-4 text-[var(--color-primary)]" />
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-white mb-2">
                <Mail className="w-4 h-4 text-[var(--color-accent)]" />
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="flex items-center gap-2 text-white mb-2">
                <MessageSquare className="w-4 h-4 text-[var(--color-secondary)]" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-colors"
                placeholder="+44 1234 567890"
              />
            </div>

            {/* Gaming Interests */}
            <div>
              <label htmlFor="gamingInterests" className="flex items-center gap-2 text-white mb-2">
                <Gamepad2 className="w-4 h-4 text-[var(--color-warning)]" />
                Gaming Interests
              </label>
              <input
                type="text"
                id="gamingInterests"
                name="gamingInterests"
                value={formData.gamingInterests}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-warning)] focus:ring-1 focus:ring-[var(--color-warning)] transition-colors"
                placeholder="e.g., FPS, MOBA, Racing, Fighting"
              />
            </div>

            {/* Experience Level */}
            <div>
              <label htmlFor="experience" className="block text-white mb-2">
                Gaming Experience Level
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
              >
                <option value="">Select your level</option>
                <option value="casual">Casual Gamer</option>
                <option value="intermediate">Intermediate</option>
                <option value="competitive">Competitive</option>
                <option value="professional">Professional/Semi-Pro</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-white mb-2">
                Additional Comments
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors resize-none"
                placeholder="Tell us what you're most excited about..."
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submitted}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                submitted
                  ? 'bg-green-600 text-white'
                  : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-gray-950 hover:shadow-[0_0_30px_rgba(0,255,159,0.5)]'
              }`}
            >
              {submitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Registration Received!
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Registration
                </>
              )}
            </motion.button>

            <p className="text-gray-500 text-center text-sm">
              * Required fields. We respect your privacy and won't share your information.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
