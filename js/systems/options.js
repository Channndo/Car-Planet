/* Options submenu — menu frames & reset game */

const MENU_FRAMES = [
    { id: 'classic', label: 'CLASSIC' },
    { id: 'ruby', label: 'RUBY' },
    { id: 'sapphire', label: 'SAPPHIRE' },
    { id: 'emerald', label: 'EMERALD' },
    { id: 'firered', label: 'FIRE RED' },
    { id: 'leafgreen', label: 'LEAF GREEN' },
    { id: 'diamond', label: 'DIAMOND' },
    { id: 'platinum', label: 'PLATINUM' },
    { id: 'pearl', label: 'PEARL' }
];

let gameSettings = { menuFrame: 'classic' };

function loadGameSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (raw) {
            const s = JSON.parse(raw);
            if (s.menuFrame) gameSettings.menuFrame = s.menuFrame;
        }
    } catch (e) {}
    applyMenuFrame(gameSettings.menuFrame, false);
}

function persistGameSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(gameSettings));
}

function applyMenuFrame(frameId, save) {
    const menu = document.getElementById('start-menu');
    if (!menu) return;
    const valid = MENU_FRAMES.some(f => f.id === frameId);
    gameSettings.menuFrame = valid ? frameId : 'classic';
    MENU_FRAMES.forEach(f => menu.classList.remove('menu-frame-' + f.id));
    menu.classList.add('menu-frame-' + gameSettings.menuFrame);
    updateMenuFrameLabel();
    if (save !== false) persistGameSettings();
}

function getMenuFrameLabel(frameId) {
    const f = MENU_FRAMES.find(x => x.id === frameId);
    return f ? f.label : 'CLASSIC';
}

function updateMenuFrameLabel() {
    const el = document.getElementById('menu-frame-label');
    if (el) el.textContent = getMenuFrameLabel(gameSettings.menuFrame);
}

function showMenuPanel(panelId) {
    document.querySelectorAll('.menu-panel').forEach(p => {
        p.style.display = p.id === panelId ? 'block' : 'none';
    });
}

function openOptionsMenu() {
    const menu = document.getElementById('start-menu');
    if (!menu || gameState !== 'MENU') return;
    showMenuPanel('menu-panel-options');
    document.getElementById('options-header').innerText = 'OPTIONS';
    updateMenuFrameLabel();
}

function closeOptionsMenu() {
    showMenuPanel('menu-panel-main');
}

function cycleMenuFrame() {
    let idx = MENU_FRAMES.findIndex(f => f.id === gameSettings.menuFrame);
    idx = (idx + 1) % MENU_FRAMES.length;
    applyMenuFrame(MENU_FRAMES[idx].id, true);
}

function openResetGameConfirm() {
    document.getElementById('start-menu').style.display = 'none';
    gameState = 'PLAYING';
    activeDialogue = [
        'Reset all game progress?',
        'This cannot be undone.',
        '[CHOICE_RESET_GAME]'
    ];
    activeLine = 0;
    dName.innerText = 'SYSTEM';
    dText.innerText = activeDialogue[0];
    drawPortrait('NONE');
    dContainer.style.display = 'flex';
    checkChoiceTrigger();
}

function resetGameToTitle() {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
}

function openStartMenu() {
    const menu = document.getElementById('start-menu');
    if (!menu) return;
    applyMenuFrame(gameSettings.menuFrame, false);
    showMenuPanel('menu-panel-main');
    document.getElementById('menu-header').innerText = getMenuHeaderLines();
    menu.style.display = 'block';
    gameState = 'MENU';
}

function closeStartMenu() {
    document.getElementById('start-menu').style.display = 'none';
    showMenuPanel('menu-panel-main');
    gameState = 'PLAYING';
}

window.loadGameSettings = loadGameSettings;
window.openOptionsMenu = openOptionsMenu;
window.closeOptionsMenu = closeOptionsMenu;
window.cycleMenuFrame = cycleMenuFrame;
window.openResetGameConfirm = openResetGameConfirm;
window.resetGameToTitle = resetGameToTitle;
window.openStartMenu = openStartMenu;
window.closeStartMenu = closeStartMenu;
