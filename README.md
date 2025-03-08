# Meal Planner

A modern web application for planning your weekly meals with AI-powered suggestions.

## Features

- 📅 Weekly meal planning
- 🤖 AI-powered meal suggestions
- 📊 Health and nutrition tracking
- 🔄 Easy meal copying and management
- 📱 Responsive design
- 🔐 Google authentication

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Firebase (Authentication & Database)
- Hugging Face AI
- Vercel AI SDK

## Getting Started

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd meal-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

   # Hugging Face Configuration
   HUGGINGFACE_API_KEY=
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3003](http://localhost:3003) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── components/     # React components
│   └── lib/           # Utility functions and hooks
├── public/             # Static assets
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.