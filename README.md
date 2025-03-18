# Travel Story App

## Project Overview
Travel Story App is a web application that allows users to share and explore travel stories. The application is built with a React frontend and an Express backend.

## Installation

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the backend server:
   ```bash
   npm run dev
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend development server:
   ```bash
   npm run dev
   ```

## Usage
- Access the frontend application at `http://localhost:3000` (or the port specified by Vite).
- The backend API can be accessed at `http://localhost:5000` (or the port specified in your backend configuration).

## Features
- User authentication
- Create, read, update, and delete travel stories
- Like and comment on stories
- Responsive design with Tailwind CSS

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

## Deployment Troubleshooting
If you encounter issues while deploying the application, consider the following steps:
1. Ensure that the directory structure is correct and that all necessary files, including `package.json` for both the backend and frontend, are present in the repository.
2. Check for any errors in the deployment logs and address them accordingly.
3. Make sure that environment variables are set correctly, especially for database connections and API keys.
4. If using a service like Render, ensure that the build commands are correctly specified in the service's settings.
