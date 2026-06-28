# MyHotel — AWS EC2 Deployment Guide

Deploy the full MyHotel stack (React frontend + 3 microservices + MySQL + Redis) on a single **AWS EC2** instance using **Docker Compose**.

## Architecture on EC2

```
Internet :80
    └── nginx (web container) — React SPA + API reverse proxy
            ├── /hotel-api/*        → PlainAPI           :3002
            ├── /booking-api/*      → Booking Service    :3000
            └── /notification-api/* → Notification Svc   :3001

Internal (Docker network):
    ├── mysql:3306   — airbnb_dev + airbnb_booking_dev
    └── redis:6379   — BullMQ queue + distributed locks
```

---

## Prerequisites

| Requirement | Details |
|-------------|---------|
| AWS account | With EC2 access |
| EC2 instance | **Ubuntu 22.04 LTS**, min **t3.medium** (2 vCPU, 4 GB RAM) |
| Storage | 20 GB+ gp3 EBS |
| Key pair | `.pem` file for SSH |
| Gmail app password | For Notification Service emails |
| Git repo | Push code to GitHub/GitLab, or SCP to EC2 |

---

## Step 1 — Launch EC2 Instance

1. AWS Console → **EC2** → **Launch instance**
2. Settings:
   - **Name:** `myhotel-prod`
   - **AMI:** Ubuntu Server 22.04 LTS
   - **Instance type:** `t3.medium` (recommended)
   - **Key pair:** Create or select existing
   - **Storage:** 20 GiB gp3
3. **Security group** — allow inbound:

   | Type | Port | Source |
   |------|------|--------|
   | SSH | 22 | Your IP |
   | HTTP | 80 | 0.0.0.0/0 |
   | HTTPS | 443 | 0.0.0.0/0 (optional, for SSL later) |

4. Launch and note the **Public IPv4 address**.

---

## Step 2 — Connect to EC2

```bash
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

---

## Step 3 — Install Docker

```bash
git clone https://github.com/YOUR_USERNAME/MYHOTEL.git
cd MYHOTEL

chmod +x deploy/scripts/setup-ec2.sh
./deploy/scripts/setup-ec2.sh

exit
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
cd MYHOTEL
```

---

## Step 4 — Configure Environment

```bash
cp deploy/.env.example deploy/.env
nano deploy/.env
```

Edit `deploy/.env`:

```env
MYSQL_ROOT_PASSWORD=StrongRootPassword123!
MYSQL_USER=myhotel
MYSQL_PASSWORD=StrongDbPassword456!
PLAINAPI_DB_NAME=airbnb_dev
BOOKING_DB_NAME=airbnb_booking_dev

MAIL_USER=your@gmail.com
MAIL_PASS=xxxx xxxx xxxx xxxx
```

**Important:**
- Keep `MYSQL_USER=myhotel` (matches `deploy/mysql/init.sql` grants)
- Use a [Gmail App Password](https://support.google.com/accounts/answer/185833), not your regular password
- If your DB password contains special characters (`@`, `#`, `%`), use alphanumeric passwords only

---

## Step 5 — Deploy

```bash
chmod +x deploy/scripts/deploy.sh
./deploy/scripts/deploy.sh
```

This will:
1. Build Docker images for all 4 apps
2. Start MySQL, Redis, and all microservices
3. Run **Sequelize migrations** (PlainAPI) and **Prisma migrations** (Booking Service)
4. Serve the React frontend on port **80**

Open: **http://YOUR_EC2_PUBLIC_IP**

---

## Step 6 — Verify

```bash
cd MYHOTEL/deploy
docker compose ps

curl http://localhost/hotel-api/ping/health
curl http://localhost/booking-api/ping/health
curl http://localhost/notification-api/ping/health

docker compose logs -f web
docker compose logs -f plain-api
```

---

## Updating After Code Changes

```bash
cd MYHOTEL
chmod +x deploy/scripts/update.sh
./deploy/scripts/update.sh
```

---

## Deployment Files Reference

| File | Purpose |
|------|---------|
| `deploy/docker-compose.yml` | Orchestrates all services |
| `deploy/.env.example` | Environment variable template |
| `deploy/mysql/init.sql` | Creates both MySQL databases |
| `deploy/scripts/setup-ec2.sh` | Installs Docker on Ubuntu EC2 |
| `deploy/scripts/deploy.sh` | Build + start full stack |
| `deploy/scripts/update.sh` | Git pull + redeploy |
| `PlainAPI/Dockerfile` | Hotel catalog API image |
| `HotelBookingservice_copy/HOTELBOOKINGSERVICE/Dockerfile` | Booking API image |
| `NotificationService/Express_Starter_Template/Dockerfile` | Email worker image |
| `frontend/Dockerfile` | React build + nginx gateway |

---

## Troubleshooting

### Service shows offline in Admin Dashboard
```bash
docker compose logs notification-service
docker compose restart notification-service
```

### Port 80 already in use
```bash
sudo lsof -i :80
sudo systemctl stop apache2
```

### Database connection failed
```bash
docker compose logs mysql
```

### Rebuild from scratch
```bash
cd deploy
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

---

## Security Checklist

- [ ] Change all default passwords in `deploy/.env`
- [ ] Restrict SSH (port 22) to your IP only
- [ ] Never commit `deploy/.env` to git
- [ ] Enable HTTPS before going public
- [ ] Rotate Gmail app password periodically

---

## Quick Command Reference

```bash
cd MYHOTEL/deploy && docker compose up -d    # Start
docker compose down                           # Stop
docker compose logs -f                        # Logs
docker compose restart plain-api              # Restart one service
```
