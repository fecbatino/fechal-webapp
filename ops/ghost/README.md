# Ghost Blog - Docker Stack

Dieses Verzeichnis enthalt die Docker-Compose-Konfiguration fur Ghost CMS (Blog).

## Deployment

```bash
# 1. Env-Datei erstellen
cp ops/ghost/.env.example /opt/stacks/web/ghost/.env
# Passworter setzen (z.B. openssl rand -base64 32)

# 2. Ghost-Stack starten
cd /opt/stacks/web
docker compose -f fechal-webapp/ops/ghost/docker-compose.yml up -d

# 3. Nginx Proxy Manager konfigurieren
# Domain: blog.fechal-batakpale.com
# Forward: ghost-blog:2368 (http)
# SSL: Cloudflare Full/Strict oder LetsEncrypt

# 4. Content API Key holen
docker exec ghost-db mysql -u ghost -p<PASS> ghost_prod \
  -e 'SELECT id, type, secret FROM api_keys WHERE type="content";'

# 5. Key ins fechal-webapp .env
GHOST_CONTENT_KEY=<secret>
GHOST_API_URL=https://blog.fechal-batakpale.com

# 6. fechal-webapp neubauen
cd /opt/stacks/web
docker compose build fechal-webapp
docker compose up -d fechal-webapp
```

## Hinweise

- MySQL 8 wird als separater Container genutzt (nicht die zentrale Postgres-DB)
- Ghost lauft auf Alpine (schlank)
- Beide Container sind im web-network fur NPM-Zugriff
- Nach dem ersten Start Ghost-Admin unter https://blog.fechal-batakpale.com/ghost einrichten
