const PROC_FIRST_NAMES = ['ALEX', 'JORDAN', 'CASEY', 'RILEY', 'MORGAN', 'QUINN', 'AVERY', 'DREW', 'SKYLAR', 'REAGAN', 'BLAKE', 'TAYLOR', 'JAMIE', 'PAT', 'SAM'];
const PROC_LAST_NAMES = ['BAKER', 'COLLINS', 'FISHER', 'HAYES', 'OWENS', 'PERRY', 'REED', 'SHAW', 'WELLS', 'BURKE', 'DALE', 'HART', 'NASH', 'PIKE', 'VOSS'];

function randomProceduralName() {
    const f = PROC_FIRST_NAMES[Math.floor(Math.random() * PROC_FIRST_NAMES.length)];
    const l = PROC_LAST_NAMES[Math.floor(Math.random() * PROC_LAST_NAMES.length)];
    return f + ' ' + l;
}
