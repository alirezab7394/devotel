# Smart Insurance Application Portal

A dynamic insurance application portal built with React, TypeScript, and Tailwind CSS. This application allows users to apply for different types of insurance through dynamic forms and manage their applications in a customizable list view.

## Features

### Smart Dynamic Forms
- Forms are fetched from an API and built dynamically without hardcoding the structure
- Conditional fields appear/disappear based on user input
- Nested sections for complex data (e.g., Address, Vehicle Details)
- Dynamic options fetched from API (e.g., states based on country)
- Form validation using Zod and React Hook Form

### Customizable List View
- View submitted applications in a table
- Select which columns to display
- Sort, search, and paginate through applications

## Insurance Types

The application supports multiple insurance types, including:
- Health Insurance
- Car Insurance
- Home Insurance

Each insurance type has its own set of questions and conditional logic.

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod (for validation)
- Shadcn UI (for components)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd smart-insurance-portal
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── api/              # API services
├── components/       # React components
│   └── ui/           # Shadcn UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components
├── types/            # TypeScript type definitions
└── App.tsx           # Main application component
```

## How It Works

1. The application fetches form structures from the API
2. Users select an insurance type to apply for
3. The form is dynamically rendered based on the structure
4. Conditional fields appear/disappear based on user input
5. Form data is validated before submission
6. Submitted applications can be viewed in the Applications table
7. Users can customize the table view by selecting which columns to display

## License

MIT
