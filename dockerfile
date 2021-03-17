FROM node:14-alpine

COPY . .

RUN npm ci && npm i -g typescript && npm run build && rm -rf src

CMD ["node", "-r", "dotenv/config", "dist/index.js"]