import { useState, useEffect } from 'react';

interface HomepageSettings {
  id?: string;
  site_name: string;
  logo_url: string | null;
  banner_title: string;
  banner_subtitle: string;
  banner_background_color: string;
  banner_text_color: string;
  banner_button_primary_text: string;
  banner_button_secondary_text: string;
  feature_delivery_title: string;
  feature_delivery_subtitle: string;
  feature_genuine_title: string;
  feature_genuine_subtitle: string;
  feature_support_title: string;
  feature_support_subtitle: string;
}

export function useHomepageSettings() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/homepage-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setError(null);
      } else {
        setError('Failed to load homepage settings');
      }
    } catch (err) {
      console.error('Error fetching homepage settings:', err);
      setError('Failed to load homepage settings');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSettings = () => {
    setIsLoading(true);
    fetchSettings();
  };

  return {
    settings,
    isLoading,
    error,
    refreshSettings
  };
}
