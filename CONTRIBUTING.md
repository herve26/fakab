# Contributing

First off, thank you for considering contributing to this project! Any and all help is greatly appreciated.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Docker](https://www.docker.com/products/docker-desktop/)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

### Environment Variables

1.  Create a `.env` file by copying the `.env.example` file:

    ```bash
    cp .env.example .env
    ```

2.  Update the `SESSION_SECRET` in the `.env` file with a secret of your choice.

### Running the Application

1.  Start the local Supabase instance:

    ```bash
    npx supabase start
    ```

2.  Run the database migrations:

    ```bash
    npx supabase db reset
    ```

3.  Start the application:

    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

### Stopping the Application

1.  Stop the Remix development server by pressing `Ctrl+C` in the terminal.

2.  Stop the local Supabase instance:

    ```bash
    npx supabase stop
    ```

## Development

### File Structure

-   `app/`: Contains the Remix application code.
-   `public/`: Contains static assets.
-   `supabase/`: Contains the Supabase configuration and migrations.

### Generating Supabase Types

To generate the Supabase types, run the following command:

```bash
npm run generate-types
```

This will create a `types/supabase.ts` file with the types for your database schema.

### Running Tests

[TODO: Add instructions on how to run tests.]
