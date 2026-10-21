server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # ============================================
    # CACHE VERSIONED VITE ASSETS
    # ============================================

    location /assets/ {
        try_files $uri =404;

        expires 1y;

        add_header Cache-Control "public, immutable";
    }

    # ============================================
    # DO NOT CACHE HTML
    # ============================================

    location = /index.html {
        add_header Cache-Control "no-cache, must-revalidate";

        try_files $uri =404;
    }

    # ============================================
    # REACT ROUTER SUPPORT
    # ============================================

    location / {
        try_files $uri $uri/ /index.html;
    }
}