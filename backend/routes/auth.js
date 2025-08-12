
const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Auth with Facebook
// @route   GET /auth/facebook
// Request additional permissions needed to read ad accounts and pixels
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

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

module.exports = router;
