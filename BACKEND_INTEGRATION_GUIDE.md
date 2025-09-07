# Backend Integration Guide

## Current Issue
Your frontend is getting "Failed to fetch" errors because it cannot connect to the backend server at `http://localhost:5000`.

## Solutions

### Option 1: Start Your Backend Server
If you have a backend server, make sure it's running on port 5000:
```bash
# Navigate to your backend directory and start the server
cd your-backend-directory
npm start  # or whatever command starts your server
```

### Option 2: Change the API Base URL
If your backend is running on a different port or URL, update the configuration:

1. **Environment Variable (Recommended):**
   Create a `.env.local` file in your project root:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001  # or your actual backend URL
   ```

2. **Direct Configuration:**
   Edit `lib/config.ts` and change the BASE_URL:
   ```typescript
   BASE_URL: 'http://localhost:3001',  // your actual backend URL
   ```

### Option 3: Mock Data for Development
If you don't have a backend yet, you can create mock data by:
1. Commenting out the API calls in `components/project-dropdowns.tsx`
2. Adding mock data arrays
3. Using the mock data instead of API calls

## Testing the Connection
After making changes, restart your Next.js development server:
```bash
npm run dev
```

## Common Issues
- **CORS errors**: Make sure your backend allows requests from `http://localhost:3000`
- **Port conflicts**: Ensure no other service is using port 5000
- **Firewall**: Check if your firewall is blocking the connection

## Next Steps
1. Verify your backend server is running
2. Check the console for more specific error messages
3. Test with a simple endpoint like `/health` or `/ping`
