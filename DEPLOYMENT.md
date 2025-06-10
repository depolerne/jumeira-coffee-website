# 🚀 Инструкция по деплою Jumeira Coffee Website

## 📋 Шаг 1: Создание GitHub репозитория

1. **Перейдите на [GitHub.com](https://github.com)**
2. **Создайте новый репозиторий:**
   - 📝 Название: `jumeira-coffee-website`
   - 📄 Описание: `Modern coffee shop website with review system for Jumeira Coffee`
   - 🌍 Тип: Public
   - ❌ НЕ добавляйте README, .gitignore или лицензию

3. **Скопируйте HTTPS URL репозитория** (примерно так: `https://github.com/yourusername/jumeira-coffee-website.git`)

## 🔗 Шаг 2: Подключение к GitHub

**Замените `YOUR_USERNAME` на ваш GitHub username и выполните:**

```bash
# Добавить remote origin
git remote add origin https://github.com/YOUR_USERNAME/jumeira-coffee-website.git

# Установить главную ветку
git branch -M main

# Отправить код на GitHub
git push -u origin main
```

**Или используйте готовый скрипт:**
1. Отредактируйте файл `github-setup.sh` - замените `YOUR_USERNAME`
2. Запустите: `./github-setup.sh`

## 🌐 Шаг 3: Деплой на Vercel

### Автоматический способ (Рекомендуется):

1. **Перейдите на [vercel.com](https://vercel.com)**
2. **Войдите через GitHub аккаунт**
3. **Нажмите "New Project"**
4. **Выберите репозиторий `jumeira-coffee-website`**
5. **Настройки деплоя:**
   - ✅ Framework Preset: `Other`
   - ✅ Build Command: `npm install`
   - ✅ Output Directory: _(оставить пустым)_
   - ✅ Install Command: `npm install`
6. **Нажмите "Deploy"**

### Через Vercel CLI:

```bash
# Установить Vercel CLI
npm i -g vercel

# Войти в аккаунт
vercel login

# Деплой
vercel --prod
```

## 🎯 После деплоя

### Ваш сайт будет доступен по адресам:

- **🏠 Главная:** `https://your-project.vercel.app`
- **💬 Отзывы:** `https://your-project.vercel.app/reviews.html`
- **👑 Админ панель:** `https://your-project.vercel.app/reviews/admin`
  - Пароль: `jumeira1380`

### 🔧 Настройки после деплоя:

1. **Обновите ссылки в README.md**
2. **Настройте custom domain (опционально)**
3. **Добавьте SSL сертификат (автоматически)**

## 📊 Что включено в проект:

- ✅ **Адаптивный дизайн** для всех устройств
- ✅ **Система отзывов** с валидацией
- ✅ **Публичная страница отзывов**
- ✅ **Защищенная админ панель**
- ✅ **Интеграция с Instagram**
- ✅ **Регистрация бонусных карт**
- ✅ **JSON база данных**
- ✅ **Готовность к Vercel**

## 🛠 Управление:

### Админ функции:
- 👁️ **Скрывать/показывать отзывы**
- ✏️ **Редактировать отзывы** 
- 🗑️ **Удалять отзывы**
- 📊 **Просматривать статистику**
- 📥 **Экспорт в CSV**

### API Endpoints:
- `GET /api/reviews` - Получить видимые отзывы
- `POST /api/reviews` - Добавить отзыв
- `POST /api/admin/login` - Вход в админ панель
- `GET /api/admin/reviews` - Все отзывы (для админа)
- `PUT /api/admin/reviews/:id` - Обновить отзыв
- `DELETE /api/admin/reviews/:id` - Удалить отзыв

## 🎨 Кастомизация:

### Изменить пароль админа:
Отредактируйте `server.js`, строка с `jumeira1380`

### Изменить ссылку на бонусную программу:
Отредактируйте `public/js/script.js`, найдите `https://iiko.biz/L/051288`

### Изменить Instagram:
Отредактируйте `public/index.html`, найдите `@jumeira_coffee`

## 🎉 Готово!

Ваш сайт готов к работе и полностью функционален!

---
**💝 Создано с любовью для Jumeira Coffee** 