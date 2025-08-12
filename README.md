# Facebook Pixel and Conversions API Integration

This project demonstrates a full-stack application integrating Facebook Pixel for browser-side tracking and Facebook Conversions API for server-side event tracking, including lead source detection and a basic CRM integration.

## Features

-   **Facebook Login:** Authenticate users via Facebook OAuth.
-   **Facebook Pixel Management:**
    -   Fetch and display available Facebook Pixel IDs for the logged-in user.
    -   Allow users to select and save a primary Pixel ID.
-   **Meta Pixel Injection:** Dynamically injects the Meta Pixel base code on a sample landing page using the stored Pixel ID.
-   **Custom Event Tracking (Browser & Server-Side):**
    -   Tracks `PageView` and `ViewContent` events on the landing page.
    -   Allows triggering custom events like `Lead`, `Purchase`, and `Contact`.
    -   Events are sent to both the browser-side Facebook Pixel and the server-side Facebook Conversions API for deduplication.
-   **Lead Source Detection:** Automatically detects lead source based on:
    -   `document.referrer` (Facebook, Instagram)
    -   URL parameters (`wa.me` for WhatsApp)
    -   `utm_source` parameter.
    -   Defaults to "Direct Website" if no other source is detected.
-   **Tracked Events Dashboard:** Displays a list of all tracked events for the logged-in user, including their detected lead source.
-   **Basic CRM Integration:**
    -   An API endpoint `/api/send-to-crm` that logs lead data (name, contact, source, event_name).
    -   A "Send to CRM" button on the Dashboard for each event to trigger this endpoint.

## Setup Instructions

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (local or cloud-hosted like MongoDB Atlas)
-   Facebook Developer Account with a Facebook App and a Facebook Pixel.

### 1. Clone the Repository

```bash
git clone <repository_url>
cd Fb
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

#### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
SESSION_SECRET=a_long_random_string_for_session_secret
```

-   `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/fb_pixel_crm` or your MongoDB Atlas URI).
-   `FACEBOOK_APP_ID`: Your Facebook App ID from your Facebook Developer App Dashboard.
-   `FACEBOOK_APP_SECRET`: Your Facebook App Secret from your Facebook Developer App Dashboard.
-   `SESSION_SECRET`: A strong, random string for Express session encryption.

#### Install Dependencies

```bash
npm install
```

#### Run the Backend

```bash
npm run dev
```

The backend server will typically run on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
```

#### Install Dependencies

```bash
npm install
```

#### Run the Frontend

```bash
npm run dev
```

The frontend development server will typically run on `http://localhost:3000`.

## User Guide

### 1. Login with Facebook

1.  Open your browser and go to `http://localhost:3000`.
2.  Click on the "Login with Facebook" button.
3.  You will be redirected to Facebook for authentication. Authorize the application.
4.  Upon successful login, you will be redirected to the Dashboard.

### 2. Manage Facebook Pixels (Dashboard)

1.  On the Dashboard (`http://localhost:3000/dashboard`), you will see a section to manage Facebook Pixels.
2.  If your Facebook account has associated ad accounts and pixels, they will be listed in a dropdown.
3.  Select a Pixel ID from the dropdown and click "Save Selected Pixel". This pixel will be used for server-side tracking and dynamic injection on the landing page.

### 3. Trigger Custom Events (Landing Page)

1.  Navigate to the Landing Page (`http://localhost:3000/landing`).
2.  The Meta Pixel base code will be dynamically injected, and a `PageView` event will fire.
3.  A `ViewContent` event will also be automatically tracked when the page loads.
4.  Click on the "Track Lead", "Track Purchase", and "Track Contact" buttons to trigger these custom events.
5.  Observe your browser's developer console for messages indicating successful event tracking.

### 4. View Tracked Events and Send to CRM (Dashboard)

1.  Go back to the Dashboard (`http://localhost:3000/dashboard`).
2.  Scroll down to the "Tracked Events" section. You will see a table listing all events tracked for your user, including the detected lead source.
3.  For each event, there is a "Send to CRM" button. Click this button to simulate sending the lead data to a CRM system. For now, this action will log the lead data in your backend server's console.

## Testing and Verification

### Facebook Events Manager

To verify that events are being received by your Facebook Pixel and Conversions API:

1.  Go to your Facebook Events Manager ([https://business.facebook.com/events_manager/](https://business.facebook.com/events_manager/)).
2.  Select your Pixel.
3.  Go to the "Test Events" tab.
4.  As you interact with the frontend (visit landing page, click buttons), you should see events appearing here.
5.  Pay attention to the "Deduplication" status. Events sent via both browser and server-side should show as deduplicated.

### Lead Source Verification

To test different lead sources:

-   **Direct:** Access `http://localhost:3000/landing` directly.
-   **UTM Parameters:** Access `http://localhost:3000/landing?utm_source=google&utm_medium=cpc`.
-   **WhatsApp:** Access `http://localhost:3000/landing?wa.me=1234567890`.
-   **Facebook/Instagram Referrer:** You would need to simulate a click from a Facebook or Instagram link. For example, create a simple HTML file with a link like `<a href="http://localhost:3000/landing" referrer="https://www.facebook.com">Go to Landing Page</a>` and open it in your browser, then click the link.

### CRM Integration Verification

-   After clicking "Send to CRM" on the Dashboard, check the console output of your running backend server. You should see the logged lead data.
