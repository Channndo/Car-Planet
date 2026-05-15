/* Game state, save/load, migration */
const keys = { w: false, a: false, s: false, d: false, space: false, enter: false, b: false };
let actionTriggered = false;
let gameState = 'TITLE';
let playerDetails = { name: 'CHANDLER', gender: 'Boy', inUniform: false, rivalName: 'KASEY', hasRunningShoes: false };
let currentMapKey = 'drive';
let gameEvents = {
    firstCustomerTriggered: false, currentDay: 1, dailyWalkIn: false,
    dailyAptsCompleted: 0, dailyWalkInDone: false, timeMinutes: 420, tick: 0,
    isAfterHours: false, carWaitingForRO: false
};
let questState = { active: false, step: 0, talkedToMike: false, assignedTo: null, roNumber: 600000 };
let probation = {
    active: false,
    startCalendarDay: 2,
    day: 0,
    day2MeetingComplete: false,
    day2MeetingPending: false,
    csiScore: 100,
    strikes: 0,
    warnings: 0,
    serviceROs: 0,
    metCustomerIds: []
};
let transition = { active: false, alpha: 0, state: 'none', dest: null };
let flash = { active: false, alpha: 0, state: 'none' };
let currentChoiceType = '';
let activeDialogue = null;
let activeLine = 0;
let introIndex = 0;

const introScript = [
    { char: 'RICK', text: "Hello there! Welcome to\nthe world of AUTOMOTIVE REPAIR!" },
    { char: 'RICK', text: "My name is RICK SELLERS.\nI'm the FIXED OPS MANAGER." },
    { char: 'RICK', text: "This world is inhabited by\ncreatures called... TECHNICIANS." },
    { char: 'RICK', text: "Some advisors treat them\nas partners.\nOthers just yell at them." },
    { char: 'RICK', text: "First, tell me a little\nabout yourself." },
    { type: 'ACTION', action: '[SHOW_GENDER]' },
    { char: 'RICK', text: "And what is your name?" },
    { type: 'ACTION', action: '[SHOW_NAME]' },
    { char: 'RICK', text: "Right! So your name is\n[PLAYER_NAME]!" },
    { char: 'RICK', text: "The Service Manager's nephew\nis working here as a Lube Tech.\nHe is your rival." },
    { char: 'RICK', text: "...Erm, what is his name again?" },
    { type: 'ACTION', action: '[SHOW_RIVAL_NAME]' },
    { char: 'RICK', text: "Ah, that's right!\nHis name is [RIVAL_NAME]!" },
    { char: 'RICK', text: "[PLAYER_NAME]! Your dealership\nlegend is about to unfold!" },
    { char: 'RICK', text: "A world of flat-rate nightmares\nawaits! Let's go!" },
    { type: 'ACTION', action: '[START_GAME]' }
];

function defaultProbation() {
    return {
        active: false, startCalendarDay: 2, day: 0,
        day2MeetingComplete: false, day2MeetingPending: false,
        csiScore: 100, strikes: 0, warnings: 0, serviceROs: 0,
        metCustomerIds: [],
        daysSucceeded: 0, daysFailed: 0,
        weekRosCompleted: 0, currentWeek: 1,
        lastDayGrade: null, outcome: null,
        firedReason: null, finalReviewComplete: false,
        storyEventDays: [], storyEventDaysUsed: [], storyEventsPlayedIds: []
    };
}

function migrateSaveData(s) {
    if (s.gameEvents) {
        gameEvents = s.gameEvents;
        if (gameEvents.dailyAptsCompleted === undefined) {
            gameEvents.dailyAptsCompleted = gameEvents.dailyAptDone ? 3 : 0;
        }
        if (gameEvents.timeMinutes === undefined) gameEvents.timeMinutes = 420;
        if (gameEvents.tick === undefined) gameEvents.tick = 0;
        if (gameEvents.isAfterHours === undefined) gameEvents.isAfterHours = false;
        if (gameEvents.carWaitingForRO === undefined) gameEvents.carWaitingForRO = false;
        if (gameEvents.inDay2Meeting === undefined) gameEvents.inDay2Meeting = false;
        if (gameEvents.pendingDay2Meeting === undefined) gameEvents.pendingDay2Meeting = false;
        if (gameEvents.intradayWalkInRolled === undefined) gameEvents.intradayWalkInRolled = false;
    }
    if (s.probation && !probation.metCustomerIds) probation.metCustomerIds = [];
    if (s.questState) questState = s.questState;
    if (s.probation) probation = Object.assign(defaultProbation(), s.probation);
    if (s.playerDetails) playerDetails = s.playerDetails;
    if (s.currentMapKey) currentMapKey = s.currentMapKey;
    if (playerDetails.hasRunningShoes === undefined) playerDetails.hasRunningShoes = false;
    if (!gameEvents.currentDay) gameEvents.currentDay = 1;
}

function tryRestoreFromSave() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    try {
        migrateSaveData(JSON.parse(raw));
        gameState = 'PLAYING';
        document.getElementById('intro-screen').style.display = 'none';
        document.getElementById('title-screen').style.display = 'none';
        return true;
    } catch (e) {
        localStorage.removeItem(SAVE_KEY);
        return false;
    }
}

function buildSavePayload() {
    return {
        saveVersion: SAVE_VERSION,
        player,
        playerDetails,
        currentMapKey,
        gameEvents,
        questState,
        probation
    };
}

function persistGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(buildSavePayload()));
}

let player;
