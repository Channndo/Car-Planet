/* Options submenu — menu frames, control board color & reset game */

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

const CONTROL_BOARDS = [
    { id: 'black', label: 'BLACK' },
    { id: 'grape', label: 'GRAPE' },
    { id: 'teal', label: 'TEAL' },
    { id: 'berry', label: 'BERRY' },
    { id: 'kiwi', label: 'KIWI' },
    { id: 'dandelion', label: 'DANDELION' },
    { id: 'atomic', label: 'ATOMIC' },
    { id: 'classic', label: 'CLASSIC GRAY' }
];

let gameSettings = { menuFrame: 'classic', controlBoard: 'black' };

function loadGameSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (raw) {
            const s = JSON.parse(raw);
            if (s.menuFrame) gameSettings.menuFrame = s.menuFrame;
            if (s.controlBoard) gameSettings.controlBoard = s.controlBoard;
        }
    } catch (e) {}
    applyMenuFrame(gameSettings.menuFrame, false);
    applyControlBoard(gameSettings.controlBoard, false);
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

function applyControlBoard(boardId, save) {
    const controls = document.getElementById('controls');
    const screen = document.getElementById('game-screen');
    if (!controls) return;
    const valid = CONTROL_BOARDS.some(b => b.id === boardId);
    gameSettings.controlBoard = valid ? boardId : 'black';
    CONTROL_BOARDS.forEach(b => {
        controls.classList.remove('control-board-' + b.id);
        if (screen) screen.classList.remove('control-board-screen-' + b.id);
    });
    controls.classList.add('control-board-' + gameSettings.controlBoard);
    if (screen) screen.classList.add('control-board-screen-' + gameSettings.controlBoard);
    updateControlBoardLabel();
    if (save !== false) persistGameSettings();
}

function getMenuFrameLabel(frameId) {
    const f = MENU_FRAMES.find(x => x.id === frameId);
    return f ? f.label : 'CLASSIC';
}

function getControlBoardLabel(boardId) {
    const b = CONTROL_BOARDS.find(x => x.id === boardId);
    return b ? b.label : 'BLACK';
}

function updateMenuFrameLabel() {
    const el = document.getElementById('menu-frame-label');
    if (el) el.textContent = getMenuFrameLabel(gameSettings.menuFrame);
}

function updateControlBoardLabel() {
    const el = document.getElementById('control-board-label');
    if (el) el.textContent = getControlBoardLabel(gameSettings.controlBoard);
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
    updateControlBoardLabel();
}

function closeOptionsMenu() {
    showMenuPanel('menu-panel-main');
}

function cycleMenuFrame() {
    let idx = MENU_FRAMES.findIndex(f => f.id === gameSettings.menuFrame);
    idx = (idx + 1) % MENU_FRAMES.length;
    applyMenuFrame(MENU_FRAMES[idx].id, true);
}

function cycleControlBoard(e) {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    let idx = CONTROL_BOARDS.findIndex(b => b.id === gameSettings.controlBoard);
    idx = (idx + 1) % CONTROL_BOARDS.length;
    applyControlBoard(CONTROL_BOARDS[idx].id, true);
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
    applyControlBoard(gameSettings.controlBoard, false);
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
window.cycleControlBoard = cycleControlBoard;
window.openResetGameConfirm = openResetGameConfirm;
window.resetGameToTitle = resetGameToTitle;
window.openStartMenu = openStartMenu;
window.closeStartMenu = closeStartMenu;
