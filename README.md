Inventory Flow ERP

Inventory Flow is a professional inventory management platform built with the modern Next.js stack. The system provides full control over products, stock movement traceability, and real-time visualization of key performance indicators (KPIs).
Live Demo

Check out the live application here: [https://inventory-flow-erp.vercel.app/]
Tech Stack

    Framework: Next.js 15 (App Router)

    Language: TypeScript

    Database: PostgreSQL (Supabase)

    ORM: Prisma

    Styling: Tailwind CSS

    UI Components: Shadcn UI

    Deployment: Vercel

Core Features
Dashboard & KPIs

Immediate visualization of total inventory value and physical stock volume. Indicators update dynamically based on filters or stock changes.
Product Management (CRUD)

Complete control over the product catalog, including creating, reading, updating, and deleting records with database persistence.
Advanced Search

Optimized search system using URL Search Params and debouncing techniques to filter by name or SKU without overloading the server.
Stock Traceability & Logs

Automatic logging of every inventory movement. The system detects stock variances and generates an activity history detailing inflows and outflows.
Pagination & Performance

Server-side pagination implementation to ensure smooth performance even with large data volumes.
Installation & Setup

    Clone the repository:
    git clone [YOUR_REPO_URL]

    Install dependencies:
    npm install

    Configure environment variables (.env):
    DATABASE_URL="your_supabase_url"

    Run Prisma migrations:
    npx prisma generate
    npx prisma db push

    Start the development server:
    npm run dev

2. Cambia los datos de prueba a Inglés

En las empresas de fuera valoran mucho la atención al detalle. Si entran en tu demo y ven "Zapatillas" o "Caja de Té", se nota que es un proyecto local.

    Entra en tu base de datos (Supabase o vía tu propia App).

    Cambia los nombres a cosas como: "Wireless Headphones", "Mechanical Keyboard", "Organic Coffee Beans".

3. El Perfil de GitHub

Asegúrate de que tu biografía de GitHub esté en inglés. Algo sencillo como:

    "Fullstack Developer passionate about building scalable web applications with Next.js, TypeScript, and PostgreSQL."