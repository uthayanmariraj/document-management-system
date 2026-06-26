# Document Management System (DMS)

A secure, modern, and responsive Document Management System built with Next.js, Prisma, PostgreSQL, and AWS S3.

## Features

- **User Authentication**: Secure user registration and login powered by NextAuth.js.
- **Dashboard**: A clean user interface to view and manage uploaded files.
- **File Uploads**: Direct integration with AWS S3 for reliable file storage.
- **Database Access**: PostgreSQL integration with Prisma ORM for type-safe database queries.
- **Modern Tech Stack**: Built with Next.js (App Router), TypeScript, TailwindCSS, and Shadcn UI.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Object Storage**: [AWS S3](https://aws.amazon.com/s3/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or later)
- [PostgreSQL](https://www.postgresql.org/) database instance
- An [AWS S3](https://aws.amazon.com/s3/) Bucket and IAM User credentials

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd document-management-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and configure the values:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and update the placeholders with your actual secrets, including:
   - `DATABASE_URL` (Supabase or local PostgreSQL connection string)
   - `NEXTAUTH_SECRET` (Use `openssl rand -base64 32` to generate one)
   - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `S3_BUCKET_NAME` for S3 uploads.

4. **Initialize the Database**:
   Run the Prisma migration to create the tables in your database:
   ```bash
   npx prisma db push
   ```

5. **Test AWS S3 Connection (Optional)**:
   You can verify your AWS S3 configurations by running the test script:
   ```bash
   node test_s3.js
   ```

6. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## Project Structure

```text
├── src/
│   ├── app/            # Next.js pages and API routes
│   ├── components/     # Reusable React components
│   ├── lib/            # Shared utilities (DB clients, S3 configuration, etc.)
│   ├── types/          # TypeScript interface definitions
│   └── middleware.ts   # Route protection and authentication checks
├── prisma/
│   ├── schema.prisma   # Database schema definitions
│   └── migrations/     # Prisma database migration history
├── public/             # Static assets
├── test_s3.js          # S3 connection verification script
└── .env.example        # Environment variable template
```

---

## License

This project is licensed under the MIT License.
