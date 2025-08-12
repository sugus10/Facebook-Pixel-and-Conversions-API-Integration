import React from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/facebook';
  };

  return (
    <div className="container min-h-screen flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-secondary-800 mb-6 animate-slide-up">
            Facebook Pixel & 
            <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"> Conversions API</span>
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
            Track, analyze, and optimize your marketing campaigns with advanced Facebook Pixel integration, 
            server-side tracking, and comprehensive lead source detection.
          </p>
          <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Button 
              onClick={handleLogin} 
              size="lg"
              icon={<span>📘</span>}
            >
              Login with Facebook
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card hover className="animate-slide-up" style={{animationDelay: '0.3s'}}>
            <Card.Body>
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                  Pixel Management
                </h3>
                <p className="text-secondary-600">
                  Easily manage and configure your Facebook Pixels with an intuitive dashboard interface.
                </p>
              </div>
            </Card.Body>
          </Card>

          <Card hover className="animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Card.Body>
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                  Event Tracking
                </h3>
                <p className="text-secondary-600">
                  Track custom events with both browser-side and server-side implementation for maximum accuracy.
                </p>
              </div>
            </Card.Body>
          </Card>

          <Card hover className="animate-slide-up" style={{animationDelay: '0.5s'}}>
            <Card.Body>
              <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                  Lead Source Detection
                </h3>
                <p className="text-secondary-600">
                  Automatically detect and track lead sources from Facebook, Instagram, WhatsApp, and UTM parameters.
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* CTA Section */}
        <Card variant="glass" className="text-center animate-slide-up" style={{animationDelay: '0.6s'}}>
          <Card.Body>
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-secondary-600 mb-6">
              Connect your Facebook account and start tracking your marketing performance today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleLogin} size="lg" icon={<span>🚀</span>}>
                Get Started Now
              </Button>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Home;