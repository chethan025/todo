# Todo App

A comprehensive task management application built with React, Vite, and Supabase. This app helps you organize your daily routines, schedule tasks, manage reminders, and track your productivity.

## Features

- **Reminders**: Quick todo items with optional notes
- **Daily Routines**: Recurring tasks that reset daily with start/end times
- **Scheduled Tasks**: Tasks assigned to specific dates
- **Future Scheduled**: Plan ahead with future-dated tasks
- **History**: View completed tasks from the past
- **Responsive Design**: Optimized for both desktop and mobile devices

## Tech Stack

- **Frontend**: React 19 with Vite
- **Backend**: Supabase (PostgreSQL database)
- **Styling**: Custom CSS
- **Deployment**: Ready for static hosting

## Project Structure

```
src/
├── components/          # React components
│   ├── Todos.jsx       # Reminders component
│   ├── Daily.jsx       # Daily routines
│   ├── Scheduled.jsx   # Date-specific tasks
│   ├── FutureScheduled.jsx
│   └── History.jsx     # Completed tasks history
├── hooks/
│   └── useIsMobile.js  # Responsive hook
├── layouts/
│   ├── DesktopView.jsx
│   └── MobileView.jsx
├── lib/
│   └── supabase.js     # Supabase client
└── styles/
    └── dashboard.css   # Main styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
