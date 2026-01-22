# Vehicle Service Reservation API

A RESTful API for managing vehicle service reservations and schedules. This system enables dealers to manage service schedules and customers to book vehicle service appointments with real-time quota management.

## Features

- **Dealer Authentication**: JWT-based authentication system for dealer access
- **Service Schedule Management**: Create and manage daily service schedules with configurable quotas
- **Real-time Quota Tracking**: Automatic quota management with remaining slot calculations
- **Service Booking System**: Complete booking lifecycle management with status tracking
- **Booking Status Management**: Track bookings through multiple states (pending, confirmed, cancelled, arrived, no-show)
- **Search and Filter**: Advanced filtering and search capabilities for bookings by customer name and vehicle type
- **Pagination Support**: Efficient data retrieval with pagination for large datasets
- **Public and Protected Routes**: Separate endpoints for customer-facing and dealer-only operations

## Installation

### Prerequisites

- Node.js (v20 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Setup

1. Clone the repository:

```bash
# Use SSH
git clone git@github.com:iballibull/vehicle-service-api.git

# Use HTTPS
git clone https://github.com/iballibull/vehicle-service-api.git

cd vehicle-service-api
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .example.env .env
```

Edit `.env` file with your configuration:

```env
PORT=3000
DATABASE_URL="mysql://username:password@localhost:3306/vehicle_service"
JWT_SECRET=your_secure_secret_key
JWT_EXPIRES_IN=1h
APP_DEBUG=true
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Seed the database (optional):

```bash
npx prisma db seed
```

### Docker Setup (Recommended)

Docker Compose provides a complete containerized environment with MySQL database and the API service.

#### Prerequisites

- Docker Engine (v20.10 or higher)
- Docker Compose (v2.0 or higher)

Verify installation:

```bash
docker --version
docker-compose --version
```

#### Step-by-Step Setup

1. **Clone the repository**:

```bash
# Use SSH
git clone git@github.com:iballibull/vehicle-service-api.git

# Use HTTPS
git clone https://github.com/iballibull/vehicle-service-api.git

cd vehicle-service-api
```

2. **Configure environment variables**:

```bash
cp .example.env .env
```

Edit the `.env` file with Docker-specific configuration:

```env
PORT=3000
DATABASE_URL="mysql://root:root@db:3306/vehicle_service"
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRES_IN=1h
APP_DEBUG=true
```

> **Note**: The database host must be `db` (the service name in docker-compose.yml), not `localhost`.

3. **Build and start containers**:

```bash
docker-compose up -d
```

This command will:

- Pull the MySQL 8.0 image
- Build the Node.js API image
- Create a Docker network
- Start both containers with health checks
- Create persistent volumes for database data

4. **Verify containers are running**:

```bash
docker-compose ps
```

Expected output:

```
NAME                    STATUS              PORTS
vehicle_service_api     Up (healthy)        0.0.0.0:3000->3000/tcp
vehicle_service_db      Up (healthy)        0.0.0.0:3306->3306/tcp
```

5. **Run database migrations**:

```bash
docker-compose exec api npx prisma migrate dev
```

6. **Seed the database** (optional):

```bash
docker-compose exec api npx prisma db seed
```

7. **Verify API is running**:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

#### Docker Container Management

**View logs**:

```bash
# All services
docker-compose logs -f

# API service only
docker-compose logs -f api

# Database service only
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100 api
```

**Stop containers**:

```bash
docker-compose stop
```

**Start stopped containers**:

```bash
docker-compose start
```

**Restart containers**:

```bash
docker-compose restart
```

**Stop and remove containers** (preserves volumes):

```bash
docker-compose down
```

**Stop and remove containers with volumes** (deletes all data):

```bash
docker-compose down -v
```

**Rebuild containers** (after Dockerfile changes):

```bash
docker-compose up -d --build
```

#### Accessing Services

**Execute commands inside containers**:

```bash
# Access API container shell
docker-compose exec api sh

# Access MySQL container
docker-compose exec db mysql -uroot -proot vehicle_service

# Run Prisma Studio
docker-compose exec api npx prisma studio
```

**Database connection from host**:

- Host: `localhost`
- Port: `3306`
- Username: `root`
- Password: `root`
- Database: `vehicle_service`

#### Development with Docker

The Docker setup includes hot-reload for development:

1. **File watching**: Changes to source files are automatically detected
2. **Volume mounting**: Your local `src/` directory is mounted to the container
3. **Nodemon**: Automatically restarts the server on file changes

Edit files locally and see changes reflected immediately in the container.

#### Troubleshooting

**Container fails to start**:

```bash
# Check container logs
docker-compose logs api

# Check if port 3000 is already in use
lsof -i :3000

# Check if port 3306 is already in use
lsof -i :3306
```

**Database connection errors**:

```bash
# Wait for database to be healthy
docker-compose exec db mysqladmin ping -h localhost -uroot -proot

# Restart the API container
docker-compose restart api
```

**Permission errors**:

```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

**Clear everything and start fresh**:

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove node_modules volume
docker volume rm vehicle-service-reservation-api_node_modules

# Rebuild and start
docker-compose up -d --build
```

**View container resource usage**:

```bash
docker stats
```

## Usage

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

### Production Mode

```bash
node src/server.js
```

### Health Check

Verify the API is running:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## Configuration

### Environment Variables

| Variable         | Description                | Default | Required |
| ---------------- | -------------------------- | ------- | -------- |
| `PORT`           | Server port number         | `3000`  | No       |
| `DATABASE_URL`   | MySQL connection string    | -       | Yes      |
| `JWT_SECRET`     | Secret key for JWT signing | -       | Yes      |
| `JWT_EXPIRES_IN` | JWT token expiration time  | `1h`    | No       |
| `APP_DEBUG`      | Enable debug mode          | `false` | No       |

### Database Schema

The application uses three main models:

- **Dealer**: Service center dealers with authentication credentials
- **ServiceSchedule**: Daily service schedules with quota management
- **ServiceBooking**: Customer booking records with status tracking

## Database Management

### Migrations

Create a new migration:

```bash
npx prisma migrate dev --name migration_name
```

Apply migrations to production:

```bash
npx prisma migrate deploy
```

### Prisma Studio

Open Prisma Studio for database management:

```bash
npx prisma studio
```

### Seeding

Run database seeders:

```bash
npx prisma db seed
```

## API Documentation

API documentation is available via Swagger at:

```
http://localhost:3000/api-docs
```

## Project Structure

```
vehicle-service-api/
├── prisma/
│   ├── migrations/          # Database migrations
│   ├── schema.prisma        # Prisma schema definition
│   └── seed.js              # Database seeder
├── src/
│   ├── constants/           # Application constants
│   ├── middlewares/         # Express middlewares
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication module
│   │   ├── serviceBooking/  # Booking management
│   │   └── serviceSchedule/ # Schedule management
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── app.js               # Express app configuration
│   └── server.js            # Server entry point
├── .env                     # Environment variables
├── .example.env             # Environment template
├── docker-compose.yml       # Docker configuration
├── Dockerfile               # Docker image definition
└── package.json             # Project dependencies
```
