/* Original Game Boy–style chiptune BGM (homage — not Nintendo assets) */

const OUTDOOR_MAPS = new Set([
    'drive', 'parkinglot'
]);

const MusicEngine = (function () {
    let ctx = null;
    let master = null;
    let enabled = true;
    let volume = 0.32;
    let unlocked = false;
    let playingId = null;
    let schedulerTimer = null;
    let bassCursor = { idx: 0, time: 0 };
    let leadCursor = { idx: 0, time: 0 };
    let activeVoices = [];
    let duck = 1;
    let lastSyncKey = '';

    const STEPS_PER_BEAT = 4;

    function midiFreq(m) {
        return 440 * Math.pow(2, (m - 69) / 12);
    }

    /** [midi | 0=rest, length in 16th notes] */
    const TRACKS = {
        title: {
            tempo: 112,
            pulse: 0.5,
            bass: [
                [36, 8], [0, 4], [36, 4], [39, 4], [41, 8], [0, 4], [36, 4], [43, 4],
                [36, 8], [0, 4], [36, 4], [39, 4], [41, 8], [0, 4], [43, 4], [41, 4]
            ],
            lead: [
                [72, 2], [76, 2], [79, 2], [84, 4], [0, 4],
                [79, 2], [76, 2], [72, 2], [76, 4], [79, 4],
                [81, 2], [79, 2], [76, 2], [72, 4], [0, 4],
                [74, 2], [76, 2], [79, 2], [84, 6], [79, 2]
            ]
        },
        intro: {
            tempo: 96,
            pulse: 0.25,
            bass: [
                [48, 12], [0, 4], [52, 8], [0, 4], [50, 12], [0, 4], [47, 8]
            ],
            lead: [
                [72, 6], [74, 2], [76, 4], [79, 4], [0, 8],
                [76, 4], [74, 4], [72, 8], [0, 4], [69, 4], [72, 8]
            ]
        },
        center: {
            tempo: 108,
            pulse: 0.25,
            bass: [
                [43, 4], [43, 4], [48, 4], [48, 4], [41, 4], [41, 4], [46, 4], [46, 4],
                [43, 4], [43, 4], [48, 4], [50, 4], [41, 4], [41, 4], [46, 4], [48, 4]
            ],
            lead: [
                [67, 2], [0, 2], [67, 2], [71, 4], [72, 4], [0, 4],
                [65, 2], [0, 2], [65, 2], [69, 4], [70, 4], [0, 4],
                [67, 2], [71, 2], [72, 2], [74, 4], [72, 4], [71, 4], [67, 4]
            ]
        },
        route: {
            tempo: 132,
            pulse: 0.5,
            bass: [
                [40, 4], [0, 2], [40, 2], [45, 4], [0, 2], [43, 2],
                [38, 4], [0, 2], [38, 2], [43, 4], [45, 4], [0, 4]
            ],
            lead: [
                [64, 2], [67, 2], [71, 2], [72, 2], [74, 4], [72, 2], [71, 2],
                [69, 2], [67, 2], [64, 4], [0, 2], [62, 2], [64, 4],
                [67, 2], [71, 2], [72, 4], [74, 4], [76, 2], [74, 2], [72, 4]
            ]
        },
        battle: {
            tempo: 148,
            pulse: 0.125,
            bass: [
                [36, 2], [36, 2], [34, 2], [34, 2], [31, 2], [31, 2], [29, 2], [29, 2],
                [36, 2], [36, 2], [34, 2], [34, 2], [31, 2], [33, 2], [36, 2], [0, 2]
            ],
            lead: [
                [60, 1], [63, 1], [65, 1], [67, 1], [68, 2], [65, 2], [63, 2], [60, 2],
                [58, 1], [60, 1], [63, 1], [65, 1], [67, 2], [65, 2], [63, 2], [60, 2]
            ]
        },
        night: {
            tempo: 88,
            pulse: 0.25,
            bass: [
                [36, 8], [0, 8], [34, 8], [0, 8], [33, 8], [0, 8], [31, 8], [0, 8]
            ],
            lead: [
                [60, 6], [0, 2], [58, 4], [60, 4], [0, 8],
                [55, 6], [0, 2], [57, 4], [60, 8]
            ]
        }
    };

    function ensureCtx() {
        if (ctx) return ctx;
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = volume * duck;
        master.connect(ctx.destination);
        return ctx;
    }

    function unlock() {
        const c = ensureCtx();
        if (!c || unlocked) return;
        if (c.state === 'suspended') c.resume();
        unlocked = true;
    }

    function setEnabled(on) {
        enabled = !!on;
        if (!enabled) stop();
        else syncGameMusic(true);
    }

    function setVolume(v) {
        volume = Math.max(0, Math.min(1, v));
        if (master) master.gain.value = volume * duck;
    }

    function setDuck(mult) {
        duck = mult;
        if (master) master.gain.value = volume * duck;
    }

    function playNote(midi, durationSec, pulse, startTime, vol) {
        if (!midi || !ctx) return;
        const t0 = startTime;
        const t1 = t0 + durationSec * 0.92;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = midiFreq(midi);
        const peak = vol * (pulse === 0.125 ? 0.09 : 0.12);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t1);
        osc.connect(g);
        g.connect(master);
        osc.start(t0);
        osc.stop(t1 + 0.05);
        activeVoices.push(osc);
        if (activeVoices.length > 48) {
            activeVoices.shift();
        }
    }

    function resetCursors() {
        const t = ctx ? ctx.currentTime + 0.05 : 0;
        bassCursor = { idx: 0, time: t };
        leadCursor = { idx: 0, time: t };
    }

    function scheduleAhead() {
        const track = TRACKS[playingId];
        if (!track || !ctx || !enabled) return;
        const secPerStep = 60 / track.tempo / STEPS_PER_BEAT;
        const horizon = ctx.currentTime + 0.28;

        while (bassCursor.time < horizon || leadCursor.time < horizon) {
            if (bassCursor.time <= leadCursor.time) {
                const cell = track.bass[bassCursor.idx];
                const midi = cell[0];
                const dur = cell[1] * secPerStep;
                if (midi && bassCursor.time >= ctx.currentTime - 0.02) {
                    playNote(midi, dur, track.pulse, bassCursor.time, 0.55);
                }
                bassCursor.time += dur;
                bassCursor.idx = (bassCursor.idx + 1) % track.bass.length;
            } else {
                const cell = track.lead[leadCursor.idx];
                const midi = cell[0];
                const dur = cell[1] * secPerStep;
                if (midi && leadCursor.time >= ctx.currentTime - 0.02) {
                    playNote(midi, dur, track.pulse, leadCursor.time, 0.4);
                }
                leadCursor.time += dur;
                leadCursor.idx = (leadCursor.idx + 1) % track.lead.length;
            }
        }
    }

    function schedulerTick() {
        if (!playingId || !ctx || !enabled) return;
        scheduleAhead();
    }

    function startScheduler() {
        stopScheduler();
        schedulerTimer = setInterval(schedulerTick, 25);
    }

    function stopScheduler() {
        if (schedulerTimer) {
            clearInterval(schedulerTimer);
            schedulerTimer = null;
        }
    }

    function stop() {
        playingId = null;
        stopScheduler();
        activeVoices.forEach(o => {
            try { o.stop(); } catch (e) {}
        });
        activeVoices = [];
    }

    function play(id) {
        if (!enabled || !TRACKS[id]) {
            stop();
            return;
        }
        unlock();
        if (!ctx) return;
        if (playingId === id) return;
        playingId = id;
        resetCursors();
        startScheduler();
    }

    function mapTrack(mapKey) {
        if (OUTDOOR_MAPS.has(mapKey)) return 'route';
        return 'center';
    }

    function resolveTrackId() {
        if (typeof gameState === 'undefined') return null;
        if (gameState === 'TITLE') return 'title';
        if (gameState === 'INTRO') return 'intro';
        if (gameState === 'MENU') return playingId || mapTrack(currentMapKey);
        if (gameState === 'STORY' || gameState === 'CUTSCENE') return 'battle';
        if (gameState === 'PLAYING') {
            if (gameEvents && gameEvents.isAfterHours) return 'night';
            return mapTrack(currentMapKey);
        }
        if (gameState === 'TRANSITION' || gameState === 'FLASH') {
            return playingId || mapTrack(currentMapKey);
        }
        return null;
    }

    function syncGameMusic(force) {
        if (!enabled) {
            if (playingId) stop();
            return;
        }
        const id = resolveTrackId();
        let duckTarget = 1;
        if (gameState === 'MENU') duckTarget = 0.45;
        else if (activeDialogue && (gameState === 'PLAYING' || gameState === 'CUTSCENE')) duckTarget = 0.55;
        setDuck(duckTarget);
        const key = id + '|' + duckTarget;
        if (!force && key === lastSyncKey) return;
        lastSyncKey = key;
        if (!id) {
            stop();
            return;
        }
        if (!unlocked) return;
        play(id);
    }

    function playJingle(kind) {
        if (!enabled) return;
        unlock();
        if (!ctx) return;
        const notes = kind === 'fanfare'
            ? [[72, 0.12], [76, 0.12], [79, 0.12], [84, 0.28], [0, 0.08], [84, 0.2]]
            : [[67, 0.1], [71, 0.1], [74, 0.2]];
        let t = ctx.currentTime + 0.02;
        notes.forEach(([n, d]) => {
            if (n) playNote(n, d, 0.25, t, 0.35);
            t += d;
        });
    }

    function initGameMusic() {
        const tryUnlock = () => {
            unlock();
            syncGameMusic(true);
        };
        ['pointerdown', 'keydown', 'touchstart'].forEach(ev => {
            document.addEventListener(ev, tryUnlock, { once: false, passive: true });
        });
        if (typeof gameSettings !== 'undefined' && gameSettings.musicEnabled === false) {
            enabled = false;
        }
        if (typeof gameSettings !== 'undefined' && typeof gameSettings.musicVolume === 'number') {
            volume = gameSettings.musicVolume;
        }
    }

    return {
        initGameMusic,
        syncGameMusic,
        unlock,
        setEnabled,
        setVolume,
        playJingle,
        stop
    };
})();

function initGameMusic() { MusicEngine.initGameMusic(); }
function syncGameMusic(force) { MusicEngine.syncGameMusic(force); }
function setMusicEnabled(on) { MusicEngine.setEnabled(on); }
function playMusicJingle(kind) { MusicEngine.playJingle(kind); }

window.initGameMusic = initGameMusic;
window.syncGameMusic = syncGameMusic;
window.setMusicEnabled = setMusicEnabled;
window.playMusicJingle = playMusicJingle;
window.MusicEngine = MusicEngine;
