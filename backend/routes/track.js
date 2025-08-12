const express = require('express');
const router = express.Router();
const { trackEvent, getEvents, sendToCrm } = require('../controllers/eventController');

// Middleware to ensure user is authenticated
const ensureAuth = (req, res, next) => {
  if (req.user) {
    return next();
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

// @desc    Track custom event
// @route   POST /api/track-event
router.post('/', ensureAuth, trackEvent);

// @desc    Get all tracked events for the logged-in user
// @route   GET /api/track-event/events
router.get('/events', ensureAuth, getEvents);

// @desc    Send lead data to CRM
// @route   POST /api/send-to-crm
router.post('/send-to-crm', ensureAuth, sendToCrm);

module.exports = router;