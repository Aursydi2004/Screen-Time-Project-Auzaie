# ScreenTime Hub

ScreenTime Hub is a front-end web application prototype for viewing screen-time activity, frequently used apps, and personal drafts. It was created as an individual project to demonstrate responsive web design and content organization.

## Features

- Demo sign-in page with invalid-credential feedback.
- ScreenTime Hub logo in the site navigation, sign-in page, and browser tab.
- Sign-in session checks for app pages and a working sign-out action.
- Responsive navigation linking the dashboard, frequently used apps, drafts, profile, and settings.
- Dashboard summary cards and category/app charts that update when tracked apps or drafts change.
- Frequently used apps table with categories, session counts, usage time, and frequency.
- Drafts and notes table with categories, update times, and statuses.
- Profile and application settings pages, including dark mode and a daily-limit warning.
- Add tracked apps and create drafts or notes; update profile and save preferences in browser storage.

## Test the login

This prototype uses hardcoded demo credentials and does not connect to a database.

- **Email:** `auzaie.rusydi2004@gmail.com`
- **Password:** `12345`

Entering different credentials displays an error message. Sign-in is a client-side demo only and is not secure authentication.

## Technologies

- HTML, CSS, and JavaScript
- Bootstrap 5.3.3
- ApexCharts

## Run locally

Open `index.html` in a browser, or serve the project through a local web server such as Laragon. With Laragon's default Apache configuration, the project URL is:

`http://localhost/Screen-time-project/`

## Deployment

This project includes a GitHub Actions workflow that publishes the static site to GitHub Pages whenever changes are pushed to the `main` or `master` branch.

1. Push the project files to a GitHub repository.
2. In the repository, open **Settings > Pages** and set the build and deployment source to **GitHub Actions**.
3. Push to `main` or `master`, or start the **Deploy static site to GitHub Pages** workflow from the **Actions** tab.
4. Open the Pages URL shown in the workflow deployment and test the site.

The site uses relative links and can be deployed from a repository subpath. No build step or package installation is required.

## Note

The app and usage figures shown in the tables and charts are sample prototype data. The interface does not currently collect real device screen-time data; the throughout-the-day and weekly charts remain illustrative.
Changes made through the app, drafts, profile, and settings pages are saved in the current browser using local storage and are not synced to other devices.
