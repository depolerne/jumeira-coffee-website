// DOM элементы
const reviewBtn = document.getElementById('reviewBtn');
const bonusBtn = document.getElementById('bonusBtn');
const reviewModal = document.getElementById('reviewModal');
const overlay = document.getElementById('overlay');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const reviewForm = document.getElementById('reviewForm');
const successMessage = document.getElementById('successMessage');
const submitBtn = document.getElementById('submitBtn');
const charCount = document.getElementById('charCount');
const reviewTextarea = document.getElementById('review');
const phoneInput = document.getElementById('phone');

// Утилиты
class Utils {
    static formatPhone(value) {
        // Удаляем все кроме цифр
        const cleaned = value.replace(/\D/g, '');
        
        // Форматируем телефон в формате +7 (XXX) XXX-XX-XX
        if (cleaned.length >= 1 && cleaned[0] === '7') {
            const match = cleaned.match(/^7(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
            if (match) {
                let formatted = '+7';
                if (match[1]) formatted += ` (${match[1]}`;
                if (match[2]) formatted += `) ${match[2]}`;
                if (match[3]) formatted += `-${match[3]}`;
                if (match[4]) formatted += `-${match[4]}`;
                return formatted;
            }
        }
        
        return value;
    }
    
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Удаляем через 4 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 4000);
    }
}

// Класс для работы с модальными окнами
class Modal {
    constructor(modalElement, overlayElement) {
        this.modal = modalElement;
        this.overlay = overlayElement;
        this.isOpen = false;
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Закрытие по клику на overlay
        this.overlay.addEventListener('click', () => this.close());
        
        // Закрытие по клавише Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    open() {
        this.modal.classList.add('show');
        this.overlay.classList.add('show');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Фокус на первом поле формы
        const firstInput = this.modal.querySelector('input, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
    
    close() {
        this.modal.classList.remove('show');
        this.overlay.classList.remove('show');
        this.isOpen = false;
        document.body.style.overflow = '';
    }
}

// Класс для работы с формой отзывов
class ReviewForm {
    constructor(formElement, submitButton, modalInstance) {
        this.form = formElement;
        this.submitBtn = submitButton;
        this.modal = modalInstance;
        this.isSubmitting = false;
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Счетчик символов для отзыва
        reviewTextarea.addEventListener('input', this.updateCharCount);
        
        // Форматирование телефона
        phoneInput.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const formatted = Utils.formatPhone(e.target.value);
            e.target.value = formatted;
            
            // Восстанавливаем позицию курсора
            const newPosition = Math.min(cursorPosition + (formatted.length - e.target.value.length), formatted.length);
            e.target.setSelectionRange(newPosition, newPosition);
        });
        
        // Валидация в реальном времени
        this.form.querySelectorAll('input[required], textarea[required]').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', Utils.debounce(() => this.validateField(field), 300));
        });
    }
    
    updateCharCount() {
        const current = reviewTextarea.value.length;
        const max = 500;
        charCount.textContent = current;
        
        const counter = document.querySelector('.char-counter');
        if (current > max * 0.9) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        
        // Удаляем предыдущие ошибки
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        field.classList.remove('error', 'success');
        
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Это поле обязательно для заполнения');
            return false;
        }
        
        if (field.type === 'email' && value && !Utils.validateEmail(value)) {
            this.showFieldError(field, 'Введите корректный email адрес');
            return false;
        }
        
        if (field.name === 'review' && value.length > 500) {
            this.showFieldError(field, 'Отзыв не может быть длиннее 500 символов');
            return false;
        }
        
        if (value) {
            field.classList.add('success');
        }
        
        return true;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    validateForm() {
        const fields = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        if (!this.validateForm()) {
            Utils.showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
            return;
        }
        
        this.setLoading(true);
        
        try {
            const formData = new FormData(this.form);
            const data = {
                name: formData.get('name').trim(),
                phone: formData.get('phone').trim(),
                email: formData.get('email').trim(),
                review: formData.get('review').trim()
            };
            
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.handleSuccess();
            } else {
                throw new Error(result.error || 'Произошла ошибка при отправке отзыва');
            }
            
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            Utils.showNotification(error.message || 'Произошла ошибка при отправке отзыва', 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    setLoading(loading) {
        this.isSubmitting = loading;
        this.submitBtn.disabled = loading;
        
        if (loading) {
            this.submitBtn.classList.add('loading');
        } else {
            this.submitBtn.classList.remove('loading');
        }
    }
    
    handleSuccess() {
        // Закрываем модальное окно
        this.modal.close();
        
        // Показываем сообщение об успехе
        successMessage.classList.add('show');
        overlay.classList.add('show');
        
        // Очищаем форму
        this.form.reset();
        this.updateCharCount();
        
        // Убираем классы валидации
        this.form.querySelectorAll('.success, .error').forEach(el => {
            el.classList.remove('success', 'error');
        });
        
        this.form.querySelectorAll('.field-error').forEach(el => el.remove());
        
        // Скрываем сообщение об успехе через 3 секунды
        setTimeout(() => {
            successMessage.classList.remove('show');
            overlay.classList.remove('show');
        }, 3000);
        
        Utils.showNotification('Спасибо за ваш отзыв!', 'success');
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Создаем экземпляры классов
    const modal = new Modal(reviewModal, overlay);
    const form = new ReviewForm(reviewForm, submitBtn, modal);
    
    // Обработчики событий для кнопок
    reviewBtn.addEventListener('click', () => {
        modal.open();
    });
    
    bonusBtn.addEventListener('click', () => {
        // Показываем уведомление о переходе
        Utils.showNotification('Переходим к регистрации бонусной карты...', 'info');
        
        // Открываем ссылку через короткую задержку
        setTimeout(() => {
            window.open('https://iiko.biz/L/051288', '_blank');
        }, 1000);
    });
    
    closeModal.addEventListener('click', () => {
        modal.close();
    });
    
    cancelBtn.addEventListener('click', () => {
        modal.close();
    });
    
    // Закрытие сообщения об успехе по клику
    successMessage.addEventListener('click', () => {
        successMessage.classList.remove('show');
        overlay.classList.remove('show');
    });
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками функций
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Добавляем стили для уведомлений
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 300px;
            }
            
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-success {
                border-left: 4px solid #28a745;
            }
            
            .notification-error {
                border-left: 4px solid #dc3545;
            }
            
            .notification-info {
                border-left: 4px solid #17a2b8;
            }
            
            .notification i {
                font-size: 18px;
            }
            
            .notification-success i {
                color: #28a745;
            }
            
            .notification-error i {
                color: #dc3545;
            }
            
            .notification-info i {
                color: #17a2b8;
            }
            
            .field-error {
                color: #dc3545;
                font-size: 14px;
                margin-top: 5px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .field-error::before {
                content: '⚠';
                font-size: 12px;
            }
            
            .form-group input.error,
            .form-group textarea.error {
                border-color: #dc3545;
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
            }
            
            .form-group input.success,
            .form-group textarea.success {
                border-color: #28a745;
            }
            
            @media (max-width: 480px) {
                .notification {
                    right: 15px;
                    left: 15px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    console.log('🎉 Jumeira Coffee сайт загружен!');
});

// Экспорт для использования в других модулях (если потребуется)
window.JumeiraCoffee = {
    Utils,
    Modal,
    ReviewForm
}; 