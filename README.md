# 📦 Inventory Flow ERP

> **Enterprise-grade Order Management System (OMS)** designed to migrate legacy retail operations from manual Excel/JSON workflows to a scalable, ACID-compliant architecture.

![Status](https://img.shields.io/badge/Status-Active_Development-success)
![Tech](https://img.shields.io/badge/Stack-Next.js_14_|_PostgreSQL_|_Python-blue)

## 🎯 The Business Problem
Many retail businesses (SMBs) suffer from **"Excel Hell"**:
- Inventory data is scattered across local files (`stock.json`, `.xlsx`).
- No "Single Source of Truth", leading to overselling and stock discrepancies.
- Manual data entry consumes 10+ hours/week.
- Lack of audit trails (who changed the price and when?).

## 🛠 The Engineering Solution
**Inventory Flow** is a full-stack platform that enforces data integrity and automates the supply chain:

* **ACID Compliance:** Migrating from file-based storage to **PostgreSQL** to ensure transaction safety.
* **AI-Powered Ingestion:** Using LLMs (OpenAI/Local Models) to normalize inconsistent vendor data from raw Excel files (e.g., mapping "Jarrón Az." to "Blue Vase Variant").
* **Real-time Dashboard:** A Next.js App Router interface for warehouse management.
* **Hybrid Architecture:** - **Frontend/API:** Next.js (TypeScript).
    - **Data Processing:** Python scripts for heavy ETL tasks.

## 🏗 Tech Stack

| Domain | Technology | Reason |
| :--- | :--- | :--- |
| **Core** | Next.js 14 (App Router) | Server Actions for type-safe backend logic. |
| **Language** | TypeScript | Strict typing to prevent runtime errors in financial calculations. |
| **Database** | PostgreSQL (Supabase) | Relational data integrity for complex inventory schemas. |
| **ORM** | Prisma / Drizzle | Type-safe database queries. |
| **AI / ML** | OpenAI API / Python | Data normalization and automated SEO description generation. |
| **Styling** | Tailwind CSS + Shadcn/ui | Accessible, enterprise-ready UI components. |

## 🚀 Roadmap

- [ ] **Phase 1: Foundation** - Database Schema Design & Seed Scripts (Migrating from JSON).
- [ ] **Phase 2: Core Logic** - Inventory Movements & Audit Logging.
- [ ] **Phase 3: The Dashboard** - Secure Admin Interface implementation.
- [ ] **Phase 4: AI Integration** - Automated "Dirty Data" Cleaning Pipeline.

---
*Developed by [José Manuel Quero](https://github.com/jmquero92) - Focusing on High-Performance Web Architecture.*
