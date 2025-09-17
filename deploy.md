# 🚀 Быстрый деплой на Vercel

## Способ 1: Через GitHub (Рекомендуется)

1. **Загрузите код на GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Jumeira Coffee website"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Деплой на Vercel:**
   - Идите на [vercel.com](https://vercel.com)
   - Зарегистрируйтесь/войдите через GitHub
   - Нажмите "New Project"
   - Выберите ваш репозиторий
   - Нажмите "Deploy"

## Способ 2: Через Vercel CLI

1. **Установите Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Войдите в аккаунт:**
   ```bash
   vercel login
   ```

3. **Деплой:**
   ```bash
   vercel
   ```

## ⚙️ Настройки для Vercel

Убедитесь, что:
- ✅ `vercel.json` настроен
- ✅ `package.json` содержит правильные скрипты
- ✅ Все файлы в папке `public/`

## 🔗 После деплоя

- Основной сайт: `https://your-project.vercel.app`
- Админ панель: `https://your-project.vercel.app/admin.html`

## 🗄️ База данных

На Vercel файлы создаются в `/tmp`, поэтому для продакшна рекомендуется:
- **MongoDB Atlas** (бесплатно)
- **Firebase Firestore**
- **Supabase**

## 📱 Тестирование

После деплоя проверьте:
- ✅ Главная страница загружается
- ✅ Форма отзывов работает
- ✅ Кнопка бонусной карты работает
- ✅ Адаптивность на мобильных
- ✅ Админ панель доступна 