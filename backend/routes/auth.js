
const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Auth with Facebook
// @route   GET /auth/facebook
// Request additional permissions needed to read ad accounts and pixels
// @desc    Auth with Facebook
// @route   GET /auth/facebook
// Request additional permissions needed to read ad accounts and pixels
router.get('/facebook', passport.authenticate('facebook', { 
  scope: ['email', 'public_profile', 'ads_management', 'business_management'] 
}));

// @desc    Facebook auth callback
// @route   GET /auth/facebook/callback
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard.
    res.redirect('http://localhost:3000/dashboard');
  }
);

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// @desc    Refresh Facebook access token
// @route   GET /api/auth/refresh-token
router.get('/refresh-token', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }

    // Facebook tokens are long-lived by default, but we can refresh if needed
    // For now, just return the current token status
    res.json({ 
      msg: 'Token is valid',
      hasToken: !!req.user.accessToken,
      userId: req.user.facebookId 
    });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ msg: 'Error refreshing token' });
  }
});

module.exports = router;
