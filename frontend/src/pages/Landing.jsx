import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';

const Landing = () => {
  const [pixelId, setPixelId] = useState('');
  const [utmParams, setUtmParams] = useState({});

  useEffect(() => {
    // Extract UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content')
    };
    setUtmParams(utmData);

    // Get referrer for lead source tracking
    if (document.referrer) {
      utmData.utm_source = utmData.utm_source || document.referrer;
    }

    // Try to get pixel ID from localStorage or user session
    const storedPixelId = localStorage.getItem('selectedPixelId');
    if (storedPixelId) {
      setPixelId(storedPixelId);
      injectMetaPixel(storedPixelId);
    }
  }, []);

  const injectMetaPixel = (id) => {
    if (!id || document.getElementById('fb-pixel')) return;

    // Create Meta Pixel script
    const script = document.createElement('script');
    script.id = 'fb-pixel';
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${id}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Track PageView event
    trackEvent('PageView');
  };

  const trackEvent = async (eventName, customData = {}) => {
    if (!pixelId) {
      console.log('No pixel ID available for tracking');
      return;
    }

    try {
      const eventData = {
        event_name: eventName,
        event_time: new Date().toISOString(),
        event_source_url: window.location.href,
        pixel_id: pixelId,
        user_data: {
          client_ip_address: '', // Would be set by backend
          client_user_agent: navigator.userAgent,
          fbc: getFbCookie('_fbc'),
          fbp: getFbCookie('_fbp')
        },
        ...utmParams,
        ...customData
      };

      // Send to backend
      await axios.post('/api/track-event', eventData);

      // Also track with Facebook Pixel (browser tracking)
      if (window.fbq) {
        window.fbq('track', eventName, customData);
      }

      console.log(`Event tracked: ${eventName}`, eventData);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const getFbCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  };

  const handleLeadClick = () => {
    trackEvent('Lead', {
      content_name: 'Lead Button Click',
      content_category: 'engagement'
    });
  };

  const handlePurchaseClick = () => {
    trackEvent('Purchase', {
      value: 99.99,
      currency: 'USD',
      content_name: 'Sample Product',
      content_category: 'ecommerce'
    });
  };

  const handleContactClick = () => {
    trackEvent('Contact', {
      content_name: 'Contact Form',
      content_category: 'engagement'
    });
  };

  const handleViewContent = () => {
    trackEvent('ViewContent', {
      content_name: 'Landing Page Content',
      content_category: 'engagement'
    });
  };

  return (
    <div className="container py-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4 animate-slide-up">
          🚀 Landing Page Demo
        </h1>
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.1s'}}>
          This page demonstrates Meta Pixel tracking and event capture with real-time analytics.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Pixel Status */}
        <Card variant={pixelId ? 'elevated' : 'outlined'} className="animate-slide-up" style={{animationDelay: '0.2s'}}>
          <Card.Body>
            <div className="flex items-center gap-4">
              <div className={`text-3xl ${pixelId ? 'animate-pulse' : ''}`}>
                {pixelId ? '🟢' : '🔴'}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-secondary-800 mb-1">
                  Meta Pixel Status
                </h3>
                {pixelId ? (
                  <div>
                    <StatusBadge variant="success" icon="✅">Active</StatusBadge>
                    <p className="text-sm text-secondary-600 mt-2 font-mono">
                      ID: {pixelId}
                    </p>
                  </div>
                ) : (
                  <div>
                    <StatusBadge variant="warning" icon="⚠️">Inactive</StatusBadge>
                    <p className="text-sm text-secondary-600 mt-2">
                      Please select a pixel ID in the Dashboard first.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* UTM Parameters */}
        <Card variant="elevated" className="animate-slide-up" style={{animationDelay: '0.3s'}}>
          <Card.Body>
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔍</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-secondary-800 mb-3">
                  UTM Parameters
                </h3>
                <div className="space-y-2">
                  {Object.entries(utmParams).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex items-center gap-2">
                        <StatusBadge variant="info" size="sm">
                          {key.replace('utm_', '')}
                        </StatusBadge>
                        <span className="text-sm text-secondary-600 font-mono">
                          {value}
                        </span>
                      </div>
                    )
                  ))}
                  {!Object.values(utmParams).some(Boolean) && (
                    <p className="text-sm text-secondary-500">
                      No UTM parameters detected
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Event Tracking Buttons */}
      <Card variant="elevated" className="mb-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
        <Card.Header>
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-800">
                Event Tracking Demo
              </h2>
              <p className="text-sm text-secondary-600">
                Click the buttons below to trigger different tracking events
              </p>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={handleLeadClick}
              variant="success"
              size="lg"
              icon={<span>🎯</span>}
              className="h-20 flex-col"
            >
              <span className="font-semibold">Generate Lead</span>
              <span className="text-xs opacity-80">Lead Event</span>
            </Button>

            <Button 
              onClick={handlePurchaseClick}
              variant="warning"
              size="lg"
              icon={<span>💰</span>}
              className="h-20 flex-col"
            >
              <span className="font-semibold">Make Purchase</span>
              <span className="text-xs opacity-80">Purchase Event</span>
            </Button>

            <Button 
              onClick={handleContactClick}
              variant="primary"
              size="lg"
              icon={<span>📞</span>}
              className="h-20 flex-col"
            >
              <span className="font-semibold">Contact Us</span>
              <span className="text-xs opacity-80">Contact Event</span>
            </Button>

            <Button 
              onClick={handleViewContent}
              variant="secondary"
              size="lg"
              icon={<span>👁️</span>}
              className="h-20 flex-col"
            >
              <span className="font-semibold">View Content</span>
              <span className="text-xs opacity-80">ViewContent Event</span>
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Instructions */}
      <Card variant="glass" className="animate-slide-up" style={{animationDelay: '0.5s'}}>
        <Card.Header>
          <div className="flex items-center gap-3">
            <div className="text-2xl">📋</div>
            <h2 className="text-xl font-semibold text-secondary-800">
              Testing Instructions
            </h2>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-secondary-800 mb-3">Setup Steps:</h3>
              <ol className="space-y-2 text-sm text-secondary-600">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Go to Dashboard and select a Facebook Pixel ID
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Add UTM parameters to this URL (e.g., ?utm_source=google&utm_medium=cpc)
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  Click the tracking buttons above to trigger events
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  Check Facebook Events Manager to see the events
                </li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-800 mb-3">What Gets Tracked:</h3>
              <ul className="space-y-2 text-sm text-secondary-600">
                <li className="flex items-center gap-2">
                  <StatusBadge variant="info" size="sm" icon="📊">Browser Events</StatusBadge>
                  <span>Facebook Pixel (client-side)</span>
                </li>
                <li className="flex items-center gap-2">
                  <StatusBadge variant="success" size="sm" icon="🔄">Server Events</StatusBadge>
                  <span>Conversions API (server-side)</span>
                </li>
                <li className="flex items-center gap-2">
                  <StatusBadge variant="warning" size="sm" icon="🎯">Lead Sources</StatusBadge>
                  <span>Automatic source detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <StatusBadge variant="primary" size="sm" icon="🔗">Deduplication</StatusBadge>
                  <span>Event ID matching</span>
                </li>
              </ul>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Landing;
