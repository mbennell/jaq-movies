# Jaq Movie Social

A social movie recommendation platform with AI-powered features.

## Features

- 🎬 Social movie recommendations
- 🎤 Voice-to-text for quick recommendations
- 🤖 AI-powered movie research and details
- 👥 Friend connections and discovery
- 📱 Mobile-first design
- 🔍 Smart movie discovery

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Database**: PostgreSQL (Neon)
- **Authentication**: NextAuth.js with Google OAuth
- **ORM**: Prisma
- **Styling**: Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in the required values:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `NEXTAUTH_SECRET`: A random secret for NextAuth.js
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
   - `TMDB_API_KEY`: TMDB API key for movie data

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The app uses the following main models:
- **User**: User profiles and authentication
- **Movie**: Movie metadata and details
- **Recommendation**: User movie recommendations
- **Friendship**: Friend connections
- **WatchStatus**: User watch status tracking
- **Like**: Likes on movies and recommendations

## API Integrations

- **TMDB**: Movie metadata and images
- **Google OAuth**: User authentication
- **Web Speech API**: Voice-to-text functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request