import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/facebook';
  };

  return (
    <div className="container min-h-screen flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-2xl">
        <Card variant="elevated" className="animate-slide-up">
          <Card.Header>
            <div className="text-center">
              <div className="text-5xl mb-4">📈</div>
              <h1 className="text-3xl font-bold text-secondary-800">Sign in to PixelTracker</h1>
              <p className="text-secondary-600 mt-2">Connect Facebook to manage Pixels and track events</p>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleLogin} size="lg" icon={<span>📘</span>}>
                Continue with Facebook
              </Button>
              <Button variant="outline" size="lg" onClick={() => (window.location.href = '/') }>
                Back to Home
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Login;
