// Debug script to help identify asset loading issues
(function() {
  console.log('Debug script loaded');
  
  try {
    // Report base URL and path info
    console.log('Document base URL:', document.baseURI);
    console.log('Location pathname:', window.location.pathname);
    
    // Log asset loading errors
    window.addEventListener('error', function(event) {
      if (event.target && (event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK')) {
        console.error('Asset loading error:', {
          type: event.target.tagName,
          src: event.target.src || event.target.href,
          id: event.target.id,
          error: event.error
        });
      }
    }, true);
    
    // Check if files are being served with correct MIME types
    function checkMimeType(url, expectedType) {
      fetch(url, {method: 'HEAD'})
        .then(response => {
          const contentType = response.headers.get('content-type');
          console.log(`MIME check: ${url} - ${contentType}`);
          if (!contentType || !contentType.includes(expectedType)) {
            console.error(`MIME type error: ${url} returned ${contentType} instead of ${expectedType}`);
          }
        })
        .catch(err => {
          console.error(`Failed to check MIME type for ${url}:`, err);
        });
    }
    
    // Wait for DOM to be fully loaded
    window.addEventListener('DOMContentLoaded', function() {
      // Check CSS files
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        checkMimeType(link.href, 'text/css');
      });
      
      // Check JS files
      document.querySelectorAll('script[src]').forEach(script => {
        checkMimeType(script.src, 'javascript');
      });
      
      console.log('Debug checks complete');
    });
  } catch (e) {
    console.error('Debug script error:', e);
  }
})();
