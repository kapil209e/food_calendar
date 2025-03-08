'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = document.cookie.includes('cookie-consent=true');
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    // Set cookie consent for 1 year
    document.cookie = 'cookie-consent=true;max-age=31536000;path=/';
    setShowConsent(false);
    // Reload to initialize analytics
    window.location.reload();
  };

  const declineCookies = () => {
    // Set cookie consent as false
    document.cookie = 'cookie-consent=false;max-age=31536000;path=/';
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-600 text-sm">
          We use cookies to improve your experience and analyze site usage.
        </p>
        <div className="flex gap-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
} 