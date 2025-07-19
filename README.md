# CodeFusion Server

This is the backend server for CodeFusion, an AI-powered code generation and analysis platform.

## Features

- User authentication and authorization
- Project management
- File management
- AI-powered code generation and analysis
- Real-time collaboration
- Stripe integration for subscriptions

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Docker (optional)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BookEase-Hub/CodeFusion-Server.git
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `config` directory and add the following environment variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

### Running the Application

#### Without Docker

```bash
npm run dev
```

#### With Docker

```bash
docker-compose up
```

## API Documentation

The API is documented using Swagger. To view the documentation, run the application and navigate to `/api-docs` in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.
