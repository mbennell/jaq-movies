'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Button, 
  Card, 
  CardBody, 
  Input, 
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Image
} from '@heroui/react'

interface Movie {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string
  vote_average: number
  genre_ids: number[]
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [recommendation, setRecommendation] = useState('')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setSearchResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      // Fallback to mock data if API fails
      const mockResults: Movie[] = [
        {
          id: 1,
          title: "The Shawshank Redemption",
          overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
          release_date: "1994-09-23",
          poster_path: "/placeholder.jpg",
          vote_average: 9.3,
          genre_ids: [18]
        },
        {
          id: 2,
          title: "The Godfather",
          overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
          release_date: "1972-03-24",
          poster_path: "/placeholder.jpg",
          vote_average: 9.2,
          genre_ids: [80, 18]
        }
      ]
      
      setSearchResults(mockResults.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      ))
    }
  }

  const addRecommendation = (movie: Movie) => {
    setMovies(prev => [...prev, movie])
    setSelectedMovie(null)
    onClose()
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-primary mb-4">
            🎬 Movie Recommendations
          </h1>
          <p className="text-xl text-foreground/80">
            Discover and share your favorite films
          </p>
        </motion.div>

        {/* Add Movie Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-background/60 backdrop-blur-md border-primary/30">
            <CardBody className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-primary">
                Add a Movie Recommendation
              </h2>
              
              <div className="space-y-4">
                <Input
                  placeholder="Search for a movie..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    searchMovies(e.target.value)
                  }}
                  size="lg"
                  variant="bordered"
                  className="w-full"
                />
                
                {searchResults.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {searchResults.map((movie) => (
                      <Card 
                        key={movie.id}
                        className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => {
                          setSelectedMovie(movie)
                          onOpen()
                        }}
                      >
                        <CardBody className="p-4">
                          <div className="flex gap-4">
                            <div className="w-16 h-24 bg-foreground/10 rounded flex items-center justify-center">
                              📽️
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{movie.title}</h3>
                              <p className="text-sm text-foreground/70 mb-2">
                                {new Date(movie.release_date).getFullYear()}
                              </p>
                              <div className="flex items-center gap-2">
                                <Chip color="warning" size="sm">
                                  ⭐ {movie.vote_average}
                                </Chip>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Movie Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-primary">
            Recommended Movies ({movies.length})
          </h2>
          
          {movies.length === 0 ? (
            <Card className="bg-background/40 backdrop-blur-md">
              <CardBody className="text-center py-16">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-semibold mb-2">No movies yet</h3>
                <p className="text-foreground/70">
                  Start by searching and adding your first movie recommendation!
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <motion.div
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full bg-background/40 backdrop-blur-md border-primary/20 hover:border-primary/40 transition-all duration-300">
                    <CardBody className="p-4">
                      <div className="w-full h-48 bg-foreground/10 rounded mb-4 flex items-center justify-center">
                        <span className="text-4xl">📽️</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{movie.title}</h3>
                      <p className="text-sm text-foreground/70 mb-3 line-clamp-3">
                        {movie.overview}
                      </p>
                      <div className="flex items-center justify-between">
                        <Chip color="warning" size="sm">
                          ⭐ {movie.vote_average}
                        </Chip>
                        <span className="text-sm text-foreground/60">
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Add Recommendation Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Add Recommendation
            </ModalHeader>
            <ModalBody>
              {selectedMovie && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-36 bg-foreground/10 rounded flex items-center justify-center">
                      📽️
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{selectedMovie.title}</h3>
                      <p className="text-sm text-foreground/70 mb-3">
                        {selectedMovie.overview}
                      </p>
                      <div className="flex items-center gap-2">
                        <Chip color="warning" size="sm">
                          ⭐ {selectedMovie.vote_average}
                        </Chip>
                        <span className="text-sm text-foreground/60">
                          {new Date(selectedMovie.release_date).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Textarea
                    placeholder="Why do you recommend this movie? (optional)"
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    variant="bordered"
                    rows={3}
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                onClick={() => selectedMovie && addRecommendation(selectedMovie)}
              >
                Add Recommendation
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  )
}