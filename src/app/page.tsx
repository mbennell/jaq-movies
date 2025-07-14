'use client'

import { motion } from 'framer-motion'
import SignIn from '@/components/auth/SignIn'
import Glass from '@/components/ui/Glass'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <main className="min-h-screen bg-cinema-black film-grain relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cinema-black via-cinema-dark to-cinema-black" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cinema-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cinema-blue/5 rounded-full blur-3xl" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6">
        <Glass variant="navigation" className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.h1 
            className="text-2xl font-bold text-cinema-gold font-heading"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Jaq&apos;s Best Ever Movie Guide
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SignIn />
          </motion.div>
        </Glass>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        <motion.div 
          className="text-center max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 font-heading">
              <span className="text-white">The </span>
              <span className="text-cinema-gold cinema-glow">Best Ever</span>
              <br />
              <span className="text-white">Movie Guide</span>
            </h1>
            <p className="text-xl md:text-2xl text-cinema-silver max-w-3xl mx-auto leading-relaxed">
              Your personal AI-powered cinema companion for discovering, sharing, and discussing the world&apos;s greatest films
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button size="lg" className="text-lg px-8 py-4">
              🎬 Start Discovering
            </Button>
            <Button variant="ghost" size="lg" className="text-lg px-8 py-4">
              🎤 Voice Recommendations
            </Button>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            className="absolute top-20 left-10 text-6xl opacity-20"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🎭
          </motion.div>
          <motion.div
            className="absolute top-40 right-10 text-5xl opacity-20"
            animate={{ 
              y: [0, 10, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            🍿
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-16 font-heading"
          >
            <span className="text-white">Cinema Magic</span>
            <br />
            <span className="text-cinema-gold">At Your Fingertips</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div variants={itemVariants}>
              <Card hover className="h-full p-6 text-center">
                <div className="text-4xl mb-4">🎤</div>
                <h3 className="text-xl font-semibold mb-3 text-cinema-gold">Voice Recommendations</h3>
                <p className="text-cinema-silver">
                  Simply speak your movie recommendation and let AI handle the rest
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card hover className="h-full p-6 text-center">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-3 text-cinema-gold">AI Research</h3>
                <p className="text-cinema-silver">
                  Automatic movie details, ratings, and streaming availability
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card hover className="h-full p-6 text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-3 text-cinema-gold">Social Discovery</h3>
                <p className="text-cinema-silver">
                  Connect with friends and discover new movies together
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card hover className="h-full p-6 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-3 text-cinema-gold">Smart Curation</h3>
                <p className="text-cinema-silver">
                  Find movies based on mood, genre, and personal preferences
                </p>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 relative">
        <Glass className="max-w-4xl mx-auto text-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-heading">
              Ready to discover your next favorite film?
            </h2>
            <p className="text-xl text-cinema-silver mb-8">
              Join the ultimate movie community and never run out of great films to watch
            </p>
            <Button size="lg" className="text-lg px-12 py-4">
              Get Started Free 🎬
            </Button>
          </motion.div>
        </Glass>
      </section>
    </main>
  )
}