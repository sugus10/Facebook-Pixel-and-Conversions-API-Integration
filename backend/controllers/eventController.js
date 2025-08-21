const axios = require('axios');
const Event = require('../models/Event');
const User = require('../models/User');
const crypto = require('crypto');

// Helper function to send event to Facebook Conversions API
const sendEventToFacebook = async (pixelId, accessToken, eventData) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        data: [eventData],
      }
    );
    console.log('Facebook Conversions API Response:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error sending event to Facebook Conversions API:', err.response ? err.response.data : err.message);
    throw new Error('Failed to send event to Facebook Conversions API');
  }
};

// @desc    Track custom event
// @route   POST /api/track-event
exports.trackEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }

    const { eventName, eventTime, eventSourceUrl, utmSource, utmMedium, eventId, leadSource } = req.body;

    if (!eventName || !eventId) {
      return res.status(400).json({ msg: 'Event name and event ID are required' });
    }

    const user = await User.findById(req.user.id);

    if (!user || !user.selectedPixelId || !user.accessToken) {
      return res.status(400).json({ msg: 'User, selected pixel ID, or access token not found' });
    }

    const newEvent = new Event({
      userId: user._id,
      pixelId: user.selectedPixelId,
      eventName,
      eventTime: eventTime ? new Date(eventTime) : Date.now(),
      eventSourceUrl,
      utmSource,
      utmMedium,
      eventId,
      leadSource,
    });

    await newEvent.save();

    // Prepare event data for Facebook Conversions API
    const facebookEventData = {
      event_name: eventName,
      event_time: Math.floor(new Date(newEvent.eventTime).getTime() / 1000), // Unix timestamp
      action_source: 'website',
      event_source_url: eventSourceUrl,
      user_data: {
        client_ip_address: req.ip, // This might not be accurate if behind a proxy
        client_user_agent: req.headers['user-agent'],
        fbc: req.cookies._fbc, // Facebook click ID cookie
        fbp: req.cookies._fbp, // Facebook browser ID cookie
        em: user.email ? [crypto.createHash('sha256').update(user.email).digest('hex')] : undefined, // Hashed email
      },
      custom_data: {
        utm_source: utmSource,
        utm_medium: utmMedium,
      },
      event_id: eventId, // For deduplication
    };

    // Send to Facebook Conversions API
    await sendEventToFacebook(user.selectedPixelId, user.accessToken, facebookEventData);

    res.status(200).json({ msg: 'Event tracked successfully', event: newEvent });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all tracked events for the logged-in user
// @route   GET /api/track-event/events
exports.getEvents = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }

    const events = await Event.find({ userId: req.user.id }).sort({ eventTime: -1 });
    res.status(200).json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Send lead data to CRM
// @route   POST /api/send-to-crm
exports.sendToCrm = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }

    const { name, contact, source, event_name } = req.body;

    // For now, just log the data
    console.log('--- Sent to CRM ---');
    console.log('Name:', name);
    console.log('Contact:', contact);
    console.log('Source:', source);
    console.log('Event Name:', event_name);
    console.log('-------------------');

    res.status(200).json({ msg: 'Lead data sent to CRM (logged)' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
