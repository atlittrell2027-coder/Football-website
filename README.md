# Football Scoreboard (GitHub Pages-ready)

This repository is a GitHub Pages–ready package of the **Football Scoreboard** web app (originally from KeepTheScore). It is intended to be hosted as a static site (GitHub Pages) and used as a scoreboard displayed in OBS. The package preserves the original UI while removing account/upgrade elements and analytics trackers.

---

## What’s included
- `index.html` — Main app (controller/admin board).
- `Static/` — All static assets (CSS, JS bundles, fonts, images, `assets-sb/` chunks).
- Other static files included from the original upload.

## What I changed (minimal)
- Replaced visible branding from *KeepTheScore* → *Football Scoreboard*.
- Removed **Account** and **Upgrade to Pro** UI items.
- Removed analytics/tracker script tags and `email-decode.min.js` references.
- Patched absolute `/static/` and `/Static/` paths to relative `./Static/` paths so GitHub Pages can serve them.
- Ensured `Static/assets-sb/` (compiled helper chunks) are included so the Vue app can dynamically import them.

I **did not** remove any other UI or scoreboard logic; any features that require a backend (Firebase/uploads/remote sync) remain in the code but will not function on static hosting without server-side support.

---

## Deploy to GitHub Pages (step-by-step)

1. Create a new GitHub repository (e.g., `Football-website`).
2. Upload all files from this package to the repository root (use drag-and-drop or push with Git).
   - Ensure `index.html` is at the repository root.
3. In the repository, go to **Settings → Pages**.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Choose branch `main` (or `master` if that's your default).
   - For folder, choose `/ (root)`.
   - Click **Save**.
4. Wait ~1 minute, then visit the Pages URL shown (it will be `https://<yourusername>.github.io/<repo>/`).

---

## Using with OBS

- In OBS, add a **Browser Source**.
  - Use the Pages URL (e.g., `https://yourusername.github.io/Football-website/display.html` or `index.html` if you prefer).
  - Recommended resolution: `1920x1080` or whatever your scene requires.
  - Give the browser source enough width/height to show the scoreboard cleanly.
- You can control the scoreboard by opening `index.html` in a separate browser window (same machine) and interacting with the UI. Changes are reflected immediately in the display if both are on the same origin (GitHub Pages URL).

---

## Multi-device control (optional)
The original site used remote services for multi-device sync (Firebase). This static package preserves UI but not the backend. To enable true multi-device real-time control you can:

- Deploy a small Socket.IO server and modify the client to use it (I can provide a minimal server and instructions), or
- Use a hosted backend (Firebase) and provide config credentials (not included here).

---

## Customization & Troubleshooting

- If some fonts or icons still 404, check `Static/` and ensure `fonts` or `vendorbootstrap-iconsfont` directories exist in the uploaded repo. If missing, re-upload them from your original source.
- If dynamic imports (files under `Static/assets-sb/`) 404, ensure the entire `assets-sb` folder was included. Those are required by the Vue runtime to render subcomponents.
- If buttons appear but actions do nothing, open the browser console (DevTools → Console) and paste errors here — I will help patch them.
- To rebrand further, edit visible text in `index.html` or replace images in `Static/`.

---

## Support
If you publish the site and paste the Pages URL here, I will inspect it and fix any remaining 404s or console errors quickly.

---
