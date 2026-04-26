# GrowthPulse Digital

A responsive digital marketing landing page built with React, Vite, Tailwind CSS, Framer Motion, and Three.js.

## Features

- Full-screen marketing hero with animated 3D growth signal
- Dark and light mode toggle with saved preference
- Responsive navigation with mobile menu
- Service, proof, pricing, insight, FAQ, and audit request sections
- Structured content managed from `src/data/siteContent.js`
- Production-ready Vite build

## Tech Stack

- React 19
- Vite 6
- Tailwind CSS 4
- Framer Motion
- Three.js with React Three Fiber and Drei
- Lucide React icons

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  components/      Reusable UI and animation components
  data/            Site content, navigation, FAQ, schema, and service data
  App.jsx          Main page composition and theme state
  main.jsx         React entry point
  styles.css       Tailwind import and custom visual system
```

## Notes

The hero uses a lazy-loaded Three.js scene, so production builds may warn about a large visual chunk. This is expected for the animated 3D experience.
