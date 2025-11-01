# Panduan Deploy Aplikasi Al-Qur'an Digital

## 📋 Prasyarat

### System Requirements
- **RAM**: Minimal 2GB
- **Storage**: Minimal 1GB free space
- **OS**: Linux, macOS, atau Windows
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+

### Port Requirements
- **3000**: Port default aplikasi
- **80**: Port Nginx (jika menggunakan production mode)
- **443**: Port SSL (jika menggunakan production mode)

## 🚀 Cara Deploy

### Method 1: Script Otomatis (Recommended)

```bash
# Clone repository
git clone <your-repo-url>
cd quran-web-app

# Jalankan deployment script
./deploy.sh
```

Script akan:
- ✅ Mengecek prasyarat Docker
- ✅ Mengecek ketersediaan port
- ✅ Build Docker image
- ✅ Start containers
- ✅ Buka aplikasi di browser

### Method 2: Manual dengan Docker Compose

```bash
# Clone repository
git clone <your-repo-url>
cd quran-web-app

# Build dan jalankan
docker-compose up --build -d

# Cek status
docker-compose ps
```

### Method 3: Development Mode

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build
npm start
```

## 🔧 Konfigurasi Lanjutan

### Environment Variables

Buat file `.env` untuk konfigurasi kustom:

```bash
# Environment
NODE_ENV=production

# API Configuration
NEXT_PUBLIC_API_URL=https://api.quran.com/api/v4

# Server Configuration
HOSTNAME=0.0.0.0
PORT=3000
```

### Custom Port

Edit `docker-compose.yml`:

```yaml
services:
  quran-app:
    ports:
      - "8080:3000"  # Gunakan port 8080 di host
```

### SSL/HTTPS Setup

1. **Generate SSL Certificate**:
   ```bash
   mkdir ssl
   # Let's Encrypt atau manual certificate generation
   ```

2. **Update nginx.conf**:
   ```nginx
   server {
       listen 443 ssl;
       ssl_certificate /etc/nginx/ssl/cert.pem;
       ssl_certificate_key /etc/nginx/ssl/key.pem;
   }
   ```

3. **Deploy dengan SSL**:
   ```bash
   docker-compose --profile production up -d
   ```

## 📊 Monitoring dan Maintenance

### Cek Status Containers

```bash
# Status semua containers
docker-compose ps

# Logs aplikasi
docker-compose logs -f quran-app

# Logs semua services
docker-compose logs -f
```

### Backup Data

 aplikasi tidak menggunakan database persistent, namun untuk backup:

```bash
# Backup config files
tar -czf quran-app-backup-$(date +%Y%m%d).tar.gz \
    docker-compose.yml \
    nginx.conf \
    .env
```

### Update Aplikasi

```bash
# Pull latest changes
git pull

# Rebuild dan restart
docker-compose build --no-cache
docker-compose up -d

# Atau gunakan deployment script
./deploy.sh
```

### Performance Monitoring

```bash
# Resource usage
docker stats quran-web-app

# Disk usage
docker system df

# Cleanup unused images
docker system prune
```

## 🔒 Security Best Practices

### 1. Network Security
```bash
# Firewall configuration
sudo ufw allow 3000
sudo ufw allow 80    # Jika menggunakan Nginx
sudo ufw allow 443   # Jika menggunakan HTTPS
```

### 2. Docker Security
```bash
# Run dengan non-root user (sudah dikonfigurasi)
# Gunakan Docker secrets untuk sensitive data
# Regular security updates
```

### 3. Application Security
- ✅ API endpoint yang digunakan sudah verified
- ✅ Tidak ada database dengan data sensitive
- ✅ Semua data tersimpan di client-side (localStorage)
- ✅ HTTPS recommended untuk production

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Cari proses yang menggunakan port 3000
sudo lsof -i :3000

# Kill proses
sudo kill -9 <PID>

# Atau gunakan port lain
```

#### 2. Docker Permission Denied
```bash
# Add user ke docker group
sudo usermod -aG docker $USER
logout && login  # Re-login required
```

#### 3. Build Failed
```bash
# Clean build
docker system prune -a
docker-compose build --no-cache
```

#### 4. Application Not Loading
```bash
# Cek logs
docker-compose logs quran-app

# Restart container
docker-compose restart quran-app

# Rebuild jika perlu
docker-compose up --build -d
```

#### 5. Audio Not Playing
- Pastikan browser tidak blocking audio autoplay
- Cek console browser untuk error messages
- Verify API connectivity: `curl https://api.quran.com/api/v4/chapters`

### Health Check

```bash
# Test API connectivity
curl -f https://api.quran.com/api/v4/chapters || echo "API Down"

# Test local application
curl -f http://localhost:3000 || echo "App Down"

# Check Docker containers
docker ps | grep quran-app || echo "Container not running"
```

## 📈 Performance Optimization

### 1. Resource Limits

Edit `docker-compose.yml`:

```yaml
services:
  quran-app:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 2. Caching Strategy

- Static assets sudah di-cache oleh browser
- API calls cached di client-side
- Images optimized dengan Next.js Image component

### 3. Monitoring Setup

```bash
# Install monitoring tools
docker run -d \
  --name=grafana \
  -p 3001:3000 \
  grafana/grafana
```

## 📞 Support

### Emergency Procedures
1. **App Down**: `docker-compose restart quran-app`
2. **High CPU**: `docker-compose down` → `docker-compose up -d`
3. **Disk Full**: `docker system prune -a`

### Contact Information
- GitHub Issues: Report technical problems
- Email: support@quran-web-app.com
- Documentation: Check `README.md`

---

## ✅ Deployment Checklist

- [ ] Docker dan Docker Compose terinstall
- [ ] Port 3000 tersedia
- [ ] Repository berhasil di-clone
- [ ] Image berhasil di-build
- [ ] Containers berjalan normal
- [ ] Aplikasi accessible di browser
- [ ] Audio playback berfungsi
- [ ] Dark mode toggle bekerja
- [ ] Search functionality normal
- [ ] Bookmark feature working

Deployment selesai! 🎉