# Daily Bread

Daily Bread is a frontend-only ESV reading dashboard built with React and Vite. It fetches passages from the Crossway ESV API, calculates the current reading day based on a start date, and stores progress locally.

## Features

- Date-based reading day calculation
- Local persistence for start date and completed days
- ESV passage rendering via the Crossway API

## Setup

1. Create a Crossway developer account and generate an API key.
2. Create a local .env file (see .env.example) and add:

	VITE_ESV_API_KEY=your_api_key_here
	VITE_BASE_PATH=/

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

## ESV copyright notice

Scripture quotations are from The Holy Bible, English Standard Version® (ESV®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.