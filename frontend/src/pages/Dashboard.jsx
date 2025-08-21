import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import StatusBadge from '../components/ui/StatusBadge';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [pixels, setPixels] = useState([]);
  const [selectedPixel, setSelectedPixel] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [crmMessage, setCrmMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      const res = await axios.get('/api/user', { withCredentials: true });
      setUser(res.data);
      if (res.data.selectedPixelId) {
        setSelectedPixel(res.data.selectedPixelId);
      }
    } catch (err) {
      setError('Could not fetch user data');
    }
  };

  const fetchPixels = async () => {
    try {
      const res = await axios.get('/api/user/pixels', { withCredentials: true });
      setPixels(res.data);
    } catch (err) {
      console.log('Pixel fetch error:', err.response?.data || err.message);
      
      // Handle specific error cases
      if (err.response?.status === 403 && err.response?.data?.error === 'MISSING_PERMISSIONS') {
        setMessage('Missing Facebook permissions. Please log out and log back in, then grant the requested permissions when Facebook asks.');
      } else if (err.response?.status === 400 && err.response?.data?.error === 'MISSING_TOKEN') {
        setMessage('Access token missing. Please log out and log back in.');
      } else {
        setMessage('Could not fetch Facebook Pixels automatically. You can manually enter your Pixel ID below.');
      }
      
      setPixels([]);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/track-event/events', { withCredentials: true });
      setEvents(res.data);
    } catch (err) {
      setError('Could not fetch tracked events');
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchPixels();
    fetchEvents();
  }, []);

  // Keep localStorage in sync for Landing page pixel injection
  useEffect(() => {
    if (user?.selectedPixelId) {
      try { localStorage.setItem('selectedPixelId', user.selectedPixelId); } catch (_) {}
    }
  }, [user]);

  const handleSavePixel = async () => {
    setSaveLoading(true);
    try {
      const res = await axios.post(
        '/api/user/savePixel',
        { pixelId: selectedPixel },
        { withCredentials: true }
      );
      setMessage(res.data.msg);
      try { localStorage.setItem('selectedPixelId', selectedPixel); } catch (_) {}
      // Refresh user data to show the newly selected pixel
      fetchUserData();
    } catch (err) {
      setError('Failed to save pixel ID');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSendToCrm = async (event) => {
    try {
      // For demonstration, using dummy name and contact. In a real app, you'd have forms for this.
      const leadData = {
        name: user.displayName || 'N/A',
        contact: user.email || 'N/A',
        source: event.leadSource || 'N/A',
        event_name: event.eventName,
      };

      const res = await axios.post('/api/track-event/send-to-crm', leadData, { withCredentials: true });
      setCrmMessage(res.data.msg);
      setTimeout(() => setCrmMessage(null), 3000); // Clear message after 3 seconds
    } catch (err) {
      console.error('Error sending to CRM:', err);
      setCrmMessage('Failed to send to CRM');
      setTimeout(() => setCrmMessage(null), 3000); // Clear message after 3 seconds
    }
  };

  const getLeadSourceBadge = (source) => {
    const sourceMap = {
      'Facebook': { variant: 'primary', icon: '📘' },
      'Instagram': { variant: 'warning', icon: '📷' },
      'WhatsApp': { variant: 'success', icon: '💬' },
      'Direct Website': { variant: 'default', icon: '🌐' },
      'Google': { variant: 'info', icon: '🔍' },
    };
    
    const config = sourceMap[source] || { variant: 'default', icon: '📍' };
    return <StatusBadge variant={config.variant} icon={config.icon}>{source}</StatusBadge>;
  };

  const getEventBadge = (eventName) => {
    const eventMap = {
      'PageView': { variant: 'info', icon: '👁️' },
      'ViewContent': { variant: 'primary', icon: '📄' },
      'Lead': { variant: 'success', icon: '🎯' },
      'Purchase': { variant: 'warning', icon: '💰' },
      'Contact': { variant: 'default', icon: '📞' },
    };
    
    const config = eventMap[eventName] || { variant: 'default', icon: '📊' };
    return <StatusBadge variant={config.variant} icon={config.icon}>{eventName}</StatusBadge>;
  };
  if (error) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <Card variant="elevated">
          <Card.Body>
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-error-600 mb-4">Error</h1>
              <p className="text-secondary-600">{error}</p>
              <Button 
                variant="primary" 
                className="mt-6"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <Card>
          <Card.Body>
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <h2 className="text-xl font-semibold text-secondary-700">Loading Dashboard...</h2>
              <p className="text-secondary-500 mt-2">Please wait while we fetch your data</p>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-secondary-800 mb-2">
              Dashboard
            </h1>
            <p className="text-lg text-secondary-600">
              Welcome back, <span className="font-semibold text-primary-600">{user.displayName}</span>
            </p>
          </div>
          {user.selectedPixelId && (
            <Card variant="glass" padding="sm">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <p className="text-sm text-secondary-600">Active Pixel</p>
                  <p className="font-mono text-sm font-semibold text-primary-600">
                    {user.selectedPixelId}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pixel Management Section */}
        <div className="lg:col-span-1">
          <Card variant="elevated" className="animate-slide-up">
            <Card.Header>
              <div className="flex items-center gap-3">
                <div className="text-2xl">⚙️</div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-800">
                    Pixel Management
                  </h2>
                  <p className="text-sm text-secondary-600">
                    Configure your Facebook Pixel
                  </p>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {pixels.length > 0 ? (
                <div className="space-y-4">
                  <Select
                    label="Select Facebook Pixel"
                    value={selectedPixel}
                    onChange={(e) => setSelectedPixel(e.target.value)}
                    placeholder="Choose a pixel..."
                  >
                    {pixels.map((pixel) => (
                      <option key={pixel.id} value={pixel.id}>
                        {pixel.name} ({pixel.id})
                      </option>
                    ))}
                  </Select>
                  <Button 
                    onClick={handleSavePixel} 
                    disabled={!selectedPixel}
                    loading={saveLoading}
                    variant="primary"
                    className="w-full"
                    icon={<span>💾</span>}
                  >
                    Save Selected Pixel
                  </Button>
                  {message && (
                    <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
                      <p className="text-success-700 text-sm font-medium">✅ {message}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg text-warning-700 text-sm">
                    {message || 'No Pixels found or permission missing. Paste a Pixel ID manually.'}
                  </div>
                  <Select
                    label="Select Facebook Pixel (if listed)"
                    value={selectedPixel}
                    onChange={(e) => setSelectedPixel(e.target.value)}
                    placeholder="Choose a pixel..."
                  >
                    <option value="">--</option>
                  </Select>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Or paste Pixel ID</label>
                    <input
                      type="text"
                      className="w-full border border-secondary-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      placeholder="e.g., 123456789012345"
                      value={selectedPixel}
                      onChange={(e) => setSelectedPixel(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleSavePixel} 
                    disabled={!selectedPixel}
                    loading={saveLoading}
                    variant="primary"
                    className="w-full"
                    icon={<span>💾</span>}
                  >
                    Save Pixel
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Events Section */}
        <div className="lg:col-span-2">
          <Card variant="elevated" className="animate-slide-up" style={{animationDelay: '0.1s'}}>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📊</div>
                  <div>
                    <h2 className="text-xl font-semibold text-secondary-800">
                      Tracked Events
                    </h2>
                    <p className="text-sm text-secondary-600">
                      {events.length} events tracked
                    </p>
                  </div>
                </div>
                {crmMessage && (
                  <div className="px-3 py-2 bg-primary-50 border border-primary-200 rounded-lg">
                    <p className="text-primary-700 text-sm font-medium">ℹ️ {crmMessage}</p>
                  </div>
                )}
              </div>
            </Card.Header>
            <Card.Body padding="none">
              {events.length > 0 ? (
                <Table hover>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Event</Table.HeaderCell>
                      <Table.HeaderCell>Time</Table.HeaderCell>
                      <Table.HeaderCell>Source</Table.HeaderCell>
                      <Table.HeaderCell>Lead Source</Table.HeaderCell>
                      <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {events.map((event) => (
                      <Table.Row key={event.eventId}>
                        <Table.Cell data-label="Event">
                          {getEventBadge(event.eventName)}
                        </Table.Cell>
                        <Table.Cell data-label="Time">
                          <div className="text-sm">
                            <div className="font-medium text-secondary-800">
                              {new Date(event.eventTime).toLocaleDateString()}
                            </div>
                            <div className="text-secondary-500">
                              {new Date(event.eventTime).toLocaleTimeString()}
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell data-label="Source">
                          <a 
                            href={event.eventSourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View Page →
                          </a>
                        </Table.Cell>
                        <Table.Cell data-label="Lead Source">
                          {getLeadSourceBadge(event.leadSource || 'Unknown')}
                        </Table.Cell>
                        <Table.Cell data-label="Actions">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendToCrm(event)}
                            icon={<span>📤</span>}
                          >
                            Send to CRM
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📈</div>
                  <h3 className="text-xl font-semibold text-secondary-700 mb-2">
                    No Events Yet
                  </h3>
                  <p className="text-secondary-500 mb-6">
                    Start tracking events by visiting your landing page and interacting with the tracking buttons.
                  </p>
                  <Button 
                    variant="primary"
                    onClick={() => window.location.href = '/landing'}
                    icon={<span>🚀</span>}
                  >
                    Go to Landing Page
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;