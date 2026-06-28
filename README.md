# Document Management System (DMS)

Welcome to the **Document Management System (DMS)**—a secure, lightweight, and modern web application designed for personal file cloud storage. Upload your files, organize them, stream media, and preview documents in-app securely.

Built with **Next.js (App Router)**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, and **AWS S3** object storage.

---

## Key Features

* Secure User Auth & Persistence:** Powered by **NextAuth.js** (Credentials Provider). Login states are persisted securely using encrypted HTTP-only session cookies.
* Dynamic Route Protection (Proxy):** Implemented using the latest Next.js **Proxy** architecture (`proxy.ts`). Automatically guards routes, blocking logged-out users from `/dashboard` or `/upload` and redirecting logged-in users away from authentication pages.
* On-Demand S3 Pre-signing:** Instead of generating URLs for every single file on page load (which causes heavy API latency), pre-signed S3 download URLs are generated **on-demand** only when you click "Download" or "Preview".
* Universal In-App Previews:** Preview files directly in your browser within a clean modal popup.
    *   **Images:** Rendered instantly.
    *   **Videos:** Natively streamed from S3 using browser-supported HTTP Range Requests (chunk-by-chunk buffering).
    *   **PDFs:** Opened inline inside a embedded viewport.
    *   **Text & JSON:** Fetched directly and rendered inside a scrollable, pre-formatted reader.
    *   *Unsupported files (e.g., `.zip` archives) show a download fallback action.*
* Drag-and-Drop Uploader:** Fully interactive drag-and-drop file upload zone supporting multi-file drops, size checks, and upload status feedback.
* Safe Deletion:** Remotely delete objects from S3 and clean up corresponding DB records synchronously.

---

## Technology Stack

*   **Frontend & Routing:** Next.js 16 (App Router), React 19, TypeScript
*   **Styling:** Tailwind CSS & Shadcn UI (Radix UI primitives, Lucide Icons)
*   **Database:** PostgreSQL (Hosted on Supabase)
*   **ORM:** Prisma ORM (Type-safe client queries)
*   **Object Storage:** AWS S3 (Using `@aws-sdk/client-s3`)
*   **Authentication:** NextAuth.js (JWT session strategy)

---

## Getting Started (Step-by-Step)

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v20.x or later recommended)
*   [PostgreSQL](https://www.postgresql.org/) database instance (or a free [Supabase](https://supabase.com/) project)
*   An [AWS S3 Bucket](https://aws.amazon.com/s3/) and an IAM user with `AmazonS3FullAccess` permissions.

---

### Installation & Setup

#### 1. Clone the repository
```bash
git clone https://github.com/uthayanmariraj/document-management-system
cd document-management-system
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure S3 CORS Policies (Critical for Previews)
Because the frontend makes direct `fetch` requests to your S3 bucket to show text/JSON file previews, you **must** allow Cross-Origin Resource Sharing (CORS).
1. Go to your **AWS S3 Console** and click on your bucket.
2. Select the **Permissions** tab.
3. Scroll down to **Cross-origin resource sharing (CORS)** and click **Edit**.
4. Paste the following JSON block and save:
```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "HEAD"
        ],
        "AllowedOrigins": [
            "http://localhost:3000"
        ],
        "ExposeHeaders": []
    }
]
```

#### 4. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Open `.env.local` and configure your credentials:
```env
# Database Connection (Supabase / Postgres)
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-32-character-secret" # Generate using: openssl rand -base64 32

# AWS S3 Configuration
AWS_REGION="ap-south-1"                  # Target AWS S3 Region
AWS_ACCESS_KEY_ID="AKIA..."              # IAM User Access Key
AWS_SECRET_ACCESS_KEY="MnlJ..."          # IAM User Secret Key
S3_BUCKET_NAME="dms-mumbai-bucket-uthayan" # S3 Bucket name (No trailing spaces!)
```

#### 5. Synchronize the Database Schema
Deploy the database schema tables to your fresh PostgreSQL/Supabase database:
```bash
npx prisma db push
```

#### 6. Test S3 Connection
Before launching the server, run the built-in diagnostic script to verify S3 permissions, listing, and uploading:
```bash
node test_s3.js
```
If you see `Success! Dummy file uploaded successfully!`, your S3 keys are correctly linked.

#### 7. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/            # API Route endpoints (files, upload, delete, download)
│   │   ├── dashboard/      # Main Dashboard View page
│   │   ├── upload/         # Drag-and-Drop file uploader page
│   │   ├── login/          # User login credentials page
│   │   └── register/       # Signup credentials page
│   ├── components/         # Modular elements (PreviewModal, input elements, etc.)
│   ├── lib/                # Database clients, S3 initializers, and Auth logic
│   └── proxy.ts            # Client routing guard & request interceptor
├── prisma/
│   └── schema.prisma       # Database tables schema definition
├── test_s3.js              # S3 diagnostic check script
└── .env.local              # Local secrets (ignored in git)
```

---

## License

Licensed under the [MIT License](LICENSE).
