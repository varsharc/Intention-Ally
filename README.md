# Intention-Ally Application Overview

## Introduction

Intention-Ally is a semantic search and clustering tool designed to help users organize their research and stay focused on specific topics. It uses authority-based ranking and semantic relevance to surface high-quality information from trusted sources.

## Features

- **Semantic Search**: Search the web with intention, focusing on high-authority sources
- **Knowledge Graphs**: Visualize connections between sources and concepts
- **Authority Scoring**: Rank sources based on authority and trustworthiness
- **Clustering**: Group related sources to identify patterns and relationships
- **Customizable Search Parameters**: Configure search preferences, domain trust settings, and more
- **User Authentication**: Secure access with Firebase authentication
- **Data Persistence**: Store search configurations and results in Firebase

## Application Architecture

### Frontend

- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Visualization**: D3.js for knowledge graphs
- **Authentication**: Firebase Auth

### Backend/Services

- **Database**: Firebase Firestore
- **Search Engine**: Tavily API (with fallback to mock data)
- **Authentication**: Firebase Authentication

## Key Components

### Pages

- **Home**: Dashboard with activity feed and analytics
- **Search Configuration**: Create and manage search topics
- **Search Results**: View search results and knowledge graph
- **Settings**: Configure API usage, notifications, and data management

### Components

- **SearchConfigForm**: Create and edit search configurations
- **KnowledgeGraph**: Visualize connections between search results
- **ResultsList**: Display search results with filtering and sorting
- **AuthModal**: Handle user authentication

### Services

- **Firebase**: Authentication and data persistence
- **Tavily**: Semantic search API integration
- **API**: Internal service layer for search operations

## Data Models

### User

- Basic user information and preferences
- Stored in Firebase Auth and Firestore

### Search Configuration

- Search keywords, parameters, domain preferences
- Authority thresholds and advanced settings
- Stored in Firestore

### Search Results

- Search results with authority scores
- Cluster assignments and graph coordinates
- Stored in Firestore

## Getting Started

1. Install dependencies with `npm install`
2. Configure Firebase and Tavily API keys in `.env.local`
3. Set up Firebase collections as described in `firebase_configuration.md`
4. Run the development server with `npm run dev`

## Testing

For testing purposes, you can use the following credentials:

- Email: `test@example.com`
- Password: `password123`

If this test user doesn't exist, the application will automatically create it for you when you attempt to sign in.

## Configuration

The application can be configured to use mock data instead of making real API calls, which is useful for development and testing. These settings can be adjusted in the Settings page.

## API Usage

Intention-Ally uses the Tavily API for semantic search. To prevent excessive API usage, you can:

1. Set a daily search limit in the Settings page
2. Enable the "Use mock data when possible" option for testing
3. Review current usage in the Settings page
