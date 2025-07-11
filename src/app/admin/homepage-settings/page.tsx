"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Eye, RefreshCw, Home, Palette, Type } from 'lucide-react';
import Link from 'next/link';

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

export default function HomepageSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [settings, setSettings] = useState<HomepageSettings>({
    site_name: 'TecBunny',
    logo_url: null,
    banner_title: 'Premium Tech Accessories',
    banner_subtitle: 'Discover the latest in technology accessories with unbeatable prices, premium quality, and lightning-fast delivery across India.',
    banner_background_color: 'from-blue-600 via-blue-500 to-purple-600',
    banner_text_color: 'white',
    banner_button_primary_text: 'Shop Now',
    banner_button_secondary_text: 'View Categories',
    feature_delivery_title: 'Free Delivery',
    feature_delivery_subtitle: 'On orders above ₹500',
    feature_genuine_title: 'Genuine Products',
    feature_genuine_subtitle: '100% authentic guarantee',
    feature_support_title: '24/7 Support',
    feature_support_subtitle: 'Always here to help'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/homepage-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'logo');

    setIsUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, logo_url: data.url }));
        setMessage({ type: 'success', text: 'Logo uploaded successfully' });
      } else {
        setMessage({ type: 'error', text: 'Failed to upload logo' });
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      setMessage({ type: 'error', text: 'Failed to upload logo' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/homepage-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully' });
        // Refresh the page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof HomepageSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const backgroundColorOptions = [
    { value: 'from-blue-600 via-blue-500 to-purple-600', label: 'Blue to Purple' },
    { value: 'from-purple-600 via-pink-500 to-red-600', label: 'Purple to Red' },
    { value: 'from-green-600 via-teal-500 to-blue-600', label: 'Green to Blue' },
    { value: 'from-orange-600 via-yellow-500 to-red-600', label: 'Orange to Red' },
    { value: 'from-gray-800 via-gray-700 to-gray-900', label: 'Dark Gray' },
    { value: 'from-indigo-600 via-blue-500 to-cyan-600', label: 'Indigo to Cyan' },
  ];

  const textColorOptions = [
    { value: 'white', label: 'White' },
    { value: 'black', label: 'Black' },
    { value: 'gray-100', label: 'Light Gray' },
    { value: 'gray-800', label: 'Dark Gray' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Homepage Settings</h1>
              <p className="text-gray-600 mt-2">Customize your website&apos;s homepage appearance</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/" target="_blank">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Site Identity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Type className="h-5 w-5" />
                <span>Site Identity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => handleInputChange('site_name', e.target.value)}
                  placeholder="TecBunny"
                />
              </div>
              
              <div>
                <Label htmlFor="logo_url">Logo</Label>
                <div className="flex items-center space-x-4 mt-2">
                  {settings.logo_url && (
                    <img 
                      src={settings.logo_url} 
                      alt="Logo preview" 
                      className="w-16 h-16 object-contain rounded border"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={isUploading}
                      className="mb-2"
                    />
                    {settings.logo_url && (
                      <Input
                        placeholder="Logo URL"
                        value={settings.logo_url}
                        onChange={(e) => handleInputChange('logo_url', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banner Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Banner Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="banner_title">Banner Title</Label>
                <Input
                  id="banner_title"
                  value={settings.banner_title}
                  onChange={(e) => handleInputChange('banner_title', e.target.value)}
                  placeholder="Premium Tech Accessories"
                />
              </div>
              
              <div>
                <Label htmlFor="banner_subtitle">Banner Subtitle</Label>
                <textarea
                  id="banner_subtitle"
                  value={settings.banner_subtitle}
                  onChange={(e) => handleInputChange('banner_subtitle', e.target.value)}
                  placeholder="Discover the latest in technology accessories..."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="banner_background_color">Background Color</Label>
                  <select
                    id="banner_background_color"
                    value={settings.banner_background_color}
                    onChange={(e) => handleInputChange('banner_background_color', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    {backgroundColorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="banner_text_color">Text Color</Label>
                  <select
                    id="banner_text_color"
                    value={settings.banner_text_color}
                    onChange={(e) => handleInputChange('banner_text_color', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    {textColorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="banner_button_primary_text">Primary Button Text</Label>
                  <Input
                    id="banner_button_primary_text"
                    value={settings.banner_button_primary_text}
                    onChange={(e) => handleInputChange('banner_button_primary_text', e.target.value)}
                    placeholder="Shop Now"
                  />
                </div>
                
                <div>
                  <Label htmlFor="banner_button_secondary_text">Secondary Button Text</Label>
                  <Input
                    id="banner_button_secondary_text"
                    value={settings.banner_button_secondary_text}
                    onChange={(e) => handleInputChange('banner_button_secondary_text', e.target.value)}
                    placeholder="View Categories"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Delivery Feature</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Free Delivery"
                      value={settings.feature_delivery_title}
                      onChange={(e) => handleInputChange('feature_delivery_title', e.target.value)}
                    />
                    <Input
                      placeholder="On orders above ₹500"
                      value={settings.feature_delivery_subtitle}
                      onChange={(e) => handleInputChange('feature_delivery_subtitle', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Genuine Products</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Genuine Products"
                      value={settings.feature_genuine_title}
                      onChange={(e) => handleInputChange('feature_genuine_title', e.target.value)}
                    />
                    <Input
                      placeholder="100% authentic guarantee"
                      value={settings.feature_genuine_subtitle}
                      onChange={(e) => handleInputChange('feature_genuine_subtitle', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Support Feature</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="24/7 Support"
                      value={settings.feature_support_title}
                      onChange={(e) => handleInputChange('feature_support_title', e.target.value)}
                    />
                    <Input
                      placeholder="Always here to help"
                      value={settings.feature_support_subtitle}
                      onChange={(e) => handleInputChange('feature_support_subtitle', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3"
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
