# ---- Stage: Run the Node.js backend ----
FROM node:18-alpine

WORKDIR /app

# Copy package files and install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy rest of backend code
COPY . .

# Expose your backend port (usually 8000 or 5000)
EXPOSE 8000

# Start the server
CMD ["npm", "start"]
