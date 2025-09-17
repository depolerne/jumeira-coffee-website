const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Временное хранилище отзывов в памяти (для Vercel)
let reviews = [
    {
        id: 1703894400000,
        name: "Мария Иванова",
        phone: "+7 (903) 456-78-90",
        email: "maria@example.com", 
        review: "Отличный кофе и уютная атмосфера! Всегда свежая выпечка и приветливый персонал. Рекомендую попробовать капучино с корицей.",
        timestamp: "2023-12-29T18:00:00.000Z",
        date: "29.12.2023",
        hidden: false
    },
    {
        id: 1703721600000,
        name: "Алексей Смирнов",
        phone: "+7 (915) 234-56-78",
        email: "alex@example.com",
        review: "Прекрасное место для работы с ноутбуком. Быстрый Wi-Fi, удобные столики и вкусный кофе. Часто прихожу сюда по утрам.",
        timestamp: "2023-12-27T20:00:00.000Z",
        date: "28.12.2023",
        hidden: false
    },
    {
        id: 1703635200000,
        name: "Елена Петрова",
        phone: "+7 (926) 789-01-23",
        email: "elena@example.com",
        review: "Замечательные десерты и ароматный кофе! Особенно понравился тирамису. Обслуживание на высоте, обязательно вернусь.",
        timestamp: "2023-12-26T22:00:00.000Z",
        date: "27.12.2023",
        hidden: false
    }
];

// Получить все отзывы (только видимые)
app.get('/api/reviews', (req, res) => {
    try {
        const visibleReviews = reviews.filter(review => !review.hidden);
        res.json(visibleReviews);
    } catch (error) {
        console.error('Ошибка при чтении отзывов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавить новый отзыв
app.post('/api/reviews', (req, res) => {
    try {
        const { name, phone, email, review } = req.body;
        
        // Валидация
        if (!name || !review) {
            return res.status(400).json({ error: 'Имя и отзыв обязательны для заполнения' });
        }
        
        if (review.length > 500) {
            return res.status(400).json({ error: 'Отзыв не может быть длиннее 500 символов' });
        }
        
        const newReview = {
            id: Date.now(),
            name: name.trim(),
            phone: phone ? phone.trim() : '',
            email: email ? email.trim() : '',
            review: review.trim(),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('ru-RU'),
            hidden: false
        };
        
        reviews.push(newReview);
        
        res.status(201).json({ message: 'Отзыв успешно добавлен', review: newReview });
    } catch (error) {
        console.error('Ошибка при добавлении отзыва:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Аутентификация админа
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === 'jumeira1380') {
        res.json({ success: true, token: 'admin-authenticated' });
    } else {
        res.status(401).json({ error: 'Неверный пароль' });
    }
});

// Получить все отзывы для админа
app.get('/api/admin/reviews', (req, res) => {
    try {
        res.json(reviews);
    } catch (error) {
        console.error('Ошибка при чтении отзывов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновить отзыв (скрыть/показать, редактировать)
app.put('/api/admin/reviews/:id', (req, res) => {
    try {
        const reviewId = parseInt(req.params.id);
        const updates = req.body;
        
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);
        
        if (reviewIndex === -1) {
            return res.status(404).json({ error: 'Отзыв не найден' });
        }
        
        // Обновляем отзыв
        reviews[reviewIndex] = { ...reviews[reviewIndex], ...updates };
        
        res.json({ message: 'Отзыв обновлен', review: reviews[reviewIndex] });
    } catch (error) {
        console.error('Ошибка при обновлении отзыва:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удалить отзыв
app.delete('/api/admin/reviews/:id', (req, res) => {
    try {
        const reviewId = parseInt(req.params.id);
        
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);
        
        if (reviewIndex === -1) {
            return res.status(404).json({ error: 'Отзыв не найден' });
        }
        
        reviews.splice(reviewIndex, 1);
        
        res.json({ message: 'Отзыв удален' });
    } catch (error) {
        console.error('Ошибка при удалении отзыва:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Страница отзывов
app.get('/reviews.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reviews.html'));
});

// Админ панель отзывов
app.get('/reviews/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reviews-admin.html'));
});

// Админ панель
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📝 Откройте http://localhost:${PORT} для просмотра сайта`);
});

// Экспорт для Vercel
module.exports = app;