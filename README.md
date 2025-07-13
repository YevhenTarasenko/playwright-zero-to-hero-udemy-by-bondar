# Playwright: Web Automation Testing From Zero to Hero

**Course URL:** https://www.udemy.com/course/playwright-from-zero-to-hero/  
**Author:** Artem Bondar  
**Platform:** Udemy  
**Year:** 2025

This repository contains practical tasks from the course **Playwright: Web Automation Testing From Zero to Hero**.

It covers topics such as:
- Installing Playwright
- Locators and element interaction
- API testing
- Page Object Model and test organization
- Advanced topics: Docker, mobile emulation, assertions

## Project Structure:

- `/pw-practice-app` – frontend application
- `/tests`
  - `/.authSetup` – authentication setup
  - `/api` – API tests
  - `/web` – UI tests
- `/src`
  - `/pages` – Page Object classes
  - `/test-data` – test data files

## How to Use

1. **Clone this repository:**
    - Open the terminal in an empty folder
    - Run `git clone https://github.com/YevhenTarasenko/playwright-zero-to-hero-udemy-by-bondar.git`
2. **Install frontend dependencies:**
    - Navigate to the `pw-practice-app` folder
    - Run `npm install --force`
3. **Install test dependencies:**
    - Go back to the main folder (`cd ..`)
    - Run `npm install --force`
    - Run tests using `npx playwright test`

## Running with Docker:

- Download and install Docker: https://www.docker.com/
- Start Docker on your machine
- Build the Docker image:  
  `docker build -t playwright-zero-to-hero-udemy-by-bondar .`
- Run the Docker container:  
  `docker run -it playwright-zero-to-hero-udemy-by-bondar`
- Or run everything with Docker Compose:  
  `docker-compose up --build`