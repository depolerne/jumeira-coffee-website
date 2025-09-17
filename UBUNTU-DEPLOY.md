# 🚀 Деплой на Ubuntu сервер

## ⚡ Быстрая установка (копируй и выполняй)

### 1️⃣ Обновление системы и установка Node.js
```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем curl и основные пакеты
sudo apt install -y curl wget git build-essential

# Устанавливаем Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверяем версии
node --version && npm --version
```

### 2️⃣ Устанавливаем PM2 и Nginx
```bash
# Устанавливаем PM2 глобально
sudo npm install -g pm2

# Устанавливаем Nginx
sudo apt install -y nginx

# Запускаем и включаем автозагрузку
sudo systemctl start nginx
sudo systemctl enable nginx

# Открываем порты в файрволе
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable
```

### 3️⃣ Клонируем проект
```bash
# Переходим в домашнюю папку
cd ~

# Клонируем репозиторий  
git clone https://github.com/depolerne/jumeira-coffee-website.git
cd jumeira-coffee-website

# Устанавливаем зависимости
npm install

# Создаем папку для данных (если нужно)
mkdir -p data

# Устанавливаем права
sudo chown -R $USER:$USER /home/$USER/jumeira-coffee-website
```

### 4️⃣ Запускаем приложение через PM2
```bash
# Запускаем сайт через PM2
pm2 start server.js --name "jumeira-coffee"

# Сохраняем конфигурацию PM2
pm2 save

# Настраиваем автозапуск при перезагрузке
pm2 startup
# Выполните команду которую покажет PM2

# Проверяем статус
pm2 status
pm2 logs jumeira-coffee
```

### 5️⃣ Настраиваем Nginx
```bash
# Создаем конфиг Nginx
sudo tee /etc/nginx/sites-available/jumeira-coffee <<EOF
server {
    listen 80;
    server_name ваш-домен.com www.ваш-домен.com;

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
}
EOF

# Активируем сайт
sudo ln -s /etc/nginx/sites-available/jumeira-coffee /etc/nginx/sites-enabled/

# Удаляем дефолтный сайт
sudo rm /etc/nginx/sites-enabled/default

# Проверяем конфигурацию
sudo nginx -t

# Перезапускаем Nginx
sudo systemctl restart nginx
```

### 6️⃣ Настраиваем SSL с Let's Encrypt
```bash
# Устанавливаем Certbot
sudo apt install -y certbot python3-certbot-nginx

# Получаем SSL сертификат (замените домен!)
sudo certbot --nginx -d ваш-домен.com -d www.ваш-домен.com

# Настраиваем автообновление
sudo crontab -e
# Добавьте эту строку:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🎯 Готово! Сайт работает

- **HTTP:** `http://ваш-домен.com`
- **HTTPS:** `https://ваш-домен.com` 
- **Админ:** `https://ваш-домен.com/reviews/admin`

## 🔧 Полезные команды

### PM2 управление:
```bash
pm2 status                    # Статус процессов
pm2 restart jumeira-coffee    # Перезапуск
pm2 stop jumeira-coffee       # Остановка
pm2 delete jumeira-coffee     # Удаление
pm2 logs jumeira-coffee       # Логи в реальном времени
pm2 monit                     # Мониторинг системы
```

### Nginx управление:
```bash
sudo systemctl status nginx   # Статус
sudo systemctl restart nginx  # Перезапуск
sudo systemctl reload nginx   # Перезагрузка конфига
sudo nginx -t                 # Проверка конфига
```

### Обновление проекта:
```bash
cd ~/jumeira-coffee-website
git pull origin main          # Скачиваем обновления
npm install                   # Обновляем зависимости
pm2 restart jumeira-coffee    # Перезапускаем приложение
```

## 🛡️ Безопасность

### Настройка файрвола:
```bash
sudo ufw status
sudo ufw allow 22/tcp         # SSH
sudo ufw allow 80/tcp         # HTTP
sudo ufw allow 443/tcp        # HTTPS
sudo ufw deny 3000/tcp        # Блокируем прямой доступ к Node.js
```

### Регулярные обновления:
```bash
# Добавьте в crontab (sudo crontab -e):
0 2 * * 1 apt update && apt upgrade -y
```

## 📊 Мониторинг

### Проверка работы:
```bash
# Проверяем порты
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :3000

# Проверяем процессы
ps aux | grep node
ps aux | grep nginx

# Проверяем логи
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
pm2 logs jumeira-coffee --lines 50
```

## 🎉 Все готово!

Ваш сайт Jumeira Coffee теперь работает на Ubuntu сервере с:
- ✅ **Node.js приложением** на PM2
- ✅ **Nginx reverse proxy** 
- ✅ **SSL сертификатом**
- ✅ **Автозапуском при перезагрузке**
- ✅ **Файловым хранилищем отзывов**

**🔧 Замените в конфиге:**
- `ваш-домен.com` - на ваш реальный домен
- Пароль админа можно изменить в `server.js` 