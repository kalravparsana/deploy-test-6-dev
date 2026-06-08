// Figma layer: "Navigation / Top Bar"
import { NavLink } from 'react-router-dom';
import { colors, typography, shadows } from '../tokens';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/settings', label: 'Settings' },
];

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    backgroundColor: colors.surface,
    borderBottom: `1px solid ${colors.border}`,
    boxShadow: shadows.card,
  },
  logo: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
  links: {
    display: 'flex',
    gap: 8,
  },
  link: {
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 400,
    color: colors.navInactive,
    fontFamily: typography.fontFamily,
    transition: 'all 0.15s ease',
  },
  linkActive: {
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    color: colors.navActive,
    backgroundColor: '#EFF6FF',
    fontFamily: typography.fontFamily,
  },
};

export default function Navbar() {
  return (
    <nav style={styles.nav} role="navigation" aria-label="Main navigation">
      <div style={styles.logo}>LaunchPad</div>
      <div style={styles.links}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
