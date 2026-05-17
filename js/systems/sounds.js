/* UI / intercom sounds (Web Audio — no asset files) */

const GameSounds = (function () {
    let ctx = null;

    function ensureCtx() {
        if (ctx) return ctx;
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        return ctx;
    }

    function unlock() {
        const c = ensureCtx();
        if (c && c.state === 'suspended') c.resume();
    }

    function tone(freq, start, dur, vol, type) {
        const c = ensureCtx();
        if (!c) return;
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = type || 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(vol, start + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.connect(g);
        g.connect(c.destination);
        osc.start(start);
        osc.stop(start + dur + 0.02);
    }

    /** Service-drive intercom / PA ping */
    function playIntercomPing() {
        unlock();
        const c = ensureCtx();
        if (!c) return;
        const t = c.currentTime + 0.02;
        tone(880, t, 0.12, 0.14, 'sine');
        tone(1174.66, t + 0.1, 0.18, 0.12, 'sine');
        tone(660, t + 0.05, 0.08, 0.06, 'square');
    }

    function playStoryChime() {
        unlock();
        const c = ensureCtx();
        if (!c) return;
        const t = c.currentTime + 0.02;
        tone(523.25, t, 0.1, 0.08, 'triangle');
        tone(659.25, t + 0.08, 0.14, 0.07, 'triangle');
    }

    return { playIntercomPing, playStoryChime, unlock };
})();

function playIntercomPing() {
    GameSounds.playIntercomPing();
}

function playStoryChime() {
    GameSounds.playStoryChime();
}

function notifyDriveCustomerPresent(reason) {
    if (!maps || !maps.drive) return;
    const cust = maps.drive.npcs.find(n => n.id === 'angry_customer');
    const car = maps.drive.npcs.find(n => n.id === 'customer_car');
    if (!cust || !car || cust.hidden || car.hidden) return;
    const tag = reason + '_' + (cust.name || 'cust') + '_' + questState.step;
    if (gameEvents.driveIntercomTag === tag) return;
    gameEvents.driveIntercomTag = tag;
    playIntercomPing();
}

window.playIntercomPing = playIntercomPing;
window.playStoryChime = playStoryChime;
window.notifyDriveCustomerPresent = notifyDriveCustomerPresent;
window.GameSounds = GameSounds;
