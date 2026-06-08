/*
 * SEMANTIC ANALYSIS
 * - Top nav with Dashboard / Analytics / Settings → React Router with 3 routes
 * - Dashboard stat cards → mapped from API /stats
 * - Dashboard activity list + search → filterable list (useState query)
 * - Analytics period tabs (7d/30d/90d) → useState(activePeriod)
 * - Analytics chart data → fetched per period from /analytics
 * - Settings profile form → controlled form with validation on submit
 * - Settings notification toggles → useState per toggle, PUT /settings/preferences
 * - Save Changes button → loading state + success feedback
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { colors } from './tokens';

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: colors.background,
  },
  main: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '32px 24px',
  },
};

export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <Navbar />
        <main style={styles.main} role="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
