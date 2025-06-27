# emoHub: Community-Driven Digital Platform to Grow emotional intalligence, Break isolation, and build resilence.

## Description

A comprehensive full-stack web application designed to foster emotional intelligence and resilience. This platform provides users with tools, resources, and interactive features to develop emotional awareness, build coping strategies, and connect with others

The platform combines evidence-based psychological principles with modern web technologies to create an engaging, supportive environment where users can:

- Access guided emotional intelligence assessments/ and exercises
- Participate in community discussions and support groups
- Access educational resources and interactive content
- Engage in mindfulness and wellness challenges

Built with modern web technologies including Next.js, TypeScript, and a robust PostgreSQL database, the platform ensures scalability, performance, and a seamless user experience across all devices.

## Repository

🔗 **GitHub Repository**: [[GitHub repository URL](https://github.com/Ruthuwamahoro/emoHub)]

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **React Query (TanStack Query)** - Data fetching and caching
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Primary database
- **Drizzle ORM** - Type-safe database toolkit
- **TypeScript** - Backend type safety

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks (if configured)

## Environment Setup

### Prerequisites

Before setting up the project, ensure that there is the following installed:

- **Node.js** (v18.0.0 or later)
- **npm** or **yarn** or **pnpm**package manager
- **PostgreSQL** (v14 or later)
- **Git**

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [https://github.com/Ruthuwamahoro/emoHub]
   cd emoHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL=your-database-url
   AUTH_GITHUB_ID="your-github-id"
   AUTH_GITHUB_SECRET="your-github-secret"
   JWT_SECRET="your secret key"
   CLOUDINARY_CLOUD_NAME=my-cloud-NAME
   CLOUDINARY_API_KEY=yourcloudinary-PI-KEY
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   SECRET_KEY=your-secret
    EMAIL_USER=your-email
    EMAIL_PASS=your-email-password
    NEXT_PUBLIC_APP_URL=next-url-password
   ```

4. **Database Setup**
   
   Create a PostgreSQL database:
   ```bash
   createdb emoHub
   ```
   
   Run database migrations:
   ```bash
   npm run migrate
   # or
   npm run db:migrate
   ```

   Run database demigrate:
   ```bash
   npm run demigrate
   # or
   npm run demigrate
   ```
   
   Seed the database (optional):
   ```bash
   npm run seed
   ```

5. **Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in browser.

### Database Schema Management

- **Generate migrations**: `npm run generate`
- **Push schema changes**: `npm run push`
- **View database**: `npm run studio`

### Code Quality

- **Lint code**: `npm run lint`
- **Format code**: `npm run format`
- **Type check**: `npm run type-check`

## Designs

### Figma Mockups
- **Design System**: [https://www.figma.com/design/zswZWeXtDOJhJgZ8L9M6eW/emoHub?node-id=213-3323&t=dfCZt1Zzf1TLLTcW-0]


### Screenshots

![Screenshot](./public/images/design/signuppage.png)
![Screenshot](./public/images/design/signinpage.png)
![Screenshot](./public/images/design/dashboard.png)
![Screenshot](./public/images/design/emotionentries.png)
![Screenshot](./public/images/design/todos.png)
![Screenshot](./public/images/design/resources.png)
![Screenshot](./public/images/design/singleresources-quiz.png)
![Screenshot](./public/images/design/design8.png)
![Screenshot](./public/images/design/allsavedresources.png)




## Deployment Plan

### Development Environment
- **Platform**: Local development
- **Database**: Local PostgreSQL instance
- **URL**: `http://localhost:3000`

### Staging Environment
- **Platform**: Vercel Preview
- **Database**: Hosted PostgreSQL (neon)
- **Purpose**: Testing before production

### Production Environment

- **Frontend & Backend**: **Vercel**
- **Database**: **neon**
- **File Storage**: **Cloudinary**
- **Analytics**: **Vercel Analytics**

#### Deployment Steps

1. **Database Setup**
   ```bash
   # Set up production database
   # Configure connection strings
   # Run migrations in production
   ```

2. **Environment Variables**
   ```bash
   # Configure production environment variables
   # Set up authentication secrets
   ```

3. **Deploy to Vercel**
   ```bash
   npm run build
   vercel --prod
   ```



### Security Considerations

- Environment variables properly configured
- Database connections secured
- HTTPS enforced in production
- Authentication tokens properly managed
- Regular security updates and patches

## Contributor

[Ruth Uwamahoro](https://github.com/Ruthuwamahoro)