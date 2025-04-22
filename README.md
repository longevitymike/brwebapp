# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/22bc3938-d0b1-4998-b541-e906ed4cf28d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/22bc3938-d0b1-4998-b541-e906ed4cf28d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Option 1: Deploy with Lovable
Simply open [Lovable](https://lovable.dev/projects/22bc3938-d0b1-4998-b541-e906ed4cf28d) and click on Share -> Publish.

### Option 2: Deploy with Vercel
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel](https://vercel.com/) and sign up or log in
3. Click "Add New" and select "Project"
4. Import your Git repository
5. Configure your project:
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
6. Click "Deploy"

For debugging production issues:
1. Enable source maps in vite.config.ts:
   ```js
   build: {
     sourcemap: true,
     // other options...
   }
   ```
2. Use Chrome DevTools to inspect errors in production builds

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
