# Development

This guide provides instructions on how to set up and run the project locally.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/ncdai/chanhdai.com.git minimal-dev-portfolio
cd minimal-dev-portfolio
```

### 2. Install portless

Documentation: [port1355.dev](https://port1355.dev)

```bash
npm install -g portless
```

### 3. Install dependencies

```bash
pnpm i
```

### 4. Configure Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Then, update the necessary environment variables inside `.env.local`.

### 5. Run the development server

```bash
pnpm dev
```

The application should now be available at https://ncdai.localhost

## Building for Production

```bash
pnpm build
```

After building, start the application with:

```bash
NODE_ENV=production pnpm start
```

## Before pushing

CI runs these on every push and PR. Run them locally first:

```bash
pnpm lint
pnpm format:check
pnpm build
pnpm check-types
pnpm registry:validate
```

## Registry

This project utilizes **shadcn Registry**, which allows you to manage and distribute custom components, hooks, pages, and other files across multiple React projects. By hosting a registry, you can reuse UI components easily without manually copying code between projects.

### Using registry in other React projects

If you're working on a different React project and want to reuse the custom components from this repository, visit [chanhdai.com/components](https://chanhdai.com/components) for installation instructions and component documentation.

> Note: These components are compatible with [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4) and [React 19](https://react.dev/blog/2024/12/05/react-19).

### Registry configuration

Documentation: [shadcn registry docs](https://ui.shadcn.com/docs/registry)

Source files:

- `./src/registry`

Before using the registry, run the following command to build and generate the registry JSON files:

```bash
pnpm registry:build
```

When running the `npx shadcn add <registry-url>` command, the selected component will be automatically downloaded and integrated into your project.

## Screenshots

The site screenshots are captured locally, then published to Cloudflare R2.

```bash
pnpm capture       # Capture screenshots into .ncdai/screenshots
pnpm capture:sync  # Upload the folder to Cloudflare R2
```

`pnpm capture:sync` requires the `R2_*` variables from `.env.example`. It mirrors the local folder structure into the bucket (skipping dotfiles), overwriting existing files but never deleting remote ones.

## X avatars

X avatars (testimonials, team cards) are self-hosted on Cloudflare R2 at `https://assets.chanhdai.com/avatars/x/<username>.webp`. Use the lowercase username.

```bash
pnpm avatars:sync         # Re-fetch every avatar URL found in src/ and upload it to R2
pnpm avatars:sync shadcn  # Only the given usernames
```

It requires the `R2_*` variables from `.env.example`. After adding an avatar URL, sync just that username. Sync everything now and then to pick up avatar changes. A new avatar can return 404 for a few minutes after upload.

A failed avatar keeps its previous copy on R2. "Profile not found" usually means the user changed their handle, so update the URLs.
