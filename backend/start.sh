set -e

echo "Running drizzle migrations..."
npx drizzle-kit push

echo "Starting the application..."
node dist/src/main.js