// Facebook Conversions API Integration
// This file handles server-side event tracking to Facebook

const FACEBOOK_PIXEL_ID = '1500839247611548';
const FACEBOOK_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN'; // You'll get this from Facebook

// Send event to Facebook Conversions API
export const sendFacebookConversionEvent = async (eventData) => {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${FACEBOOK_PIXEL_ID}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [eventData],
        access_token: FACEBOOK_ACCESS_TOKEN
      })
    });

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Facebook Conversion Event sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending Facebook Conversion Event:', error);
    return null;
  }
};

// Create event data for Facebook Conversions API
export const createFacebookEvent = (eventName, eventData = {}) => {
  return {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventData.eventId || generateEventId(),
    user_data: {
      em: eventData.email ? hashEmail(eventData.email) : undefined,
      ph: eventData.phone ? hashPhone(eventData.phone) : undefined,
      fn: eventData.firstName ? hashName(eventData.firstName) : undefined,
      ln: eventData.lastName ? hashName(eventData.lastName) : undefined,
      ct: eventData.city ? hashCity(eventData.city) : undefined,
      st: eventData.state ? hashState(eventData.state) : undefined,
      country: eventData.country ? hashCountry(eventData.country) : undefined,
      zp: eventData.zipCode ? hashZipCode(eventData.zipCode) : undefined,
    },
    custom_data: {
      content_name: eventData.productName,
      content_category: eventData.category,
      content_ids: eventData.productIds,
      value: eventData.value,
      currency: eventData.currency || 'MXN',
      num_items: eventData.quantity,
    },
    event_source_url: window.location.href,
    action_source: 'website'
  };
};

// Helper functions for hashing (required by Facebook for privacy)
const generateEventId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const hashEmail = (email) => {
  // In a real implementation, you'd use a proper hashing library
  // This is a simplified version for demonstration
  return btoa(email.toLowerCase().trim());
};

const hashPhone = (phone) => {
  // Remove all non-digits and hash
  const cleanPhone = phone.replace(/\D/g, '');
  return btoa(cleanPhone);
};

const hashName = (name) => {
  return btoa(name.toLowerCase().trim());
};

const hashCity = (city) => {
  return btoa(city.toLowerCase().trim());
};

const hashState = (state) => {
  return btoa(state.toLowerCase().trim());
};

const hashCountry = (country) => {
  return btoa(country.toLowerCase().trim());
};

const hashZipCode = (zipCode) => {
  return btoa(zipCode.toString().trim());
};

// Event types we'll track
export const FACEBOOK_EVENTS = {
  PAGE_VIEW: 'PageView',
  ADD_TO_CART: 'AddToCart',
  INITIATE_CHECKOUT: 'InitiateCheckout',
  PURCHASE: 'Purchase',
  VIEW_CONTENT: 'ViewContent',
  SEARCH: 'Search',
  ADD_TO_WISHLIST: 'AddToWishlist',
  LEAD: 'Lead',
  CONTACT: 'Contact'
};
