let isEnabled = true;

// Загружаем состояние при старте
chrome.storage.local.get({ enabled: true }, (data) => {
    isEnabled = data.enabled;
    if (!isEnabled) unhideAll();
});

// Ловим клик по тумблеру
chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) {
        isEnabled = changes.enabled.newValue;
        if (!isEnabled) unhideAll();
    }
});

// Плавно скрываем блок (быстрая анимация)
function hideBlock(block) {
    if (!block || block.getAttribute('data-vk-cleaner-hidden') === 'true') return;
    
    // Сразу помечаем, чтобы цикл не пытался скрыть его снова
    block.setAttribute('data-vk-cleaner-hidden', 'true');
    
    // Включаем плавность и делаем прозрачным (0.2 секунды)
    block.style.transition = 'opacity 0.2s ease';
    block.style.opacity = '0';
    
    // Через 200 мс (когда анимация закончится) убираем из потока
    setTimeout(() => {
        block.style.display = 'none';
    }, 200);
}

// Возвращаем блоки на место (при выключении тумблера)
function unhideAll() {
    const hiddenBlocks = document.querySelectorAll('[data-vk-cleaner-hidden="true"]');
    hiddenBlocks.forEach(block => {
        block.style.display = '';
        block.style.opacity = '1'; // Возвращаем видимость
        block.style.transition = 'opacity 0.15s ease'; // Быстрое появление
        block.removeAttribute('data-vk-cleaner-hidden');
    });
}

// Основной цикл
setInterval(() => {
    if (!isEnabled) return;

    const elements = document.querySelectorAll('h2, h3, span, div');
    
    for (let el of elements) {
        if (el.textContent.trim() === 'Смотрите также') {
            let block = el.closest('section') || el.closest('div[class*="GroupCard"]');
            
            if (block) {
                hideBlock(block); // Используем нашу новую функцию
            } else {
                let parent = el.parentElement.parentElement;
                if (parent) hideBlock(parent);
            }
        }
    }
}, 1000);