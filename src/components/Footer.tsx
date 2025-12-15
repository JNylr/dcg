import { Gamepad2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-gray-800 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="w-6 h-6 text-[var(--color-primary)]" />
            <span className="text-white">Doncaster Gaming Event</span>
          </div>
          <p className="text-gray-400">
            The ultimate gaming experience coming to Doncaster. Join us for an unforgettable event.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; 2025 Doncaster Gaming Event. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
