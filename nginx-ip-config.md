# 🌐 Настройка Nginx для работы по IP адресу

## ⚡ Быстрая настройка (копируй и выполняй)

### 1️⃣ Создаем конфиг Nginx для IP
```bash
# Создаем конфиг Nginx (замените YOUR_SERVER_IP на ваш IP!)
sudo tee /etc/nginx/sites-available/jumeira-coffee <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    # Работаем с любым доменом или IP
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Для статических файлов (опционально)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
```

### 2️⃣ Активируем конфиг
```bash
# Удаляем старые конфиги
sudo rm -f /etc/nginx/sites-enabled/default
sudo rm -f /etc/nginx/sites-enabled/jumeira-coffee

# Активируем новый конфиг
sudo ln -s /etc/nginx/sites-available/jumeira-coffee /etc/nginx/sites-enabled/

# Проверяем конфигурацию
sudo nginx -t

# Перезапускаем Nginx
sudo systemctl restart nginx
```

### 3️⃣ Открываем порты в файрволе
```bash
# Настраиваем UFW для работы по IP
sudo ufw allow 22/tcp         # SSH
sudo ufw allow 80/tcp         # HTTP
sudo ufw deny 3000/tcp        # Блокируем прямой доступ к Node.js
sudo ufw --force enable

# Проверяем статус
sudo ufw status
```

### 4️⃣ Проверяем работу
```bash
# Проверяем что порты слушаются
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000

# Проверяем статус сервисов
sudo systemctl status nginx
pm2 status

# Смотрим логи
sudo tail -f /var/log/nginx/error.log
pm2 logs jumeira-coffee
```

## 🎯 Ваш сайт будет доступен по:

- **Основной сайт:** `http://ВАШ_IP_АДРЕС`
- **Отзывы:** `http://ВАШ_IP_АДРЕС/reviews.html` 
- **Админ панель:** `http://ВАШ_IP_АДРЕС/reviews/admin`

## 🔍 Узнать IP адрес сервера:
```bash
# Внешний IP
curl -4 icanhazip.com

# Локальный IP  
ip addr show | grep inet | grep -v 127.0.0.1
```

## 🛠️ Полезные команды для диагностики:

```bash
# Проверить доступность сайта
curl -I http://localhost
curl -I http://ВАШ_IP_АДРЕС

# Проверить работу Node.js напрямую
curl http://localhost:3000

# Посмотреть все активные соединения
sudo ss -tlnp | grep :80
sudo ss -tlnp | grep :3000
```

## 🚨 Если что-то не работает:

### Проблема с Nginx:
```bash
# Перезапуск всего
sudo systemctl stop nginx
sudo systemctl start nginx
sudo nginx -s reload
```

### Проблема с PM2:
```bash
# Перезапуск приложения
pm2 restart jumeira-coffee
pm2 logs jumeira-coffee --lines 50
```

### Проверка файрвола:
```bash
sudo ufw status verbose
sudo iptables -L -n
```

## ✅ Готово!
Теперь ваш сайт Jumeira Coffee доступен по IP адресу сервера! 