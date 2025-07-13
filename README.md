# QR Tools Hub

A modern, professional, and visually rich QR Tools Hub web app built with React, TypeScript, and Vite. The app features a dynamic animated background, interactive heading, and a clean, extensible UI, ready for future QR-related tools.

---

## Features

- **Animated Background:** Customizable, animated grid background (`Squares`) with configurable speed, direction, border, and hover colors.
- **Interactive Heading:** Dynamic, animated heading using the `TextPressure` component with variable font properties and mouse interaction.
- **Modern Dock:** An animated, empty Dock at the bottom of the page, styled and ready for future tool shortcuts.
- **Theme Support:** Light and dark themes with a toggle (internally managed, ready for expansion).
- **TypeScript Codebase:** All main components and props are fully typed for reliability and maintainability.
- **CI/CD:** Automatic deployment to GitHub Pages via GitHub Actions.

---

## Directory Structure

```
qr-tools-hub/
├── Component/
│   ├── Dock.css           # Styles for the Dock component
│   ├── Dock.tsx           # Animated Dock component
│   ├── Squares.css        # Styles for the animated grid background
│   ├── Squares.tsx        # Animated grid background component
│   └── TextPressure.tsx   # Interactive, animated heading component
├── public/
│   └── vite.svg           # Vite logo (favicon)
├── src/
│   ├── App.css            # App-level styles
│   ├── App.tsx            # Main React app, integrates all features
│   ├── index.css          # Global styles
│   └── main.tsx           # React entry point
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions workflow for deployment
├── .gitignore             # Git ignore rules
├── eslint.config.js       # ESLint configuration
├── index.html             # Main HTML file
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation (this file)
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm (v9 or newer)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/shravan4507/qr-tools-hub.git
   cd qr-tools-hub
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Development
Start the development server with hot reload:
```sh
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build
To build the app for production:
```sh
npm run build
```
The output will be in the `dist/` directory.

### Preview Production Build
```sh
npm run preview
```

---

## Deployment
Deployment is automated via GitHub Actions. On every push to the `main` branch, the app is built and deployed to GitHub Pages at:

**https://shravan4507.github.io/qr-tools-hub/**

You can also deploy manually by pushing to `main`.

---

## Customization & Extensibility
- **Add QR Tools:** Place new React components for QR features in the `Component/` folder and integrate them in `App.tsx`.
- **Background:** Customize the grid background via the `Squares` component props in `App.tsx`.
- **Heading:** Adjust the `TextPressure` props for different heading effects.
- **Dock:** Add items to the Dock by updating the `items` array in `Component/Dock.tsx`.

---

## License
MIT
