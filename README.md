# Note.AI Backend

This is the backend service for Note.AI, a project that processes and generates MIDI music using AI. The service currently handles MIDI file storage and processing through direct AWS S3 integration, without a database layer (in an effort to get the project up and running as quickly as possible).

## Prerequisites

- Node.js
- AWS Account with an S3 bucket
- OpenAI API key

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials:

   - OpenAI API key
   - AWS credentials
   - Server configuration

3. Update the S3 configuration in `utils/AWS/client.ts`:

   ```typescript
   export const bucketName = "your-bucket-name";
   export const region = "your-aws-region"; // e.g., "us-east-1"
   ```

4. Install dependencies:

```bash
npm install
```

## AWS S3 Setup

1. Create an S3 bucket in your preferred region if you haven't already
2. Update the bucket name and region in `utils/AWS/client.ts` to match your configuration
3. Upload a MIDI file named exactly `midi.mid` to the bucket to get started
4. Ensure your AWS credentials have appropriate permissions for:
   - Reading from your S3 bucket
   - Writing to your S3 bucket

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `AWS_ACCESS_KEY_ID`: AWS access key with S3 permissions
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `PORT`: Server port (default: 8000)
- `HOST`: Host address (default: localhost)
- `ENVIRONMENT`: Development/production environment

## Development

To start the development server:

```bash
npm run dev
```

## Note

This is a development version that uses direct S3 storage for MIDI files. Future versions will incorporate a database for better data management and relationships.
