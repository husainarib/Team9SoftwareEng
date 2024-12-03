# Team 9 Software Engineering Project

This is the repository for **Team 9 Software Engineering** project. The goal of the project is to build a platform for managing and analyzing uploaded PDF files using Pinecone and AWS S3, integrated with a Next.js frontend and backend API routes.

[**Visit the live application**](https://aichatpdf.netlify.app/)
---

## Features

- Drag-and-drop PDF upload.
- Storage of files in AWS S3.
- Content analysis with Pinecone for vector-based embedding.
- Authentication with Clerk.
- Real-time data handling using modern tools and frameworks.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (version 16 or above)
- npm (comes with Node.js)
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/filupdilrosi/Team9SoftwareEng.git
   cd Team9SoftwareEng
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the website locally.

---

## Project Structure

```
.
├── public/           # Static assets like images
├── src/
│   ├── app/          # Application entry points
│   ├── lib/          # Backend logic (S3, Pinecone, Clerk integrations)
│   ├── components/   # Reusable React components
│   ├── pages/        # API routes and frontend pages
├── .env.local        # Environment variables (not committed)
├── package.json      # Dependencies and scripts
```

---

## Usage

1. Drag and drop a PDF into the upload area on the home page.
2. The PDF will be uploaded to AWS S3 and processed using Pinecone for analysis.
3. Log in using Clerk for authentication to view your uploaded files and analytics.

---

## Troubleshooting

### Common Issues

1. **Pinecone Authorization Error**: Verify that your `PINECONE_API_KEY` and `PINECONE_ENVIRONMENT` values are correct.
2. **S3 Upload Issues**: Ensure your AWS credentials and bucket configurations are correct.

### Debugging
- Use `console.log` statements in the code to debug.
- Check Vercel logs for deployment and runtime issues.

---

## Contributing

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Open a Pull Request on GitHub.

---

## Contact

For any questions or support, please open an issue on GitHub or contact the project maintainers.
