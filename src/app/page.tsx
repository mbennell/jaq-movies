'use client'

import { motion } from 'framer-motion'
import { Button, Card, CardBody, Navbar, NavbarBrand, NavbarContent, NavbarItem, Chip } from '@heroui/react'

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/90 to-background" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
      
      {/* Film Grain Effect */}
      <div className="fixed inset-0 opacity-20 pointer-events-none film-grain" />
      
      {/* Navigation */}
      <Navbar className="backdrop-blur-md bg-background/40" maxWidth="full">
        <NavbarBrand>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-primary cinema-glow">
              🎬 Jaq's Best Ever Movie Guide
            </h1>
          </motion.div>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button color="primary" variant="ghost">
                Start Exploring
              </Button>
            </motion.div>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        <motion.div 
          className="text-center max-w-6xl mx-auto z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="text-foreground">The </span>
              <span className="text-primary cinema-glow">Best Ever</span>
              <br />
              <span className="text-foreground">Movie Guide</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-foreground/80">
              Your personal AI-powered cinema companion for discovering, sharing, and discussing the world's greatest films
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button 
              size="lg" 
              color="primary"
              className="text-lg px-8 py-4 font-semibold"
            >
              🎬 Start Discovering
            </Button>
            <Button 
              size="lg" 
              color="success"
              variant="bordered"
              className="text-lg px-8 py-4 font-semibold"
            >
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
      <section className="py-24 px-6 relative z-10">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            <span className="text-foreground">Cinema Magic</span>
            <br />
            <span className="text-primary">At Your Fingertips</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="h-full bg-background/40 backdrop-blur-md border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardBody className="text-center p-6">
                  <div className="text-4xl mb-4">🎤</div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">Voice Recommendations</h3>
                  <p className="text-foreground/70">
                    Simply speak your movie recommendation and let AI handle the rest
                  </p>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full bg-background/40 backdrop-blur-md border-success/20 hover:border-success/40 transition-all duration-300">
                <CardBody className="text-center p-6">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-xl font-semibold mb-3 text-success">AI Research</h3>
                  <p className="text-foreground/70">
                    Automatic movie details, ratings, and streaming availability
                  </p>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full bg-background/40 backdrop-blur-md border-secondary/20 hover:border-secondary/40 transition-all duration-300">
                <CardBody className="text-center p-6">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold mb-3 text-secondary">Social Discovery</h3>
                  <p className="text-foreground/70">
                    Connect with friends and discover new movies together
                  </p>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full bg-background/40 backdrop-blur-md border-warning/20 hover:border-warning/40 transition-all duration-300">
                <CardBody className="text-center p-6">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-3 text-warning">Smart Curation</h3>
                  <p className="text-foreground/70">
                    Find movies based on mood, genre, and personal preferences
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 relative z-10">
        <Card className="max-w-4xl mx-auto bg-background/60 backdrop-blur-md border-primary/30">
          <CardBody className="text-center p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Ready to discover your next favorite film?
              </h2>
              <p className="text-xl mb-8 text-foreground/80">
                Join the ultimate movie community and never run out of great films to watch
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  color="primary"
                  className="text-lg px-12 py-4 font-semibold"
                >
                  Get Started Free 🎬
                </Button>
                <Chip 
                  color="success"
                  variant="flat"
                  className="text-sm px-4 py-2"
                >
                  No account required
                </Chip>
              </div>
            </motion.div>
          </CardBody>
        </Card>
      </section>
    </div>
  )
}