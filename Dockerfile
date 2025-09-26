FROM node:20-alpine

WORKDIR /app

# Install build dependencies (needed for bcrypt, argon2, etc.)
RUN apk add --no-cache python3 make g++ libc6-compat

COPY package*.json ./

# Use npm ci if lockfile exists, otherwise npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
