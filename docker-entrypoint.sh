#!/bin/sh
set -e

# Inject environment variables into a JS file dynamically
echo "window.env = {" > /usr/share/nginx/html/env.js
echo "  VITE_API_URL: '$(echo $VITE_API_URL)'," >> /usr/share/nginx/html/env.js
echo "};" >> /usr/share/nginx/html/env.js

echo "✅ Injected runtime env variables:"
cat /usr/share/nginx/html/env.js

# Start nginx
nginx -g "daemon off;"
