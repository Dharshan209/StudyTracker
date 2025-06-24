# DSA Tracker

A comprehensive web application for tracking and managing Data Structures and Algorithms (DSA) practice problems. Built with React and Firebase, this application helps developers systematically prepare for technical interviews and improve their coding skills.

## Features

### 📊 Dashboard
- **Progress Tracking**: Visual progress rings showing completion statistics
- **Recent Activity**: Track your latest problem-solving activities
- **Calendar Integration**: View your practice schedule and completed problems
- **Scheduled Problems**: Manage your daily problem-solving goals
- **Study Plans**: Access structured learning paths
- **Statistics Cards**: Monitor your overall performance metrics

### 📝 Problem Management
- **Problem List**: Browse through a curated collection of DSA problems
- **Problem Table**: Detailed view with company tags, difficulty levels, and topics
- **Add Problems**: Add new problems to your practice list via modal interface
- **Problem Data**: Comprehensive JSON database with 500+ problems
- **Company Tags**: Filter problems by companies (Google, Facebook, Amazon, Microsoft, etc.)
- **Difficulty Levels**: Easy, Medium, and Hard categorization
- **Topic Categories**: Array, String, Dynamic Programming, Trees, Graphs, and more

### 📚 Study Plans
- **Structured Learning**: Pre-defined study plans for systematic preparation
- **Progress Tracking**: Monitor completion status across different plans
- **Plan Updates**: Modify and customize study plans based on your needs

### 📖 Resources
- **Problem Resources**: Access additional learning materials for each problem
- **Educational Content**: Links to visualizations and video explanations
- **Main Content**: Comprehensive explanations and solution approaches

### 💳 Premium Features
- **Pricing Plans**: Multiple subscription tiers
- **Checkout Process**: Secure payment integration
- **Payment Success**: Confirmation and plan activation

### 👤 User Management
- **Authentication**: Firebase-based user authentication
- **Profile Management**: Personal profile page with user statistics
- **Login Modal**: Seamless authentication experience

### 🎯 Advanced Features
- **Voice Input**: Voice recognition for hands-free interaction
- **Keyboard Shortcuts**: Quick navigation and actions
- **Mobile Optimization**: Responsive design with mobile-specific features
- **Pull to Refresh**: Mobile-friendly data refreshing
- **Bottom Navigation**: Mobile-optimized navigation
- **Progressive Loading**: Smooth loading experience with skeletons
- **Swipe Gestures**: Touch-friendly interactions
- **Time Tracking**: Monitor time spent on each problem
- **Notifications**: Stay updated with practice reminders

## Technology Stack

### Frontend
- **React 19.1.0**: Modern React with latest features
- **React Router DOM**: Client-side routing
- **Tailwind CSS 4.1.8**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icon library
- **React Calendar**: Calendar component for scheduling
- **React Syntax Highlighter**: Code syntax highlighting

### Backend & Services
- **Firebase 11.9.0**: Authentication, database, and hosting
- **Payment Integration**: Secure payment processing

### Development Tools
- **Vite 6.3.5**: Fast build tool and development server
- **ESLint**: Code linting and formatting
- **Rollup Plugin Visualizer**: Bundle analysis
- **DOMPurify**: XSS protection for dynamic content
- **Moment.js**: Date and time manipulation

## Project Structure

```
src/
├── Components/
│   ├── DashBoard/          # Dashboard components
│   ├── Header/             # Navigation and user interface
│   ├── Home/               # Home page components
│   ├── Pricing/            # Payment and pricing
│   ├── ProblemList/        # Problem browsing and management
│   ├── Resources/          # Educational resources
│   ├── StudyPlan/          # Study plan management
│   └── UI/                 # Reusable UI components
├── Config/
│   └── firebase.js         # Firebase configuration
├── Data/
│   └── Problem.json        # Problem database
├── Hooks/                  # Custom React hooks
├── Services/               # API and external services
└── assets/                 # Static assets
```

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Firebase account for backend services

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dsa-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Copy your Firebase configuration to `src/Config/firebase.js`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build

## Key Features in Detail

### Problem Database
The application includes a comprehensive database of DSA problems with:
- 500+ carefully curated problems
- Company associations for interview preparation
- Difficulty categorization
- Topic-based organization
- Links to visualizations and video explanations

### Progress Tracking
- Visual progress indicators
- Calendar-based activity tracking
- Statistics and analytics
- Recent activity monitoring
- Goal setting and achievement tracking

### Study Plans
- Structured learning paths
- Beginner to advanced progressions
- Company-specific preparation tracks
- Custom plan creation
- Progress monitoring across plans

### Mobile Experience
- Fully responsive design
- Touch-friendly interactions
- Pull-to-refresh functionality
- Mobile-optimized navigation
- Gesture-based controls

### Performance Optimization
- Lazy loading for better performance
- Code splitting with React.lazy()
- Progressive loading indicators
- Efficient data fetching with custom hooks
- Bundle optimization with Rollup

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is private and not open for public distribution.

## Support

For support and questions, please contact the development team.