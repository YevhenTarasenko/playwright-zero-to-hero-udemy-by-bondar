# Playwright: Web Automation Testing From Zero to Hero

**URL:** https://www.udemy.com/course/playwright-from-zero-to-hero/  
**Author:** Artem Bondar  
**Platform:** Udemy  
**Year:** 2025

This repository contains practical tasks from the course **Playwright: Web Automation Testing From Zero to Hero**. It covers topics such as:

- Installing Playwright
- Locators and element interaction
- API testing
- Page Object Model and test organization
- Advanced topics: Docker, mobile emulation, assertions

## Structure:

- **/tests**
    - **/.authSetup**
    - **/api**
    - **/web**
- **/src**
    - **/pages**
    - **/test-data**

## How to use:

1. Clone the repository with the test app:
    - Run: `git clone https://github.com/bondar-artem/pw-practice-app.git`
    - Navigate to the folder.
    - Run `npm install --force` to install dependencies.
    - Run `npm start` to run the app.

2. Create an empty folder for the automated tests:
    - Clone this repository with the automated tests.
    - Run `npm install` to install dependencies.
    - Run `npm start` to start the application.
    - Run the tests using `npx playwright test`.

        2.1 How to run using the docker:
        - Download and install docker from `https://www.docker.com/`.
        - Run docker on your local machine.
        - Run `docker build -t playwright-zero-to-hero-udemy-by-bondar .` to create docker image.
        - Run `docker run -it playwright-zero-to-hero-udemy-by-bondar` to run docker image.
        - Run `docker-compose up --build` to build and run tests at the same time.
