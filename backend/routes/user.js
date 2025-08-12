
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');

// @desc    Get current user
// @route   GET /api/user
// @access  Private
router.get('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc    Get user's Facebook Pixels
// @route   GET /api/user/pixels
// @access  Private
router.get('/pixels', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Get ad accounts first
    const adAccountsResponse = await axios.get(
      `https://graph.facebook.com/v18.0/me/adaccounts?access_token=${req.user.accessToken}`
    );

    const pixels = [];
    
    // For each ad account, get pixels
    for (const account of adAccountsResponse.data.data) {
      try {
        const pixelsResponse = await axios.get(
          `https://graph.facebook.com/v18.0/${account.id}/owned_pixels?access_token=${req.user.accessToken}`
        );
        
        if (pixelsResponse.data.data) {
          pixels.push(...pixelsResponse.data.data);
        }
      } catch (err) {
        console.log(`Could not fetch pixels for account ${account.id}`);
      }
    }

    res.json(pixels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching pixels' });
  }
});

// @desc    Save selected pixel ID
// @route   POST /api/user/savePixel
// @access  Private
router.post('/savePixel', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { pixelId } = req.body;
    
    if (!pixelId) {
      return res.status(400).json({ msg: 'Pixel ID is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { selectedPixelId: pixelId },
      { new: true }
    );

    res.json({ msg: 'Pixel ID saved successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
