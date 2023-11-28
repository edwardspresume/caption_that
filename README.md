# Image Caption Generator

This project is a web application that generates descriptive captions for images. It utilizes OpenAI's GPT-4 Vision model to craft the captions.

## Features

- Upload an image and receive a unique, descriptive caption.
- Provide context or themes to guide the generation of your caption.
- The application respects user privacy. Images uploaded are not saved on our servers and are only used for caption generation.

## Tech Stack

- SvelteKit
- TypeScript
- Tailwind CSS
- OpenAI

## Getting Started

1. Clone the repository.
2. Install the dependencies using `pnpm install`.
3. Create a `.env` file in the root directory and add your OpenAI API key as `SECRET_OPENAI_API_KEY`.
4. Run the development server using `pnpm run dev`.

## Scripts

The `package.json` file includes several scripts for development and deployment:

- `dev`: Starts the development server.
- `build`: Builds the application for production.
- `preview`: Previews the built application.
- `test`: Runs end-to-end and unit tests.
- `check`: Runs Svelte check and TypeScript sync.
- `lint`: Runs Prettier and ESLint.
- `format`: Formats the codebase using Prettier.

## Testing

The project uses Playwright for end-to-end testing and Vitest for unit testing. Configuration for Playwright can be found in `playwright.config.ts` and for Vitest in `vite.config.ts`.

## Code Structure

The main application code resides in the `src` directory. Utility functions and shared components are located in the `lib` directory. Server-side logic for handling requests is in the `routes` directory.

## Contributing

Feedback and contributions are welcome! If you encounter a bug or have a suggestion, please open an issue. For contributions, feel free to make a pull request.
