"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, QrCode, Gift, Smartphone, BarChart3, Store } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">StoreMagnet</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <span className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sign In</span>
            </Link>
            <Link href="/dashboard/">
              <Button size="sm" className="bg-white text-black hover:bg-zinc-200 font-semibold rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-medium text-zinc-300 tracking-wide uppercase">New Way to Grow</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Turn Walk-in Traffic into <br className="hidden md:block" />
              <span className="text-indigo-400">Loyal Customers</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Stop losing customers after they walk out the door. Gamify their experience with a digital spin wheel, capture their data, and keep them coming back.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
                  Start for Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="h-12 px-8 rounded-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-white/5 hover:border-zinc-500">
                  How it Works
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Social Proof (Mock) */}
      <div className="border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 py-10 flex flex-wrap justify-center gap-12 md:gap-24 text-zinc-500">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white mb-1">10x</span>
            <span className="text-sm font-medium">Faster Lead Capture</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white mb-1">85%</span>
            <span className="text-sm font-medium">Customer Engagement</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white mb-1">0s</span>
            <span className="text-sm font-medium">Setup Time</span>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Seamless, Smart.</h2>
            <p className="text-zinc-400 text-lg">Setup in minutes. No hardware required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<QrCode className="w-8 h-8 text-indigo-400" />}
              title="1. Customer Scans QR"
              description="Place a QR code on your tables or counter. Customers scan it with their phone camera to start."
            />
            <FeatureCard
              icon={<Gift className="w-8 h-8 text-pink-400" />}
              title="2. Spin to Win"
              description="They enter their name & phone number to spin the wheel for a chance to win a discount or freebie."
            />
            <FeatureCard
              icon={<Smartphone className="w-8 h-8 text-indigo-400" />}
              title="3. You Get Leads"
              description="The prize is revealed, and you instantly get their contact info for future marketing campaigns."
            />
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="py-24 px-6 bg-zinc-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for Growth</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Real-time Dashboard</h3>
                    <p className="text-zinc-400">Track every scan, spin, and lead in real-time. Know exactly who your customers are.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0">
                    <Gift className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Custom Prizes</h3>
                    <p className="text-zinc-400">Control the odds. Set up discounts, free items, or "Try Again" slots instantly.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20" />
              <div className="relative bg-zinc-950 border border-white/10 rounded-2xl p-8 aspect-square flex items-center justify-center">
                {/* Abstract UI representation */}
                <div className="w-full h-full border border-zinc-800 rounded-xl bg-zinc-900 p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/50" />
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-20 bg-indigo-500/10 rounded-lg w-full animate-pulse" />
                    <div className="h-8 bg-zinc-800 rounded-lg w-3/4" />
                    <div className="h-8 bg-zinc-800 rounded-lg w-1/2" />
                    <div className="h-32 bg-zinc-800 rounded-lg w-full mt-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-32 px-6 text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to modernize your shop?</h2>
          <p className="text-xl text-zinc-400 mb-10">Join smart business owners who are capturing leads automatically.</p>
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-10 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-lg">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-zinc-300">StoreMagnet</span>
          </div>
          <div className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} StoreMagnet. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-colors"
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}
