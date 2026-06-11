# Playwright / Browserless Docker-Integration
#
# Dieses Setup verbindet einen Headless-Browser (browserless/chrome)
# mit dem n8n-Container im web-network, sodass n8n-Workflows
# Webseiten rendern, Screenshots erstellen und PDFs generieren können.
#
# Verwendung im n8n-Workflow "HTTP Request" Node:
#   URL: http://browserless:3000/scrape
#   oder http://browserless:3000/screenshot
#   oder http://browserless:3000/pdf
#
# Siehe: https://docs.browserless.io/
#
# Deployment:
#   docker compose -f ops/playwright/docker-compose.yml up -d
#   (muss im selben Docker-Netzwerk wie n8n laufen: web-network)