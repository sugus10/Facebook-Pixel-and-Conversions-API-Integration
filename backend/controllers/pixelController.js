const axios = require('axios');
const User = require('../models/User');

// @desc    Get Facebook Pixel IDs for the logged-in user
// @route   GET /api/user/pixels
exports.getPixels = async (req, res) => {
  try {
    // Ensure user is authenticated and has an accessToken
    if (!req.user || !req.user.accessToken) {
      return res.status(401).json({ msg: 'Not authorized, no access token' });
    }

    const accessToken = req.user.accessToken;
    const adAccounts = [];
    const pixelIds = [];

    // 1. Get ad accounts
    const adAccountsRes = await axios.get(
      `https://graph.facebook.com/v21.0/me/adaccounts?access_token=${accessToken}`
    );

    if (adAccountsRes.data && adAccountsRes.data.data) {
      adAccountsRes.data.data.forEach(account => {
        adAccounts.push(account.id);
      });
    }

    // 2. For each ad account, get owned pixels
    for (const accountId of adAccounts) {
      const pixelsRes = await axios.get(
        `https://graph.facebook.com/v21.0/act_${accountId}/owned_pixels?access_token=${accessToken}`
      );
      if (pixelsRes.data && pixelsRes.data.data) {
        pixelsRes.data.data.forEach(pixel => {
          pixelIds.push({ id: pixel.id, name: pixel.name });
        });
      }
    }

    res.json(pixelIds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Save selected Facebook Pixel ID for the logged-in user
// @route   POST /api/user/savePixel
exports.saveSelectedPixel = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { pixelId } = req.body;

    if (!pixelId) {
      return res.status(400).json({ msg: 'Pixel ID is required' });
    }

    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.selectedPixelId = pixelId;
    await user.save();

    res.json({ msg: 'Pixel ID saved successfully', selectedPixelId: user.selectedPixelId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
