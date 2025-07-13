# Use official Playwright image
FROM mcr.microsoft.com/playwright:v1.54.1-jammy

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install Node dependencies for projects
RUN npm install --force && \
    cd pw-practice-app && npm install --force && \
    cd /app

# Run tests
CMD ["npm", "run", "pw-all-tests"]