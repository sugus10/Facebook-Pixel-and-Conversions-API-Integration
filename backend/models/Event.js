const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true,
    unique: true
  },
  event_name: {
    type: String,
    required: true
  },
  event_time: {
    type: Date,
    required: true
  },
  event_source_url: {
    type: String,
    required: true
  },
  pixel_id: {
    type: String
  },
  utm_source: String,
  utm_medium: String,
  utm_campaign: String,
  utm_term: String,
  utm_content: String,
  user_data: {
    client_ip_address: String,
    client_user_agent: String,
    fbc: String,
    fbp: String
  },
  custom_data: mongoose.Schema.Types.Mixed,
  leadSource: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);
