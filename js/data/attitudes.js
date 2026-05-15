/* Customer mood per visit — affects dialogue */
const ATTITUDE_IDS = ['Happy', 'Angry', 'Confused', 'Impatient', 'Suspicious'];

const ATTITUDE_OPENERS = {
    Happy: [
        "Great to see you!",
        "Hope you're having a good day.",
        "This dealership is always friendly."
    ],
    Angry: [
        "I've been waiting forever!",
        "Nobody told me it would take this long!",
        "This is unacceptable."
    ],
    Confused: [
        "Um... I'm not sure what's wrong.",
        "My husband said bring it here?",
        "Is this the service drive or sales?"
    ],
    Impatient: [
        "I need to make a call in 20 minutes.",
        "Can we hurry this up?",
        "I have kids in the car."
    ],
    Suspicious: [
        "You're not gonna upsell me, right?",
        "I watched a video about dealer scams.",
        "Just do what I asked. Nothing extra."
    ]
};

function rollAttitude() {
    return ATTITUDE_IDS[Math.floor(Math.random() * ATTITUDE_IDS.length)];
}

function pickAttitudeOpener(attitude) {
    const list = ATTITUDE_OPENERS[attitude] || ATTITUDE_OPENERS.Happy;
    return list[Math.floor(Math.random() * list.length)];
}

function buildCustomerDialogue(customer, attitude, context) {
    const lines = [];
    lines.push(pickAttitudeOpener(attitude));
    if (customer.personalityLine) lines.push(customer.personalityLine);
    const complaint = customer.complaintPool[Math.floor(Math.random() * customer.complaintPool.length)];
    lines.push(complaint);
    if (context === 'appointment') {
        lines.push("Are you going to check me in?");
    } else if (context === 'walkin') {
        lines.push("I don't have an appointment.\nCan you squeeze me in?");
    }
    return lines;
}

function buildCarDialogue(customer) {
    const v = customer.vehicle;
    const label = formatVehicleLabel(v);
    return [
        label + ".",
        customer.carNote || "Ready for the service team."
    ];
}
