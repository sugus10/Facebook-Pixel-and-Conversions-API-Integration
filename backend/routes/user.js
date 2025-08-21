
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

    if (!req.user.accessToken) {
      return res.status(400).json({ 
        msg: 'No access token available. Please log in again.',
        error: 'MISSING_TOKEN'
      });
    }

    // Try to get ad accounts first
    let adAccountsResponse;
    try {
      adAccountsResponse = await axios.get(
        `https://graph.facebook.com/v21.0/me/adaccounts?access_token=${req.user.accessToken}`
      );
    } catch (err) {
      console.log('Could not fetch ad accounts:', err.response?.data || err.message);
      
      // Check if it's a permissions error
      if (err.response?.status === 403) {
        return res.status(403).json({ 
          msg: 'Missing permissions. Please grant ads_read permission when logging in.',
          error: 'MISSING_PERMISSIONS',
          details: err.response.data
        });
      }
      
      // If user doesn't have ad accounts or permissions, return empty array
      return res.json([]);
    }

    const pixels = [];
    
    // For each ad account, get pixels
    if (adAccountsResponse.data && adAccountsResponse.data.data) {
      for (const account of adAccountsResponse.data.data) {
        try {
          const pixelsResponse = await axios.get(
            `https://graph.facebook.com/v21.0/${account.id}/owned_pixels?access_token=${req.user.accessToken}`
          );
          
          if (pixelsResponse.data.data) {
            pixels.push(...pixelsResponse.data.data);
          }
        } catch (err) {
          console.log(`Could not fetch pixels for account ${account.id}:`, err.response?.data || err.message);
        }
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
