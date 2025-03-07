# Movie Pedia Project

This project is a movie-based web application where users can explore movies, share them with friends, and chat about their recommendations.

## Folder Structure

```
├─ MovieApiApp/   # ASP.NET Core API
│  ├─ src/        # API code
│  ├─ tests/      # Unit tests
│  └─ README.md   # Backend-specific information
├─ frontend/      # React app
│  ├─ src/        # React components and logic
│  ├─ public/     # Static files
│  ├─ tests/      # Frontend tests
│  └─ README.md   # Frontend-specific information
├─ .github/       # CI/CD workflows
├─ .gitignore
└─ README.md      # Project overview
```

## Technologies Used
- **Backend**: ASP.NET Core 8, MySQL, Entity Framework Core
- **Frontend**: React (Vite), Tailwind CSS
- **Database Hosting**: Railway
- **API Hosting**: Azure
- **CI/CD**: GitHub Actions

## Features
- Browse movies by title and rating
- Share movies directly with friends via chat
- Wishlist functionality
- JWT-based authentication
- Context API for state management
- Cross-domain support

## Installation

### Backend
1. Navigate to the `MovieApiApp` folder:
   ```bash
   cd MovieApiApp
   ```
2. Install dependencies:
   ```bash
   dotnet restore
   ```
3. Run the API:
   ```bash
   dotnet run
   ```

### Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend:
   ```bash
   npm run dev
   ```

## Environment Variables
Create a `.env` file in the `frontend` and `MovieApiApp` folders with the following variables:

### Backend
```
ConnectionStrings__DefaultConnection=your_mysql_connection_string
Jwt__Secret=your_jwt_secret
```

### Frontend
```
VITE_API_URL=your_backend_api_url
```

## Contributing
Feel free to fork the repository and submit pull requests.

## License
This project is licensed under the MIT License.

