# Next.js Data Fetching: API Routes vs Server Actions

This is a comprehensive learning application that demonstrates the difference between two approaches to data fetching in Next.js:

1. **API Routes** - Traditional REST API pattern using axios
2. **Server Actions** - Modern Next.js pattern using `'use server'`

## 🚀 Getting Started

The app is already set up and running! Visit: **http://localhost:3001**

## � Pages Overview

### Read-Only Demos
- **`/api-approach`** - Pagination demo using API Routes
- **`/server-action`** - Pagination demo using Server Actions

### Full CRUD Demos
- **`/api-crud`** - Complete CRUD operations with API Routes (POST, GET, PATCH, DELETE)
- **`/server-crud`** - Complete CRUD operations with Server Actions

## �📁 Project Structure

```
src/
├── app/
│   ├── actions/
│   │   └── users.ts              # Server Actions for CRUD operations
│   ├── api/
│   │   └── users/
│   │       └── route.ts           # API Routes for CRUD operations
│   ├── api-approach/
│   │   └── page.tsx               # Read demo using API routes
│   ├── server-action/
│   │   └── page.tsx               # Read demo using server actions
│   ├── api-crud/
│   │   └── page.tsx               # Full CRUD demo with API routes
│   ├── server-crud/
│   │   └── page.tsx               # Full CRUD demo with server actions
│   └── page.tsx                   # Main comparison page
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   └── utils.ts                   # Utility functions
└── generated/
    └── prisma/                    # Generated Prisma Client

prisma/
├── schema.prisma                  # Database schema
├── seed.ts                        # Seed script (50 sample users)
├── dev.db                         # SQLite database
└── migrations/                    # Database migrations
```

## 🗄️ Database

- **Database**: SQLite (local, file-based)
- **ORM**: Prisma
- **Data**: 50 sample users with pagination

### Running Database Commands

```bash
# View data in Prisma Studio
npx prisma studio

# Re-seed the database
npm run prisma:seed

# Create a new migration
npx prisma migrate dev --name <migration_name>
```

## 🔍 What Each Approach Does

### 1. API Route Approach (`/api-approach`)

**Flow:**

1. Client component makes HTTP request with axios
2. Request goes to `/api/users` API route
3. API route queries database with Prisma
4. Response sent back as JSON
5. Client updates state and re-renders

**Code:**

- API Route: `src/app/api/users/route.ts`
- Client Page: `src/app/api-approach/page.tsx`

**When to use:**

- Building a public API
- Need webhook endpoints
- External services need access
- Working with mobile apps

### 2. Server Action Approach (`/server-action`)

**Flow:**

1. Client calls function marked with `'use server'`
2. Next.js automatically creates endpoint
3. Function executes on server, queries Prisma
4. Data automatically serialized and returned
5. Client updates state and re-renders

**Code:**

- Server Action: `src/app/actions/users.ts`
- Client Page: `src/app/server-action/page.tsx`

**When to use:**

- Building internal features
- Want better DX and type safety
- Need form mutations
- Only Next.js app will use it

## 🎯 Features

### Read-Only Features (Pagination Demos)
- ✅ Pagination (10 items per page)
- ✅ Sorted by creation date
- ✅ Role-based user badges
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design
- ✅ Beautiful UI with Tailwind CSS

### CRUD Features (Full CRUD Demos)
- ✅ **Create** - Add new users with validation
- ✅ **Read** - View all users in a table
- ✅ **Update** - Edit existing user information
- ✅ **Delete** - Remove users with confirmation
- ✅ Inline editing with cancel functionality
- ✅ Real-time success/error feedback
- ✅ Detailed explanations of how each operation works

## 📊 API Endpoints

### GET - Read Users
```
GET http://localhost:3001/api/users?page=1&limit=10
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "users": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 50,
    "limit": 10
  }
}
```

### POST - Create User
```
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

**Response (201):**
```json
{
  "user": { "id": 51, "name": "John Doe", "email": "john@example.com", "role": "user", ... },
  "message": "User created successfully"
}
```

### PATCH - Update User
```
PATCH http://localhost:3001/api/users
Content-Type: application/json

{
  "id": 51,
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin"
}
```

**Response (200):**
```json
{
  "user": { "id": 51, "name": "John Smith", ... },
  "message": "User updated successfully"
}
```

### DELETE - Delete User
```
DELETE http://localhost:3001/api/users?id=51
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

## 🔧 Server Actions

All server actions are in `src/app/actions/users.ts`:

### getUsersServerAction()
```typescript
const data = await getUsersServerAction(page, limit);
// Returns: { users: User[], pagination: { ... } }
```

### createUserServerAction()
```typescript
const result = await createUserServerAction({
  name: "John Doe",
  email: "john@example.com",
  role: "user"
});
// Returns: { user: User, message: string }
```

### updateUserServerAction()
```typescript
const result = await updateUserServerAction({
  id: 51,
  name: "John Smith",
  email: "johnsmith@example.com",
  role: "admin"
});
// Returns: { user: User, message: string }
```

### deleteUserServerAction()
```typescript
const result = await deleteUserServerAction(51);
// Returns: { message: string }
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite with Prisma
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **TypeScript**: Full type safety

## 💡 Key Takeaways

### API Routes Pros:

- Can be called from external apps
- Familiar REST pattern
- Easy to test with tools like Postman
- Works with any HTTP client

### API Routes Cons:

- Extra HTTP overhead
- More boilerplate code
- Need to handle errors on both sides
- Separate endpoint for each operation

### Server Actions Pros:

- Less boilerplate code
- Type-safe end-to-end
- No manual API routes needed
- Better developer experience

### Server Actions Cons:

- Only works within Next.js app
- Can't be called from external apps
- Harder to test independently
- Requires Next.js 13+ App Router

## 🎓 Pro Tip

You can use **both** in the same app! Use API routes for public endpoints and server actions for internal features. This gives you the best of both worlds.

## 📝 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm start

# Seed database
npm run prisma:seed

# Open Prisma Studio
npx prisma studio
```

## 🧪 Try It Yourself

### Read-Only Demos
1. Navigate between `/api-approach` and `/server-action`
2. Test pagination on both approaches
3. Open the Network tab to see the differences in requests

### CRUD Demos
1. Visit `/api-crud` to see REST API CRUD operations
   - Create new users and watch the POST request in Network tab
   - Edit users and see PATCH requests
   - Delete users and observe DELETE requests
   - Notice how each operation requires explicit HTTP method calls

2. Visit `/server-crud` to see Server Actions CRUD operations
   - Create, edit, and delete users by calling functions directly
   - Notice how there's no manual HTTP handling
   - Check Network tab - Next.js handles communication automatically
   - Experience the cleaner, more type-safe approach

3. Compare the code between both approaches
   - API approach: More boilerplate, explicit HTTP methods
   - Server Actions: Less code, feels like regular function calls

4. Experiment and learn
   - Try adding validation
   - Add filters or sorting
   - Modify the User model with new fields
   - Test error handling by entering invalid data

## 🎯 Learning Path Recommendation

1. **Start with Read Demos** - Understand the basics of data fetching
2. **Move to CRUD Demos** - See how to modify data
3. **Read the on-page explanations** - Each CRUD page has detailed explanations
4. **Open DevTools Network tab** - Watch the difference in real-time
5. **Modify the code** - Best way to learn is by doing!

Happy learning! 🚀
