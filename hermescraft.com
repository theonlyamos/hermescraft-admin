server {
    listen 3000;
    listen [::]:3000;
    
    server_name hermescraft.com www.hermescraft.com;
    
    root /var/www/html/hermescraft;
    index index.html index.htm index.nginx-debian.html;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    charset utf-8;

    location / {

        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /shop;

    location ~ /\.(?!well-known).* {
        deny all;
    }

}
server {
    listen 3001;
    listen [::]:3001;
    
    root /var/www/html/hermescraft-admin;
    index index.html index.htm index.nginx-debian.html;

    server_name admin.hermescraft.com;

    location / {

        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

}

