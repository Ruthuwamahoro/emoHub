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
   
   Seed the database (optional):
   ```bash
   npm run db:seed
   ```

5. **Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

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
- **Design System**: [Insert Figma link to design system]
- **User Interface Mockups**: [Insert Figma link to UI mockups]
- **User Flow Diagrams**: [Insert Figma link to user flows]

### Architecture Diagrams
- **System Architecture**: [Insert link to system architecture diagram]
- **Database Schema**: [Insert link to database ERD]
- **API Structure**: [Insert link to API documentation]

### Screenshots

#### Dashboard Interface
![Dashboard Screenshot](./docs/images/dashboard-screenshot.png)
*Main user dashboard showing emotional intelligence metrics and community activity*

#### Assessment Module
![Assessment Screenshot](./docs/images/assessment-screenshot.png)
*Interactive emotional intelligence assessment interface*

#### Community Forum
![Community Screenshot](./docs/images/community-screenshot.png)
*Community discussion and support group interface*

#### Mobile Responsive Design
![Mobile Screenshots](./docs/images/mobile-screenshots.png)
*Mobile-optimized interface across different screen sizes*

> **Note**: Add actual screenshots to the `docs/images/` directory and update the paths accordingly.

## Deployment Plan

### Development Environment
- **Platform**: Local development
- **Database**: Local PostgreSQL instance
- **URL**: `http://localhost:3000`

### Staging Environment
- **Platform**: Vercel/Netlify Preview
- **Database**: Hosted PostgreSQL (Supabase/PlanetScale)
- **URL**: `https://staging-community-ei.vercel.app`
- **Purpose**: Testing and QA before production

### Production Environment

#### Recommended Deployment Stack
- **Frontend & Backend**: **Vercel** (recommended for Next.js)
- **Database**: **Supabase** or **PlanetScale**
- **File Storage**: **Cloudinary** or **AWS S3**
- **Monitoring**: **Sentry** for error tracking
- **Analytics**: **Vercel Analytics** or **Google Analytics**

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
   # Configure external API keys
   ```

3. **Deploy to Vercel**
   ```bash
   npm run build
   vercel --prod
   ```

4. **Domain Configuration**
   - Set up custom domain
   - Configure SSL certificates
   - Set up redirects if needed

#### Alternative Deployment Options

- **Docker**: Containerized deployment
- **AWS**: EC2 with RDS PostgreSQL
- **Railway**: Full-stack deployment platform
- **DigitalOcean**: App Platform deployment

### Monitoring & Maintenance

- **Performance Monitoring**: Vercel Analytics
- **Error Tracking**: Sentry integration
- **Database Monitoring**: Built-in database metrics
- **Uptime Monitoring**: StatusPage or similar service

### Security Considerations

- Environment variables properly configured
- Database connections secured
- HTTPS enforced in production
- Authentication tokens properly managed
- Regular security updates and patches

## Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

---

For questions or support, please open an issue on GitHub or contact the development team.