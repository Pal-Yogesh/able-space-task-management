# AbleSpace Task Management System

A modern, collaborative task management application built with Next.js 16, featuring real-time updates, user authentication, and a beautiful UI powered by Radix UI and Tailwind CSS.

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- ✅ **Task Management** - Create, read, update, and delete tasks with ease
- 👥 **User Assignment** - Assign tasks to team members
- 🎯 **Task Filtering** - Filter tasks by status, priority, and assignee
- 📊 **Task Priorities** - Organize tasks with low, medium, and high priority levels
- 🔄 **Status Tracking** - Track tasks through pending, in-progress, and completed states
- 🎨 **Modern UI** - Beautiful, responsive interface built with Radix UI components
- 🌙 **Dark Mode** - Theme support for comfortable viewing
- 🔔 **Real-time Updates** - Socket.io integration for live collaboration (configurable)

## 🚀 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Socket.io Client** - Real-time communication

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Neon PostgreSQL** - Serverless Postgres database
- **Jose** - JWT authentication
- **bcryptjs** - Password hashing
- **Zod** - Schema validation
- **Socket.io** - Real-time server

### UI Components
- Form validation with React Hook Form
- Toast notifications with Sonner
- Date picker with React Day Picker
- Charts with Recharts
- Resizable panels
- Command menu (cmdk)
- And many more...

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ablespace-task-mgmt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=your_neon_database_url
   JWT_SECRET=your_secure_jwt_secret_key
   ```

4. **Initialize the database**
   
   Run the SQL scripts to set up your database schema:
   ```bash
   # Connect to your database and run:
   # 1. scripts/01-create-tables.sql - Creates tables and indexes
   # 2. scripts/02-seed-data.sql - (Optional) Seed initial data
   # 3. scripts/03-test-data.sql - (Optional) Test data
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ablespace-task-mgmt/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── tasks/           # Task CRUD operations
│   │   ├── users/           # User management
│   │   └── socket/          # Socket.io integration
│   ├── dashboard/           # Dashboard page
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── dashboard-client.tsx # Main dashboard component
│   ├── task-card.tsx        # Task card display
│   ├── task-form.tsx        # Task create/edit form
│   ├── task-list.tsx        # Task list with real-time updates
│   └── ...                  # Auth forms and other components
├── lib/                     # Utility libraries
│   ├── auth.ts             # Authentication helpers
│   ├── db.ts               # Database connection and types
│   ├── session.ts          # Session management
│   ├── socket.ts           # Socket.io client utilities
│   └── validation.ts       # Zod schemas
├── scripts/                # Database scripts
│   ├── 01-create-tables.sql
│   ├── 02-seed-data.sql
│   └── 03-test-data.sql
└── public/                 # Static assets
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique user email
- `password_hash` - Hashed password
- `name` - User's display name
- `created_at` / `updated_at` - Timestamps

### Tasks Table
- `id` - Primary key
- `title` - Task title
- `description` - Task details
- `status` - pending | in-progress | completed
- `priority` - low | medium | high
- `due_date` - Optional deadline
- `created_by` - User who created the task
- `assigned_to` - Assigned user (optional)
- `created_at` / `updated_at` - Timestamps

### Task Assignments Table
- `id` - Primary key
- `task_id` - Reference to tasks
- `user_id` - Reference to users
- `assigned_at` - Assignment timestamp

## 🎯 Usage

### Creating an Account
1. Navigate to `/register`
2. Fill in your name, email, and password
3. Click "Create Account"

### Logging In
1. Navigate to `/login`
2. Enter your credentials
3. Access the dashboard

### Managing Tasks
1. **Create Task**: Click "New Task" button on dashboard
2. **Edit Task**: Click on any task card to edit
3. **Filter Tasks**: Use the filter dropdowns to narrow down tasks
4. **Assign Tasks**: Select a user when creating/editing a task
5. **Update Status**: Change task status through the edit form

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy

### Environment Setup
Ensure your environment variables are set in your deployment platform:
- `DATABASE_URL`
- `JWT_SECRET`

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ HTTP-only cookie sessions
- ✅ SQL injection protection with parameterized queries
- ✅ Input validation with Zod schemas
- ✅ Secure password requirements

## 🎨 Customization

### Theme
The application supports dark mode out of the box. Theme settings are managed via `next-themes`.

### Components
All UI components are located in `components/ui/` and can be customized using Tailwind CSS classes.

### Database
Modify the SQL scripts in the `scripts/` directory to add custom fields or tables.

## 🐛 Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure your Neon database is active
- Check network connectivity

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Verify all environment variables are set

### Real-time Updates Not Working
- Socket.io is currently disabled by default in `lib/socket.ts`
- Set `socketEnabled = true` to enable real-time features
- Ensure your hosting platform supports WebSocket connections

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is an internal project for Internshala/AbleSpace. Please contact the development team for contribution guidelines.

## 📞 Support

For questions or issues, please contact the development team.

---

**Built with ❤️ using Next.js and modern web technologies**
