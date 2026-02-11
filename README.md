# Daily Bread

Daily Bread is a frontend-only ESV reading dashboard powered by the Crossway ESV API. It fetches passages for the current day based on a start date and stores your progress in localStorage.

## Setup

1. Register for a Crossway developer account and generate an ESV API key.
2. Create a local .env file (see .env.example) and add your key:

	- VITE_ESV_API_KEY=your_key_here
	- VITE_BASE_PATH=/

3. Install dependencies:

	npm install

4. Start the dev server:

	npm run dev

## Build

Build for production:

  npm run build

Preview the production build:

  npm run preview

## GitHub Pages base path

When deploying to GitHub Pages, set VITE_BASE_PATH to your repository name with leading and trailing slashes (for example, /daily-bread/).

## Reading plan data

Update the reading plan data in src/data/readingPlan.js to match your desired daily references.
