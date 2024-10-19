# 3D Printing by Rysera

Welcome to the 3D Printing by Rysera project! This project is a comprehensive solution for managing 3D printing orders, including features for handling STL files, integrating with Google Sheets, Google Drive, Zoho Books, MongoDB, and Google OAuth.

## Table of Contents
* [Features](#features)
* [Prerequisites](#prerequisites)
* [Getting Started](#getting-started)
* [Configuration](#configuration)
  * [Environment Variables](#environment-variables)
  * [Google Sheets](#google-sheets)
  * [Google Drive](#google-drive)
  * [Zoho Books](#zoho-books)
  * [MongoDB](#mongodb)
  * [Google OAuth](#google-oauth)
* [STL File Volume Calculator](#stl-file-volume-calculator)
* [Executing the Application](#executing-the-application)

## Features

- **STL File Processing**
  - Upload and analyze STL files
  - Automatic volume calculation
  - Support for both ASCII and binary STL formats
  - Vector-based calculations for high accuracy

- **Integration Services**
  - Google Sheets integration for order tracking
  - Google Drive storage for STL files
  - Zoho Books integration for invoicing and accounting
  - MongoDB database for data persistence
  - Google OAuth for secure authentication

- **Order Management**
  - Create and track 3D printing orders
  - Automated cost calculation
  - Customer communication management

- **Administrative Tools**
  - User role management
  - Order history and analytics
  - Custom pricing rules
  - Batch order processing

## Prerequisites

### Backend Requirements
- Ballerina 2.0.0 or higher
- Valid Google Cloud Platform account with:
  - Google Sheets API enabled
  - Google Drive API enabled
  - OAuth 2.0 configured
- Zoho Books account with API access
- Git (for version control)

### Frontend Requirements
- Node.js 16.x or higher
- npm 8.x or higher
- Modern web browser with JavaScript enabled
- Vite 4.x or higher

### Development Tools
- IDE with Ballerina support
- Postman or similar API testing tool (recommended)

## Getting Started

To get started with this project, clone the repository and install the necessary dependencies for both the client and server.

```bash
git clone https://github.com/TumashaD/iwb330-rysera.git
```

## Configuration

### Environment Variables

#### Backend
The backend configuration is managed through the `config.toml` file located in the Server directory. Here is a sample configuration:

```toml
# List of valid API keys
validApiKeys = ["your-api-key-1", "your-api-key-2"]

# Connection string for MongoDB
mongoDBConnectionString = "your-mongodb-connection-string"

# API key for the estimator service
estimatorApiKey = "your-estimator-api-key"

# Google OAuth configuration
OAuthRefreshToken = "your-oauth-refresh-token"
OAuthClientId = "your-oauth-client-id"
OAuthClientSecret = "your-oauth-client-secret"

# Zoho Books configuration
ZohoclientID = "your-zoho-client-id"
ZohoclientSecret = "your-zoho-client-secret"
ZohorefreshToken = "your-zoho-refresh-token"
ZohoorganizationId = "your-zoho-organization-id"
```

#### Frontend
The frontend configuration is managed through the `.env.local` file located in the Client directory. Here is a sample configuration:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_MIDDLEWARE_BASE_URL=http://localhost:9090
VITE_MIDDLEWARE_API_KEY=your-api-key
```

### Google Sheets
To configure Google Sheets, ensure you have the necessary API keys and tokens set in the `config.toml` file.

### Google Drive
To configure Google Drive, ensure you have the necessary API keys and tokens set in the `config.toml` file.

### Zoho Books
To configure Zoho Books, ensure you have the necessary client ID, client secret, refresh token, and organization ID set in the `config.toml` file.

### MongoDB
To configure MongoDB, ensure you have the connection string set in the `config.toml` file.

### Google OAuth
To configure Google OAuth, ensure you have the client ID, client secret, and refresh token set in the `config.toml` file.

## STL File Volume Calculator

This project includes an STL file volume calculator implemented in Ballerina. The calculator supports both ASCII and binary STL files and uses vectors for accurate volume calculations.

The relevant code can be found in the `volume_calculator.bal` file.

## Executing the Application

### Backend
To run the backend server, navigate to the Server directory and execute the following command:

```bash
bal run
```

### Frontend
To run the frontend application, navigate to the Client directory and execute the following commands:

```bash
npm install
npm run dev
```

This will start the frontend development server.

## Conclusion

This project provides a robust solution for managing 3D printing orders, integrating various services, and calculating STL file volumes. Follow the configuration steps carefully to set up the environment and execute the application seamlessly.

Enjoy exploring and enhancing the 3D Printing by Rysera project!