# Star Wars Character App

A responsive React application that fetches and displays Star Wars characters from SWAPI (Star Wars API) with pagination, search, filters, and detailed character information. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation & Running

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

3. **Login:**
   - Use any username/password (mock authentication)
   - Credentials are not validated - any input works

4. **Build for production:**
```bash
npm run build
```

5. **Preview production build:**
```bash
npm run preview
```

6. **Run tests:**
```bash
npm test
```

## ✨ What Was Implemented

### Core Requirements ✅

1. **Character Fetching & Display**
   - Fetches characters from SWAPI (`https://swapi.dev/api/people/`)
   - Displays characters in a responsive grid layout
   - Shows loading spinner during API calls
   - Error handling with retry functionality

2. **Character Cards**
   - Character name and species
   - Random images from Picsum Photos (consistent per character)
   - Species-based accent colors (deterministic color mapping)
   - Click to open detailed modal

3. **Character Details Modal**
   - Name (as header)
   - Height (converted from cm to meters)
   - Mass (in kg)
   - Birth Year
   - Date Added (formatted as dd-MM-yyyy)
   - Film Count (number of films)
   - Homeworld details (fetched on-demand):
     - Name
     - Terrain
     - Climate
     - Population

4. **Pagination**
   - Next/Previous buttons using API-provided links
   - Buttons disabled when no more pages available
   - Maintains current page state

5. **Responsive Design**
   - Mobile-first approach
   - Works seamlessly on mobile, tablet, and desktop
   - Adaptive grid layouts

### Bonus Features ✅

1. **Search Functionality**
   - Real-time search by character name
   - Case-insensitive partial matching
   - Works in combination with filters

2. **Advanced Filtering**
   - Filter by Homeworld (with names fetched from API)
   - Filter by Film (with titles fetched from API)
   - Filter by Species
   - All filters work together (AND logic)

3. **Mock Authentication**
   - Login/Logout functionality
   - Fake JWT token generation
   - Token persistence in localStorage
   - Silent token refresh simulation
   - Protected routes (login required)

4. **Integration Tests**
   - Tests for CharacterModal component
   - Tests for CharacterCard component
   - Tests for Search functionality
   - Tests for API mocking
   - Uses Vitest and React Testing Library

### Additional Features (Beyond Requirements) 🎁

1. **Favorites/Bookmarks System**
   - Heart icon on each character card
   - Click to favorite/unfavorite
   - Dedicated "Favorites" tab
   - Persists in localStorage

2. **Dark Mode**
   - Toggle button in header
   - System preference detection
   - Full dark mode support across all components
   - Persists user preference

3. **Sorting**
   - Sort by Name (A-Z)
   - Sort by Height (shortest to tallest)
   - Sort by Mass (lightest to heaviest)
   - Sort by Film Count (most to least)

4. **View Modes**
   - Grid view (default, card layout)
   - List view (compact horizontal layout)
   - Toggle between views

5. **Recently Viewed**
   - Tracks last 5 viewed characters
   - Horizontal scrollable section
   - Dedicated "Recently Viewed" tab
   - Auto-tracks when opening modals

6. **Character Comparison**
   - Compare two characters side-by-side
   - Visual indicators for winners (height, mass)
   - Compare button in character modal
   - Clear comparison option

## 🛠️ Tech Stack

- **React** 18.2.0 - Functional components with hooks
- **TypeScript** 5.3.3 - Type safety
- **Tailwind CSS** 3.3.6 - Utility-first styling
- **Vite** 5.0.8 - Fast build tool and dev server
- **Vitest** 1.0.4 - Testing framework
- **React Testing Library** 14.1.2 - Component testing utilities

## 📁 Project Structure

```
src/
  components/
    CharacterCard/           # Character card with favorite button
    CharacterModal/          # Character details modal
    CharacterComparison/     # Side-by-side comparison modal
    Pagination/              # Pagination controls
    Loader/                  # Loading spinner
    ErrorState/              # Error display with retry
    FavoriteButton/          # Heart icon button
    ThemeToggle/             # Dark mode toggle
    Login/                   # Login form
  context/
    AuthContext.tsx          # Authentication state
    FavoritesContext.tsx     # Favorites management
    ThemeContext.tsx          # Dark mode state
    RecentlyViewedContext.tsx # Recently viewed tracking
  pages/
    Home.tsx                 # Main page with all features
  hooks/
    useFetch.ts              # Custom data fetching hook
  utils/
    formatDate.ts            # Date formatting (dd-MM-yyyy)
    convertHeight.ts         # Height conversion (cm to m)
    getSpeciesColor.ts       # Species-based color mapping
  services/
    api.ts                   # SWAPI service layer
  tests/
    setup.ts                 # Test configuration
    CharacterModal.test.tsx  # Modal integration tests
    CharacterCard.test.tsx    # Card rendering tests
    Search.test.tsx           # Search functionality tests
    Home.test.tsx             # Home component tests
```

