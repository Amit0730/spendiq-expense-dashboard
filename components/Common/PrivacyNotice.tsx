'use client';

import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyNotice: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-gray-800/80 py-8 text-center text-xs text-gray-500 light:border-gray-200 light:text-gray-400">
      <div className="mx-auto max-w-4xl px-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-emerald-400/90 light:text-emerald-700 font-medium">
          <Shield className="h-4 w-4" />
          <span>Local Device Privacy Guarantee</span>
        </div>
        <p className="max-w-xl text-[11px] leading-relaxed text-gray-400 light:text-gray-600">
          SpendIQ runs 100% in your browser. All transaction records, categories, and budget settings are preserved exclusively in your device&apos;s localStorage. No external database, tracking pixels, or third-party servers ever receive your financial information.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-500 light:text-gray-400 pt-1">
          <span>Zero Server Uploads</span>
          <span>•</span>
          <span>Zero Cookies Trackers</span>
          <span>•</span>
          <span>Client-Side CSV Export</span>
        </div>
      </div>
    </footer>
  );
};
