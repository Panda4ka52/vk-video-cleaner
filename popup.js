const toggle = document.getElementById('toggle');
const statusText = document.getElementById('status-text');
const themeBtn = document.getElementById('theme-btn');

// --- ЛОГИКА ФИЛЬТРА ---
chrome.storage.local.get({ enabled: true }, (data) => {
    toggle.checked = data.enabled;
    updateText(data.enabled);
});

toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    chrome.storage.local.set({ enabled: enabled });
    updateText(enabled);
});

function updateText(enabled) {
    statusText.textContent = enabled ? 'Включено' : 'Выключено';
}

// --- ЛОГИКА ТЕМЫ ---
// Загружаем сохраненную тему при открытии
chrome.storage.local.get({ theme: 'dark' }, (data) => {
    if (data.theme === 'light') {
        document.body.classList.add('light-theme');
        themeBtn.textContent = '🌙';
    } else {
        themeBtn.textContent = '🌞';
    }
});

// Переключаем тему при клике
themeBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    const newTheme = isLight ? 'light' : 'dark';
    
    chrome.storage.local.set({ theme: newTheme });
    themeBtn.textContent = isLight ? '🌙' : '🌞';
});