# LeMastekakel - Ethiopian Misinformation Tracking Platform

## Overview

LeMastekakel is a sophisticated platform designed to track, analyze, and combat misinformation in Ethiopia. The platform integrates real-time data analysis, academic sources, and AI-powered content verification to provide a comprehensive solution for monitoring and addressing misinformation.

## Features

- **Real-time Analytics Dashboard**: Monitor misinformation trends and patterns
- **Geographic Distribution**: Visualize the spread of misinformation across Ethiopia
- **AI-Powered Content Analysis**: Leverage OpenAI for fact-checking and content verification
- **Academic Source Integration**: Access verified academic sources and research
- **Influencer Tracking**: Monitor key influencers and their impact
- **Automated Workflows**: Streamline content analysis and verification processes

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   └── ui/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── integrations/
│   └── public/
├── backend/
│   ├── supabase/
│   │   ├── functions/
│   │   └── migrations/
│   └── edge-functions/
└── docs/
```

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase, Edge Functions
- **Database**: PostgreSQL (via Supabase)
- **AI Integration**: OpenAI GPT-4
- **Authentication**: Supabase Auth
- **Analytics**: Recharts

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - OPENAI_API_KEY
4. Run the development server: `npm run dev`

## Backend Setup

The backend is powered by Supabase and includes:

- Database tables for storing misinformation data
- Edge Functions for AI-powered content analysis
- Real-time subscriptions for live updates
- Row Level Security policies for data protection

## Frontend Architecture

The frontend is built with React and organized into:

- Reusable UI components
- Page components
- Custom hooks
- Integration utilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License

## Contact

For support or inquiries, please open an issue in the repository.