# 🚀 FormNest  

 🔗 Live Site: https://form-nest-theta.vercel.app

 
note: use b@gmail.com  and password: 'adi' for demo viewing the site..(clone the code for ur customisations).



A powerful backend solution for building, managing, and submitting dynamic forms using [Payload CMS](https://payloadcms.com/) and [Supabase](https://supabase.com/).

This project allows **admin users** to create and manage multiple forms and access their submissions, while **members** can only view and manage their own. The system is built to integrate easily with any frontend via REST APIs or GraphQL.

---

## 📦 Tech Stack

- [Payload CMS](https://payloadcms.com/) – Headless CMS backend
- [Supabase PostgreSQL](https://supabase.com/) – Cloud Postgres DB
- [plugin-form-builder](https://github.com/payloadcms/plugins/tree/main/packages/plugin-form-builder) – Payload Plugin for form creation and submission
- Role-based access control (Admin / Member)
- API-ready architecture

---

## ✅ Features

- 🔐 **Role-Based Access Control**  
  Admins can view all forms and submissions, members only their own.

- 🧱 **Form Builder Integration**  
  Add form fields, messages, labels, and confirmations using Payload plugin.

- 📬 **Form Submission API**  
  Submit to `/api/form-submissions` from any frontend or tool like Postman.

- 🔗 **Ownership Mapping**  
  Automatically links form to its creator with a custom `form-ownership` collection.

- 🧪 **Ready for Frontend Use**  
  Fetch form schema and submit responses from any client (React, Vite, Next.js, etc.).

---



