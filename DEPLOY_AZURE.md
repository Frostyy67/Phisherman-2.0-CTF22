# Azure Hosting Guide for Phishermen 2.0

## 1. Application Architecture (Recommended for Azure)
- **Frontend**: Azure Static Web Apps (Free Tier is great).
- **Backend**: Azure App Service (Web App).
- **Database**: MongoDB Atlas (Free Tier) - already configured.

## 2. Backend Deployment (App Service)
1.  **Create App Service**:
    -   Runtime Stack: Node 20 LTS (or 18 LTS).
    -   Operating System: Linux.
2.  **Configuration (Environment Variables)**:
    -   Go to **Settings > Environment variables**.
    -   Add `ATLAS_URL`: *Your MongoDB Connection String*
    -   Add `JWT_SECRET`: *Your secret key*
    -   Add `FRONTEND_URL`: *The URL of your frontend (once deployed, see step 3)*.
    -   Add `REGISTERED_USERS`: *Your JSON user list* (Optional, copy from .env).
    -   Note: Azure automatically sets `PORT`, which our code now listens to.
3.  **Deploy**:
    -   Connect your GitHub repo or use VS Code Azure extension to deploy the `backend/` folder.
    -   **Important**: Ensure your deployment root is `backend/` or your start command runs `node backend/server.js` if deploying the root repo.

## 3. Frontend Deployment (Static Web Apps)
1.  **Create Static Web App**:
    -   Source: GitHub.
    -   Build Presets: **React**.
    -   App location: `/frontend`.
    -   Output location: `dist`.
2.  **Update Config**:
    -   Once deployed, you will get a URL (e.g., `https://calm-sea-012345.azurestaticapps.net`).
    -   **Update Backend CORS**: Go back to your Backend App Service settings and set `FRONTEND_URL` to this new URL.
    -   **Update Frontend Code**: 
        -   Open `frontend/src/config.js`.
        -   Change `API_BASE_URL` to your **Backend App Service URL** (e.g., `https://phisherman-backend.azurewebsites.net`).
        -   Commit and push. The Static Web App will auto-redeploy.

## 4. Verification
-   Visit your Frontend URL.
-   Open Console (F12).
-   If you see "CORS error", verify `FRONTEND_URL` matches exactly in backend settings (no trailing slash is safest).
-   If you see "Network Error", verify `config.js` points to the correct `https` backend URL.

## Troubleshooting
-   **Logs**: usage Azure App Service **Log Stream** to see real-time backend startup logs (e.g., "Connected to MongoDB").
-   **Cold Start**: The free tier sleeps after inactivity. The first request might take 10-20 seconds. This is normal.
