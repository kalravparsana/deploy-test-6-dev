// Figma layer: "Analytics / Period Tabs"
import { colors, radii, typography } from '../tokens';

const styles = {
  container: {
    display: 'flex',
    gap: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: radii.button,
    padding: 4,
  },
  tab: {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 13,
    fontWeight: 500,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
    cursor: 'pointer',
  },
  tabActive: {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: colors.surface,
    fontSize: 13,
    fontWeight: 600,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
    cursor: 'pointer',
  },
};

export default function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div style={styles.container} role="tablist" aria-label="Period selection">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          style={activeTab === tab.id ? styles.tabActive : styles.tab}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
