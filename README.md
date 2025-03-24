# Intention-Ally

Intention-Ally is a sophisticated semantic search and knowledge visualization platform designed to help you track specialized topics across the internet with high precision. It uses intelligent filtering, semantic clustering, and interactive visualizations to help you discover meaningful connections between information sources.

## Features

- **Quality-Focused Search**: Authority scoring prioritizes reliable sources
- **Semantic Connections**: Discover relationships between information sources 
- **AI-Powered Research**: Deep research with Claude AI integration
- **Customizable Search Topics**: Configure domain templates, authority thresholds, and advanced parameters
- **Resource Optimization**: Smart caching and resource usage monitoring

## Technical Architecture

- **Frontend**: Next.js (App Router) with React and TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Search**: Tavily API
- **AI Research**: Claude API
- **Deployment**: Vercel (serverless functions)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Firebase account
- Tavily API key
- Claude API key (optional, for deep research)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/varsharc/Intention-Ally.git
   cd Intention-Ally
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase configuration and API keys

4. Create a Firebase project:
   - Enable Firestore Database
   - Enable Authentication with Email/Password
   - Set up Firestore security rules (see below)

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Firebase Setup

1. Create a new Firebase project
2. Add a web app to your project
3. Enable Firestore Database
4. Enable Authentication with Email/Password
5. Copy your Firebase configuration to `.env.local`
6. Deploy the Firestore security rules in `firestore.rules`

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isSignedIn() && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    function ownsConfig(configId) {
      return isSignedIn() && 
        exists(/databases/$(database)/documents/searchConfigs/$(configId)) &&
        get(/databases/$(database)/documents/searchConfigs/$(configId)).data.userId == request.auth.uid;
    }
    
    // User settings
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Search configurations
    match /searchConfigs/{configId} {
      allow read: if isSignedIn() && (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
    
    // Search results
    match /searchResults/{resultId} {
      allow read: if isSignedIn() && (ownsConfig(resource.data.configId) || isAdmin());
      allow create: if isSignedIn() && ownsConfig(request.resource.data.configId);
      allow update: if isSignedIn() && ownsConfig(resource.data.configId);
      allow delete: if isSignedIn() && ownsConfig(resource.data.configId);
    }
    
    // Result clusters
    match /resultClusters/{clusterId} {
      allow read: if isSignedIn();
      // Only system or admin can create/update clusters
      allow create, update, delete: if isAdmin();
    }
    
    // Usage logs
    match /usageLogs/{logId} {
      allow read: if isSignedIn() && (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      // Only admin can update/delete logs
      allow update, delete: if isAdmin();
    }
  }
}
```

## Deployment

This project is configured for deployment on Vercel:

1. Create a Vercel account
2. Link your GitHub repository
3. Configure the environment variables in Vercel
4. Deploy the project

## Resource Usage Optimization

The application implements several strategies to minimize API usage costs:

1. **Caching Strategy**:
   - Search results are cached for 1 hour
   - Implement localStorage caching for UI components

2. **API Call Throttling**:
   - Rate limits for search operations
   - Batched API requests

3. **Resource Monitoring**:
   - Usage logs track API consumption
   - Admin dashboard for monitoring usage

## License

[MIT](LICENSE)
