# CRM System

A comprehensive Customer Relationship Management (CRM) solution designed for sales teams. This platform integrates contact management, sales tracking, and real-time communication capabilities to optimize business workflows.

## Key Features

*   **Contact Management:** Manage and organize customer profiles and lead information.
*   **Sales Tracking:** Create, monitor, and update sales orders with statuses.
*   **Real-time Updates:** Utilizes **SignalR** to push live order updates and system changes to all connected clients instantly.
*   **Twilio Integration:** Perform direct customer outreach via integrated telephony services.
*   **Interactive UI:** Modern Angular frontend featuring interactive dashboards, dynamic modals, and responsive design.
*   **Aggregate Analytics:** Visualize daily and monthly performance metrics for individual users and the entire team.

## Getting Started with Docker Compose

The application is containerized and designed to run entirely via Docker, requiring no manual installation of SDKs or databases on your host machine.

### Prerequisites
* [Docker Desktop](https://www.docker.com/) (includes Docker Engine and Docker Compose).

### Running the System
1. Create your own `.env` file in the project root based on the `.env.example` structure.
2. From the project root, launch the services:
   ```bash
   docker compose up --build
   ```
3. Once running, access the web interface at `http://localhost:80`.

---

## Configuration (`.env`)

You **must** configure the `.env` file before launching. Below are the required variables:

### Database
* `DB_PASSWORD`: The strong password for the SQL Server SA account.

### Security (JWT)
* `JWT_KEY`: A high-entropy string used to sign authentication tokens. Change this to a unique, secret key.
* `JWT_ISSUER`: The identifier of the authentication authority.
* `JWT_AUDIENCE`: The identifier of the client consuming the API.

### Twilio Integration
* `TWILIO_ACCOUNT_SID`: Found in your Twilio console dashboard.
* `TWILIO_AUTH_TOKEN`: Found in your Twilio console dashboard.
* `TWILIO_API_KEY`: A specific API key SID for your account.
* `TWILIO_API_SECRET`: The corresponding secret for your API key.
* `TWILIO_TWIML_APP_SID`: The SID of your TwiML application.

### Application Settings
* `ALLOWED_ORIGINS`: The origin permitted to communicate with the API (e.g., `http://localhost:80`).
* `SEED_PASSWORD`: The default password used for initial user seeding.

---

## Architecture Overview

*   **Backend:** ASP.NET Core 8 Web API.
*   **Frontend:** Angular (SPA) with TypeScript.
*   **Database:** SQL Server (running in container).
*   **Communication:** SignalR for real-time WebSocket connectivity.
*   **External Services:** Twilio REST & Voice APIs.

---

