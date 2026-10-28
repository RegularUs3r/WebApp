# ---- Go tools (subfinder + ffuf) ----
FROM golang:1.27 AS tools
RUN go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@v2.6.6 \
 && go install -v github.com/ffuf/ffuf/v2@v2.1.0

# ---- Build the TypeScript ----
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci                      # needs lockfile — see note
COPY . .
RUN npm run build               # -> /app/dist

# ---- Runtime ----
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY frontend ./frontend
COPY backend/ai ./backend/ai
COPY --from=tools /go/bin/subfinder /usr/local/bin/subfinder
COPY --from=tools /go/bin/ffuf /usr/local/bin/ffuf
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*
USER node
RUN curl -fsSL https://claude.ai/install.sh | bash
ENV PATH="/home/node/.local/bin:$PATH"
EXPOSE 4242
CMD ["npm", "start"]