"use client";

import { motion } from 'motion/react';
import { Trophy, Users, Zap, Gift, MonitorPlay, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const features = [
  {
    icon: MonitorPlay,
    title: '100 BYOC Seats',
    description: 'Bring your own computer and compete in a dedicated LAN environment',
    color: 'var(--color-primary)',
  },
  {
    icon: Trophy,
    title: 'Tournaments',
    description: 'Competitive tournaments across multiple games with cash prizes',
    color: 'var(--color-accent)',
  },
  {
    icon: ShoppingBag,
    title: 'Vendor Stalls',
    description: 'Browse the latest gaming gear, peripherals, and merchandise',
    color: 'var(--color-warning)',
  },
  {
    icon: Users,
    title: 'Weekend Event',
    description: 'Two full days of gaming, networking, and unforgettable experiences',
    color: 'var(--color-secondary)',
  },
];

export function About() {
  return (
    <div className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-white mb-4">
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              What to Expect
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            An unforgettable gaming experience with tournaments, demos, and a vibrant community atmosphere
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="p-6 rounded-xl bg-gray-900/50 backdrop-blur border border-gray-800 hover:border-[var(--color-primary)] transition-all duration-300 h-full">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: `${feature.color}20`,
                    boxShadow: `0 0 20px ${feature.color}30`,
                  }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl blur-xl opacity-20"></div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1759701547467-a54a5e86a4f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwdG91cm5hbWVudCUyMGFyZW5hfGVufDF8fHx8MTc2NTgxNzAzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Gaming Arena"
              className="relative rounded-2xl border border-[var(--color-primary)]/30 w-full"
            />
          </div>

          <div>
            <h2 className="text-white mb-6">
              The Ultimate Gaming
              <br />
              <span className="text-glow text-[var(--color-primary)]">Experience</span>
            </h2>
            <p className="text-gray-300 mb-6">
              Bring your own gaming rig and join 100 players for an epic weekend LAN party.
              Compete in tournaments, explore vendor stalls for the latest gear, and immerse
              yourself in two full days of non-stop gaming action.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2 neon-glow"></div>
                <div>
                  <p className="text-white">BYOC LAN Environment</p>
                  <p className="text-gray-400">100 dedicated seats with high-speed networking</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] mt-2 neon-glow-cyan"></div>
                <div>
                  <p className="text-white">Multi-Game Tournaments</p>
                  <p className="text-gray-400">Compete across various titles for prizes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--color-secondary)] mt-2 neon-glow-pink"></div>
                <div>
                  <p className="text-white">Vendor Exhibition</p>
                  <p className="text-gray-400">Shop the latest gaming gear and tech</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}