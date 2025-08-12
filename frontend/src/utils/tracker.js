import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const getUtmParameters = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source') || '';
  const utmMedium = urlParams.get('utm_medium') || '';
  return { utmSource, utmMedium };
};

const getLeadSource = (utmSource) => {
  const referrer = document.referrer;
  const currentUrl = window.location.href;

  if (referrer.includes('facebook.com')) {
    return 'Facebook';
  } else if (referrer.includes('instagram.com')) {
    return 'Instagram';
  } else if (currentUrl.includes('wa.me')) {
    return 'WhatsApp';
  } else if (utmSource) {
    return utmSource;
  } else {
    return 'Direct Website';
  }
};

export const trackEvent = async (eventName, customData = {}) => {
  try {
    const { utmSource, utmMedium } = getUtmParameters();
    const leadSource = getLeadSource(utmSource);
    const eventId = uuidv4();
    const eventTime = new Date().toISOString();
    const eventSourceUrl = window.location.href;

    const eventData = {
      eventName,
      eventTime,
      eventSourceUrl,
      utmSource,
      utmMedium,
      eventId,
      leadSource,
      ...customData,
    };

    const res = await axios.post('/api/track-event', eventData, { withCredentials: true });
    console.log(`Event '${eventName}' tracked successfully:`, res.data);
  } catch (error) {
    console.error(`Error tracking event '${eventName}':`, error.response ? error.response.data : error.message);
  }
};
