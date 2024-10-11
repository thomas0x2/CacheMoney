FROM node:22-alpine AS base

WORKDIR /app


FROM base AS service

# Copy app source
COPY . /app

# Set startup command
CMD ["npm", "start"]

