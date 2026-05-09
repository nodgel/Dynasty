// PM2 process manifest for Dynastica.
// Usage on the server:
//   npm ci --omit=dev=false        # install incl. devDependencies (needed for build)
//   npm run build                  # produces .next/
//   pm2 start ecosystem.config.js --env production
//   pm2 save                       # persist across reboots (after `pm2 startup` once)

module.exports = {
  apps: [
    {
      name: "dynasty",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3000 --hostname 127.0.0.1",
      // Cluster mode lets PM2 spread requests across CPU cores. Next.js is
      // stateless, so this is safe. Set to a fixed number on small VMs.
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      kill_timeout: 5000,
      // Bind only to loopback — Nginx is the only thing that should reach it.
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
      // PM2 logs default to ~/.pm2/logs/. Override here if you want them
      // co-located with the app (e.g. for log rotation by another tool).
      // error_file: "./logs/dynasty.err.log",
      // out_file:   "./logs/dynasty.out.log",
      merge_logs: true,
      time: true,
    },
  ],

  // Optional SSH-based deploy. Replace placeholders, then run:
  //   pm2 deploy ecosystem.config.js production setup     # one-time
  //   pm2 deploy ecosystem.config.js production            # subsequent deploys
  deploy: {
    production: {
      user: "ubuntu",
      host: ["dynastica.example.com"],
      ref: "origin/main",
      repo: "git@github.com:YOUR_ORG/Dynasty.git",
      path: "/var/www/dynasty",
      "pre-deploy-local": "",
      "post-deploy":
        "npm ci && npx prisma migrate deploy && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
