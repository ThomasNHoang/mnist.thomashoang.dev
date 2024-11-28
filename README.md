# MNIST Neural Network Project Overview

Next.js application that implements a neural network for digit recognition using the MNIST dataset.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Core Components](#core-components)
- [Technologies Used](#technologies-used)

## Project Structure

- `app/`: Contains the main application files (layout, page, global styles)
- `components/`: React components for the user interface
  - `ui/`: Reusable UI components by Shadcn/ui (buttons, cards, dialogs, etc.)
  - Custom components for the neural network interface
- `lib/`: Utility function by Shadcn/ui
- Configuration files: Next.js, TypeScript, Tailwind CSS, ESLint, etc.

## Key Features

1. **Neural Network Implementation**: The project includes a custom implementation of a neural network for digit recognition.

2. **Interactive User Interface**: Components like `PixelInput` and `MNISTOutput` provide an interactive way for users to draw digits and see predictions.

3. **Multiple Model Support**: The application supports multiple trained models, allowing users to compare different versions.

4. **Responsive Design**: The UI is built with responsiveness in mind, using Tailwind CSS for styling.

5. **Accessibility**: The project includes accessibility features, such as proper ARIA attributes and keyboard navigation.

6. **Performance Optimization**: The code includes optimizations like memoization and efficient rendering techniques.

## Core Components

- `Interface`: The main component that combines the drawing input and prediction output.
- `PixelInput`: Allows users to draw digits on a canvas.
- `MNISTOutput`: Displays the neural network's predictions and probabilities.
- `ProbabilityChart`: Visualizes the prediction probabilities.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts (for data visualization)
- Shadcn UI (for UI components)
- Custom neural network implementation
