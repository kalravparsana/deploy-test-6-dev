// Figma layer: "Settings / Main Frame"
import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { mockProfile, mockPreferences } from '../data/mockData';
import { colors, radii, shadows, typography } from '../tokens';

const styles = {
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
    marginBottom: 32,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 24,
    boxShadow: shadows.card,
    border: `1px solid ${colors.border}`,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
    marginBottom: 20,
    fontFamily: typography.fontFamily,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    display: 'block',
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: colors.textPrimary,
    marginBottom: 6,
    fontFamily: typography.fontFamily,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: radii.input,
    border: `1px solid ${colors.border}`,
    fontSize: 14,
    fontFamily: typography.fontFamily,
    outline: 'none',
  },
  inputError: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: radii.input,
    border: `1px solid ${colors.error}`,
    fontSize: 14,
    fontFamily: typography.fontFamily,
    outline: 'none',
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    fontFamily: typography.fontFamily,
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: `1px solid ${colors.border}`,
  },
  toggleLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s',
  },
  button: {
    padding: '10px 24px',
    borderRadius: radii.button,
    border: 'none',
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: typography.fontFamily,
    cursor: 'pointer',
  },
  buttonDisabled: {
    padding: '10px 24px',
    borderRadius: radii.button,
    border: 'none',
    backgroundColor: '#CBD5E1',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: typography.fontFamily,
    cursor: 'not-allowed',
  },
  success: {
    padding: 12,
    backgroundColor: colors.successBg,
    color: colors.success,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    fontFamily: typography.fontFamily,
  },
  spinner: {
    textAlign: 'center',
    padding: 40,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
};

function Toggle({ enabled, onChange, label }) {
  return (
    <div style={styles.toggleRow}>
      <span style={styles.toggleLabel}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        style={{
          ...styles.toggle,
          backgroundColor: enabled ? colors.primary : '#CBD5E1',
        }}
        onClick={() => onChange(!enabled)}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: enabled ? 22 : 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            transition: 'left 0.2s',
            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
          }}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [profile, setProfile] = useState({ name: '', email: '', role: '' });
  const [preferences, setPreferences] = useState({
    emailNotifications: false,
    pushNotifications: false,
    weeklyDigest: false,
    darkMode: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialProfile, setInitialProfile] = useState(null);
  const [initialPreferences, setInitialPreferences] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [profileData, prefsData] = await Promise.all([
          api.getProfile(),
          api.getPreferences(),
        ]);
        setProfile(profileData);
        setPreferences(prefsData);
        setInitialProfile(profileData);
        setInitialPreferences(prefsData);
      } catch {
        setProfile(mockProfile);
        setPreferences(mockPreferences);
        setInitialProfile(mockProfile);
        setInitialPreferences(mockPreferences);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    if (!initialProfile || !initialPreferences) return;
    const profileChanged = JSON.stringify(profile) !== JSON.stringify(initialProfile);
    const prefsChanged = JSON.stringify(preferences) !== JSON.stringify(initialPreferences);
    setHasChanges(profileChanged || prefsChanged);
  }, [profile, preferences, initialProfile, initialPreferences]);

  const validate = () => {
    const e = {};
    if (!profile.name.trim()) e.name = 'Name is required';
    if (!profile.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) e.email = 'Enter a valid email';
    if (!profile.role.trim()) e.role = 'Role is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSuccess(false);
    try {
      await Promise.all([
        api.updateProfile(profile),
        api.updatePreferences(preferences),
      ]);
      setInitialProfile({ ...profile });
      setInitialPreferences({ ...preferences });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={styles.spinner} data-testid="spinner">Loading settings...</div>;
  }

  return (
    <div>
      <h1 style={styles.title}>Settings</h1>
      <p style={styles.subtitle}>Manage your profile and notification preferences</p>

      {success && (
        <div style={styles.success} role="status">Changes saved!</div>
      )}

      {errors.form && (
        <div style={{ ...styles.errorText, marginBottom: 16 }} role="alert">{errors.form}</div>
      )}

      <section style={styles.section} aria-labelledby="profile-heading">
        <h2 id="profile-heading" style={styles.sectionTitle}>Profile</h2>

        <div style={styles.field}>
          <label htmlFor="name" style={styles.label}>Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={profile.name}
            onChange={handleProfileChange}
            style={errors.name ? styles.inputError : styles.input}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <p id="name-error" style={styles.errorText}>{errors.name}</p>}
        </div>

        <div style={styles.field}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleProfileChange}
            style={errors.email ? styles.inputError : styles.input}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p id="email-error" style={styles.errorText}>{errors.email}</p>}
        </div>

        <div style={styles.field}>
          <label htmlFor="role" style={styles.label}>Role</label>
          <input
            id="role"
            name="role"
            type="text"
            value={profile.role}
            onChange={handleProfileChange}
            style={errors.role ? styles.inputError : styles.input}
            aria-describedby={errors.role ? 'role-error' : undefined}
          />
          {errors.role && <p id="role-error" style={styles.errorText}>{errors.role}</p>}
        </div>
      </section>

      <section style={styles.section} aria-labelledby="prefs-heading">
        <h2 id="prefs-heading" style={styles.sectionTitle}>Notifications</h2>

        <Toggle
          label="Email Notifications"
          enabled={preferences.emailNotifications}
          onChange={(v) => setPreferences({ ...preferences, emailNotifications: v })}
        />
        <Toggle
          label="Push Notifications"
          enabled={preferences.pushNotifications}
          onChange={(v) => setPreferences({ ...preferences, pushNotifications: v })}
        />
        <Toggle
          label="Weekly Digest"
          enabled={preferences.weeklyDigest}
          onChange={(v) => setPreferences({ ...preferences, weeklyDigest: v })}
        />
        <Toggle
          label="Dark Mode"
          enabled={preferences.darkMode}
          onChange={(v) => setPreferences({ ...preferences, darkMode: v })}
        />
      </section>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || !hasChanges}
        style={saving || !hasChanges ? styles.buttonDisabled : styles.button}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
