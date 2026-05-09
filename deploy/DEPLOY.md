# Deploying Dynastica to Oracle Cloud (or any Ubuntu VM)

End-to-end walkthrough for a single VM running PostgreSQL, Node.js, PM2, and Nginx.

## 0. Provision

- Oracle Cloud → Ampere A1 or VM.Standard.E4 instance, Ubuntu 22.04 / 24.04.
- Open ingress on **22 (SSH)**, **80 (HTTP)**, **443 (HTTPS)** in the security list.
- Point your domain's A record at the VM's public IP.

## 1. System packages

```bash
sudo apt update
sudo apt install -y curl ca-certificates gnupg nginx postgresql postgresql-contrib

# Node.js 20 LTS via NodeSource (PM2 + Next.js 16 are happy on 20+).
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

sudo npm install -g pm2
```

## 2. PostgreSQL setup

```bash
sudo -u postgres psql <<'SQL'
CREATE USER dynasty WITH PASSWORD 'CHANGE_ME';
CREATE DATABASE dynasty OWNER dynasty;
GRANT ALL PRIVILEGES ON DATABASE dynasty TO dynasty;
SQL
```

In the app's `.env`:

```
DATABASE_URL="postgresql://dynasty:CHANGE_ME@127.0.0.1:5432/dynasty?schema=public"
NEXT_PUBLIC_SITE_URL="https://dynastica.example.com"
```

## 3. Deploy the app

```bash
sudo mkdir -p /var/www/dynasty && sudo chown $USER:$USER /var/www/dynasty
cd /var/www/dynasty
git clone https://github.com/YOUR_ORG/Dynasty.git .

npm ci
npx prisma migrate deploy   # applies prisma/migrations/* to the live DB
npm run db:seed             # optional — only if this is a fresh install
npm run build
```

## 4. Run with PM2

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd         # follow the printed instruction once, then:
pm2 save
```

`pm2 status` should show `dynasty` as **online** with N workers (one per core).

## 5. Wire up Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/dynastica
sudo sed -i 's/dynastica\.example\.com/your-real-domain.com/g' /etc/nginx/sites-available/dynastica
sudo ln -s /etc/nginx/sites-available/dynastica /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

## 6. TLS via Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-real-domain.com
```

Certbot rewrites the `ssl_certificate` paths in `nginx.conf` automatically and installs a cron-managed renewal timer. Verify with:

```bash
sudo systemctl list-timers | grep certbot
```

## 7. Subsequent deploys

From the project on the server:

```bash
git pull
npm ci
npx prisma migrate deploy
npm run build
pm2 reload ecosystem.config.js --env production   # zero-downtime rolling reload
```

Or, from your local machine, use PM2's SSH-based deploy (the `deploy:` block in `ecosystem.config.js`):

```bash
pm2 deploy ecosystem.config.js production
```

## Troubleshooting

| Symptom | Check |
|---|---|
| 502 Bad Gateway from Nginx | `pm2 logs dynasty` — app likely crashed or isn't bound to 127.0.0.1:3000 |
| Migrations fail | `DATABASE_URL` reachable from the VM? `psql "$DATABASE_URL" -c '\conninfo'` |
| Static assets 404 | Did `npm run build` complete? `ls .next/static/` should be populated |
| HTTPS doesn't renew | `sudo certbot renew --dry-run` |