## 🎨 Design Choices & Trade-offs

### 1. **TypeScript over JavaScript**
   - **Choice**: Used TypeScript for type safety
   - **Benefit**: Catches errors at compile time, better IDE support, self-documenting code
   - **Trade-off**: Slightly more verbose, but worth it for maintainability

### 2. **Vite over Create React App**
   - **Choice**: Used Vite as build tool
   - **Benefit**: Faster dev server, faster builds, better HMR
   - **Trade-off**: Less common than CRA, but becoming standard

### 3. **Context API for State Management**
   - **Choice**: Used React Context API instead of Redux/Zustand
   - **Benefit**: Built-in, no extra dependencies, sufficient for this app size
   - **Trade-off**: Could be limiting for larger apps, but perfect for this scope

### 4. **Fetching Species/Homeworld on Initial Load**
   - **Choice**: Fetch species and homeworld names when loading character list
   - **Benefit**: Better UX - filters show names instead of URLs
   - **Trade-off**: More API calls upfront, but enables better filtering UX

### 5. **LocalStorage for Persistence**
   - **Choice**: Store favorites, theme, recently viewed in localStorage
   - **Benefit**: Data persists across sessions, no backend needed
   - **Trade-off**: Limited to browser, but sufficient for this use case

### 6. **Deterministic Color Mapping**
   - **Choice**: Generate colors based on species name hash
   - **Benefit**: Same species always gets same color, consistent UX
   - **Trade-off**: Limited color palette, but predictable

### 7. **Picsum Photos for Images**
   - **Choice**: Use Picsum Photos with character ID seed
   - **Benefit**: Consistent images per character, no API needed
   - **Trade-off**: Not actual character images, but works well for demo

### 8. **Modal for Character Details**
   - **Choice**: Modal instead of separate page
   - **Benefit**: Faster navigation, maintains context
   - **Trade-off**: Less URL-friendly, but better UX for this use case

### 9. **Optimistic Filtering**
   - **Choice**: Filter client-side after fetching
   - **Benefit**: Instant filtering, no API calls needed
   - **Trade-off**: Only filters current page, but acceptable for pagination

### 10. **Mock Authentication**
   - **Choice**: Simple localStorage-based auth
   - **Benefit**: Demonstrates auth flow without backend
   - **Trade-off**: Not secure, but sufficient for assignment

### 11. **Dark Mode Implementation**
   - **Choice**: Tailwind CSS dark mode with class strategy
   - **Benefit**: Easy to implement, consistent styling
   - **Trade-off**: Requires dark: prefix everywhere, but manageable

### 12. **Component Structure**
   - **Choice**: Feature-based component organization
   - **Benefit**: Easy to find and maintain code
   - **Trade-off**: More folders, but better organization

## 🔌 API Integration

The app integrates with:
- **SWAPI** (`https://swapi.dev/api/`) - Character, species, planet, and film data
- **Picsum Photos** (`https://picsum.photos/`) - Random character images

### API Workflow:
1. Fetch character list from `/people` endpoint
2. For each character, fetch species and homeworld names
3. Extract pagination links (next/previous)
4. On modal open, fetch full homeworld details
5. All API calls include error handling and loading states

## 🧪 Testing Strategy

- **Unit Tests**: Individual component tests
- **Integration Tests**: Component interaction tests
- **API Mocking**: Mocked API calls using Vitest
- **Test Coverage**: 
  - CharacterCard rendering
  - CharacterModal functionality
  - Search functionality
  - API call mocking

## 📱 Responsive Design

- **Mobile**: Single column, stacked filters, touch-friendly buttons
- **Tablet**: 2-3 column grid, optimized spacing
- **Desktop**: 4 column grid, full feature set

## 🚀 Performance Considerations

- **Memoization**: Used `useMemo` for expensive filtering/sorting operations
- **Lazy Loading**: Character details fetched on-demand
- **Optimistic Updates**: UI updates immediately, API calls in background
- **Image Optimization**: Consistent image URLs prevent re-fetching

## 🔒 Security Notes

- Mock authentication is for demonstration only
- No real security measures implemented
- In production, would need proper authentication backend

## 📝 Notes

- Character images are randomly generated but consistent per character ID
- Species colors are deterministically generated based on species name
- All API calls include proper error handling and retry mechanisms
- The app handles loading states gracefully throughout
- Filters work in combination with search functionality
- Dark mode preference persists across sessions
- Favorites and recently viewed persist in localStorage

## 🐛 Known Limitations

1. Only filters characters on current page (not all pages)
2. Film filter only shows first 3 films per character (performance optimization)
3. Comparison feature requires manual character selection
4. No offline support (requires API access)

## 📄 License

ISC
