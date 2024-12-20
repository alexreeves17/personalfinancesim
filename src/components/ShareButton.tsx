import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import type { FinancialProfile, Allocation } from '../types/finance';
import { encodeShareableData } from '../utils/sharing/urlEncoder';

interface Props {
  profile: FinancialProfile;
  allocation: Allocation;
}

export function ShareButton({ profile, allocation }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareableData = encodeShareableData({ profile, allocation });
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${shareableData}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Financial Projection',
          text: 'Check out my 5-year financial projection!',
          url: shareUrl
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowTooltip(true);
      setTimeout(() => {
        setCopied(false);
        setShowTooltip(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </>
        )}
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded shadow-lg whitespace-nowrap">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
}