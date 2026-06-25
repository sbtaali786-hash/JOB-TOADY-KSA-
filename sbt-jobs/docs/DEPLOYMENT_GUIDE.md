# Deployment Guide for SBT Jobs

This guide provides step-by-step instructions for hosting the **SBT Jobs** portal free online.

---

## Deployment Option A: Netlify (Easiest & Recommended)
Netlify provides fast, reliable, and completely free hosting for static frontends.

1. Create a free account on [Netlify](https://www.netlify.com/).
2. Once logged in, go to the **Sites** tab.
3. Scroll down and locate the **"Drag and drop your site folder here"** area.
4. Drag the entire `sbt-jobs/` folder from your local computer and drop it into the browser window.
5. Wait ~10 seconds for mobilization. Your portal is now live with a secure `https://...netlify.app` URL!
6. (Optional) Go to **Site Settings** -> **Change Site Name** to configure a custom subdomain (e.g. `sbtjobs.netlify.app`).

---

## Deployment Option B: Vercel CLI / Drag-and-Drop
Vercel is an exceptional serverless platform perfect for static files.

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. If you have connected your GitHub account, select your repository and click **Deploy**.
4. If you are uploading local files, download Vercel CLI and run:
   ```bash
   npm i -g vercel
   vercel
   ```
5. Follow the command prompts (select default settings) to deploy immediately.

---

## Deployment Option C: GitHub Pages (Ideal for Open-Source)
If you manage your portal via a Git repository, you can host it directly on GitHub for free.

1. Create a new repository on [GitHub](https://github.com/) named `sbt-jobs`.
2. Push your `sbt-jobs/` project contents to the repository.
3. Inside your GitHub repository, click **Settings** (top bar).
4. Select **Pages** from the left-hand navigation sidebar.
5. Under **Build and deployment** -> **Branch**, select `main` (or `master`) and click **Save**.
6. Wait 1–2 minutes, and click the displayed link to see your live corporate portal!
