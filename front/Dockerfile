FROM node:20-bullseye

WORKDIR /app

# Для Debian-based используйте apt вместо apk
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Или перейдите на Alpine если нужны apk команды
# FROM node:20-alpine
# RUN apk add --no-cache python3 make g++ linux-headers

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5173

CMD ["npm", "run", "dev"]