# AppTrackr

Started as a way to practice React while job hunting. Ended up being something I actually use every day to track my applications.

## What it does

Add a job application, move it across columns as things progress, and get a clear picture of where everything stands.

- Kanban board — Applied → Screening → Interview → Offer → Rejected
- Stats dashboard with response rate, ghosting rate, and interview conversion rate
- Analytics page with charts — role types, sources, day of week, pipeline funnel
- Interview calendar with month and week views
- Schedule interviews with date and time directly from the board
- Color coded role badges — PM, Dev, Social, QA, Data/BA, AI/ML, Design
- Job type tags — Internship, Trainee, Full Time, Part Time, Contract
- Work mode badges — Remote, Hybrid, On-site
- Smart role autocomplete from your own history
- Follow up reminders for applications older than 14 days
- Duplicate application warnings
- Search, filter by status, sort by date or name
- Dark mode with persistent preference
- Export to CSV
- Confetti when you land an offer 🎉

## Built with

React, JavaScript, Tailwind CSS, Vite, Recharts, react-big-calendar, date-fns, canvas-confetti, Lucide icons

## Backend

REST API built with Node.js, Express, and MongoDB Atlas with JWT authentication is available in the `/backend` folder. Frontend currently uses localStorage for data persistence.

## Running locally

```bash
cd apptrackr
npm install
npm run dev
```

## About

I'm Nancy, a CS grad from SZABIST Karachi looking for roles in software development, project management, and business analysis. Built this because tracking 70+ job applications in Excel wasn't cutting it.

[LinkedIn](https://linkedin.com/in/nancyrohera) · [GitHub](https://github.com/NancyRohera)
