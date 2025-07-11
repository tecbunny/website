"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Upload, Eye, Settings, Palette, Type, Image, X } from 'lucide-react';

interface HomepageSettings {
  id?: string;
  site_name: string;
  logo_url: string | null;
  logo_public_id?: string | null;
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

export default function HomepageEditor() {
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
    feature_support_subtitle: 'Always here to help',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/homepage-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        if (data.logo_url) {
          setLogoPreview(data.logo_url);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof HomepageSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' });
        return;
      }

      if (file.size > maxSize) {
        setMessage({ type: 'error', text: 'File too large. Please upload an image under 5MB.' });
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setMessage(null); // Clear any previous errors
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setSettings(prev => ({ ...prev, logo_url: null, logo_public_id: null }));
  };

  const uploadLogo = async (): Promise<{ url: string | null; public_id: string | null }> => {
    if (!logoFile) return { url: settings.logo_url, public_id: settings.logo_public_id || null };

    const formData = new FormData();
    formData.append('file', logoFile);
    formData.append('type', 'logo'); // This will organize it in website-portal-media folder

    try {
      // Delete old logo if it exists
      if (settings.logo_public_id) {
        await fetch(`/api/upload?publicId=${encodeURIComponent(settings.logo_public_id)}`, {
          method: 'DELETE'
        });
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        return { url: data.url, public_id: data.public_id };
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
    return { url: null, public_id: null };
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    
    try {
      // Upload logo if changed
      const logoResult = await uploadLogo();
      
      const settingsToSave = {
        ...settings,
        logo_url: logoResult.url,
        logo_public_id: logoResult.public_id
      };

      const response = await fetch('/api/admin/homepage-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsToSave),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Homepage settings updated successfully!' });
        setLogoFile(null);
        // Refresh to get the latest data
        await fetchSettings();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const previewHomepage = () => {
    window.open('/', '_blank');
  };

  const gradientOptions = [
    { value: 'from-blue-600 via-blue-500 to-purple-600', label: 'Blue to Purple' },
    { value: 'from-purple-600 via-pink-500 to-red-600', label: 'Purple to Red' },
    { value: 'from-green-600 via-teal-500 to-blue-600', label: 'Green to Blue' },
    { value: 'from-yellow-600 via-orange-500 to-red-600', label: 'Yellow to Red' },
    { value: 'from-indigo-600 via-purple-500 to-pink-600', label: 'Indigo to Pink' },
    { value: 'from-gray-800 via-gray-700 to-gray-900', label: 'Dark Gray' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Homepage Editor
          </h1>
          <div className="flex gap-2">
            <Button onClick={previewHomepage} variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Site Identity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Site Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => handleInputChange('site_name', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="logo">Logo</Label>
                <div className="mt-1 flex items-center gap-4">
                  <input
                    id="logo"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('logo')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </Button>
                  {logoPreview && (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-16 border border-gray-300 rounded-lg overflow-hidden">
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeLogo}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Recommended: 200x200px, JPEG/PNG/WebP, max 5MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Banner Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Banner Section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="banner_title">Banner Title</Label>
                <Input
                  id="banner_title"
                  value={settings.banner_title}
                  onChange={(e) => handleInputChange('banner_title', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="banner_subtitle">Banner Subtitle</Label>
                <textarea
                  id="banner_subtitle"
                  value={settings.banner_subtitle}
                  onChange={(e) => handleInputChange('banner_subtitle', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary_button">Primary Button Text</Label>
                  <Input
                    id="primary_button"
                    value={settings.banner_button_primary_text}
                    onChange={(e) => handleInputChange('banner_button_primary_text', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="secondary_button">Secondary Button Text</Label>
                  <Input
                    id="secondary_button"
                    value={settings.banner_button_secondary_text}
                    onChange={(e) => handleInputChange('banner_button_secondary_text', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banner Styling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Banner Styling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="background_gradient">Background Gradient</Label>
                <select
                  id="background_gradient"
                  value={settings.banner_background_color}
                  onChange={(e) => handleInputChange('banner_background_color', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {gradientOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="text_color">Text Color</Label>
                <select
                  id="text_color"
                  value={settings.banner_text_color}
                  onChange={(e) => handleInputChange('banner_text_color', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="white">White</option>
                  <option value="black">Black</option>
                  <option value="gray-100">Light Gray</option>
                  <option value="gray-900">Dark Gray</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Feature Section */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Delivery Feature</Label>
                  <Input
                    value={settings.feature_delivery_title}
                    onChange={(e) => handleInputChange('feature_delivery_title', e.target.value)}
                    placeholder="Feature title"
                  />
                  <Input
                    value={settings.feature_delivery_subtitle}
                    onChange={(e) => handleInputChange('feature_delivery_subtitle', e.target.value)}
                    placeholder="Feature subtitle"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Genuine Products Feature</Label>
                  <Input
                    value={settings.feature_genuine_title}
                    onChange={(e) => handleInputChange('feature_genuine_title', e.target.value)}
                    placeholder="Feature title"
                  />
                  <Input
                    value={settings.feature_genuine_subtitle}
                    onChange={(e) => handleInputChange('feature_genuine_subtitle', e.target.value)}
                    placeholder="Feature subtitle"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Support Feature</Label>
                  <Input
                    value={settings.feature_support_title}
                    onChange={(e) => handleInputChange('feature_support_title', e.target.value)}
                    placeholder="Feature title"
                  />
                  <Input
                    value={settings.feature_support_subtitle}
                    onChange={(e) => handleInputChange('feature_support_subtitle', e.target.value)}
                    placeholder="Feature subtitle"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
