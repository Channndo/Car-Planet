/* Probation daily story beats — at least one scripted event per calendar day */
const STORY_EVENTS = [
    {
        id: 'probation_starts',
        minDay: 1, maxDay: 3, weight: 3,
        lines: [
            { name: 'MIKE', portrait: 'MIKE', text: 'Word travels fast on the drive.\nEveryone knows you\'re on probation.' },
            { name: 'MIKE', portrait: 'MIKE', text: 'Don\'t give Whit and Zack\nammunition. Handle your lane.' }
        ]
    },
    {
        id: 'rival_stapler',
        minDay: 1, maxDay: 20, weight: 2,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'Your desk stapler is missing.\nA note reads: "Catch up. — [RIVAL_NAME]"' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'You find it in the coolant\nbucket in the shop. Nice.' }
        ],
        effects: { csi: -1 }
    },
    {
        id: 'bronson_comeback',
        minDay: 3, maxDay: 90, weight: 2,
        lines: [
            { name: 'BRONSON', portrait: 'BRONSON', text: 'That oil change you sold me\nyesterday? Customer\'s back.' },
            { name: 'BRONSON', portrait: 'BRONSON', text: 'Engine\'s knocking louder\nthan a Ford Festiva concert.' },
            { name: 'MIKE', portrait: 'MIKE', text: '[PLAYER_NAME], walk it with\nBronson before CSI tanks.' }
        ],
        effects: { csi: -2 }
    },
    {
        id: 'vinnie_refuses',
        minDay: 2, maxDay: 60, weight: 2,
        lines: [
            { name: 'VINNIE', portrait: 'VINNIE', text: 'I\'m not touching that Fusion.\nSmells like burnt CVT fluid.' },
            { name: 'VINNIE', portrait: 'VINNIE', text: 'Write it for Bronson.\nI\'m eating a sub.' }
        ]
    },
    {
        id: 'coffee_dead',
        minDay: 1, maxDay: 90, weight: 2,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'The breakroom coffee maker\ndied mid-pour.' },
            { name: 'WHITNEY', portrait: 'WHITNEY', text: 'If I don\'t get caffeine,\nCSI is YOUR problem.' }
        ]
    },
    {
        id: 'parts_apocalypse',
        minDay: 5, maxDay: 90, weight: 2,
        lines: [
            { name: 'JAKE', portrait: 'JAKE', text: 'Your air filter\'s on backorder.\nNationwide. Don\'t yell at me.' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'The guest is reading reviews\non their phone. Smiling.' }
        ],
        effects: { csi: -1 }
    },
    {
        id: 'zack_spill',
        minDay: 4, maxDay: 50, weight: 2,
        lines: [
            { name: 'ZACK', portrait: 'ZACK', text: 'Who left a latte on the\nparts counter?!' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'A sticky note says\n"Not me. — Zack"' }
        ]
    },
    {
        id: 'survey_bomb',
        minDay: 8, maxDay: 90, weight: 2,
        lines: [
            { name: 'MIKE', portrait: 'MIKE', text: 'We got a 1-star survey.\nGuest waited 20 minutes.' },
            { name: 'MIKE', portrait: 'MIKE', text: 'I don\'t care whose RO it was.\nThe drive is a team sport.' }
        ],
        effects: { csi: -3, warning: 'Slow greet time flagged on survey.' }
    },
    {
        id: 'lottery_pool',
        minDay: 10, maxDay: 90, weight: 1,
        lines: [
            { name: 'RYAN', portrait: 'RYAN', text: 'Advisor lottery pool.\nFive bucks. Winner buys lunch.' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'You put in five dollars.\nWhitney wins. Of course.' }
        ]
    },
    {
        id: 'turkey_lot',
        minDay: 12, maxDay: 80, weight: 1,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'A wild turkey is strutting\nacross the parking lot.' },
            { name: 'DAVE', portrait: 'DAVE', text: 'Don\'t feed it. Last time\nit attacked a Navigator.' }
        ]
    },
    {
        id: 'whitney_csr',
        minDay: 6, maxDay: 90, weight: 2,
        lines: [
            { name: 'WHITNEY', portrait: 'WHITNEY', text: 'My CSI is 98. What\'s yours,\n[PLAYER_NAME]?' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'You nod and walk faster\nto the drive.' }
        ],
        effects: { csi: 1 }
    },
    {
        id: 'joe_coolant',
        minDay: 3, maxDay: 70, weight: 2,
        lines: [
            { name: 'JOE', portrait: 'JOE', text: 'Hey, you want a coolant?\nOrange. Very orange.' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'You politely decline.\nJoe shrugs and vanishes.' }
        ]
    },
    {
        id: 'damone_cool',
        minDay: 15, maxDay: 90, weight: 1,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'Damone leans on a toolbox\nlike a catalog model.' },
            { name: 'GUS', portrait: 'GUS', text: 'How does he DO that?' }
        ]
    },
    {
        id: 'paint_fumes',
        minDay: 20, maxDay: 90, weight: 1,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'Paint booth fumes drift\ninto the drive. Again.' },
            { name: 'MIKE', portrait: 'MIKE', text: 'Stan\'s clear coat is not\nan excuse for slow write-ups.' }
        ]
    },
    {
        id: 'extended_warranty',
        minDay: 7, maxDay: 90, weight: 2,
        lines: [
            { name: 'RYAN', portrait: 'RYAN', text: 'Extended warranty vendor\non line two. Again.' },
            { name: 'RYAN', portrait: 'RYAN', text: 'Tell them I died.\nI\'m busy.' }
        ]
    },
    {
        id: 'rival_prank_ro',
        minDay: 5, maxDay: 40, weight: 2,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'RO #' + (questState.roNumber - 1) + ' printed\nwith the wrong VIN.' },
            { name: 'SYSTEM', portrait: 'NONE', text: '[RIVAL_NAME] grins from the\nlube lane. "Typo."' }
        ],
        effects: { csi: -2, warning: 'Paperwork error on the drive.' }
    },
    {
        id: 'mike_shoes',
        minDay: 2, maxDay: 15, weight: 2,
        lines: [
            { name: 'MIKE', portrait: 'MIKE', text: 'Those running shoes helping?\nI see you sprinting now.' },
            { name: 'MIKE', portrait: 'MIKE', text: 'Use \'em. Guests don\'t wait\nfor slow advisors.' }
        ],
        effects: { csi: 1 }
    },
    {
        id: 'customer_photo',
        minDay: 10, maxDay: 90, weight: 1,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'A guest is filming the drive\nfor "TikTok transparency."' },
            { name: 'WHITNEY', portrait: 'WHITNEY', text: 'Smile. You\'re on camera.' }
        ]
    },
    {
        id: 'loaner_shortage',
        minDay: 18, maxDay: 90, weight: 2,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'Zero loaners left.\nThree guests need rides.' },
            { name: 'MIKE', portrait: 'MIKE', text: 'Uber cards are in my office.\nDon\'t you dare overspend.' }
        ],
        effects: { csi: -1 }
    },
    {
        id: 'team_lunch',
        minDay: 25, maxDay: 90, weight: 1,
        lines: [
            { name: 'MIKE', portrait: 'MIKE', text: 'Pizza in the breakroom.\nFixed ops bought lunch.' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'Morale +1. Grease stains +3.' }
        ],
        effects: { csi: 2 }
    },
    {
        id: 'flood_watch',
        minDay: 30, maxDay: 90, weight: 1,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'Thunderstorm warning.\nMove the F-150s off the lot lip.' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'You push three trucks uphill.\nYour shoes survive.' }
        ],
        effects: { csi: 1 }
    },
    {
        id: 'secret_shopper',
        minDay: 20, maxDay: 85, weight: 2,
        lines: [
            { name: 'MIKE', portrait: 'MIKE', text: 'Corporate secret shopper\nhit the drive yesterday.' },
            { name: 'MIKE', portrait: 'MIKE', text: 'They liked your greeting.\nDon\'t get cocky.' }
        ],
        effects: { csi: 3 }
    },
    {
        id: 'bronson_flat',
        minDay: 35, maxDay: 90, weight: 1,
        lines: [
            { name: 'BRONSON', portrait: 'BRONSON', text: 'I flat-spotted a tire\non a comeback.' },
            { name: 'BRONSON', portrait: 'BRONSON', text: 'Write it. I\'ll blame the\nalignment machine.' }
        ]
    },
    {
        id: 'eighty_ros',
        minDay: 40, maxDay: 75, weight: 1,
        lines: [
            { name: 'MIKE', portrait: 'MIKE', text: 'You\'re past 80 ROs.\nHalfway through probation.' },
            { name: 'MIKE', portrait: 'MIKE', text: 'Keep the drive clean.\nI\'m still watching.' }
        ],
        effects: { csi: 2 }
    },
    {
        id: 'liquor_run',
        minDay: 15, maxDay: 90, weight: 1,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'Rita from Last Call waves\nfrom the sidewalk.' },
            { name: 'SYSTEM', portrait: 'NONE', text: '"Tell Mike the seltzer\nshipment came in!"' }
        ]
    },
    {
        id: 'clutch_burger',
        minDay: 8, maxDay: 90, weight: 1,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'Ty from Clutch Burger delivers\na bag of fries to the parts desk.' },
            { name: 'JAKE', portrait: 'JAKE', text: 'These are mine now.' }
        ]
    },
    {
        id: 'gas_spill',
        minDay: 10, maxDay: 90, weight: 1,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'Pete pages the lot:\n"Someone topped off diesel\nin a gas Fusion."' },
            { name: 'MIKE', portrait: 'MIKE', text: 'Not our bay. But the guest\nis on OUR drive.' }
        ],
        effects: { csi: -2 }
    },
    {
        id: 'zack_comeback_echo',
        minDay: 25, maxDay: 90, weight: 1,
        lines: [
            { name: 'ZACK', portrait: 'ZACK', text: 'Remember Frank\'s smoking car?\nHe left another voicemail.' },
            { name: 'ZACK', portrait: 'ZACK', text: 'Bronson says it\'s fine.\nIt is not fine.' }
        ]
    },
    {
        id: 'adam_parts',
        minDay: 12, maxDay: 90, weight: 1,
        lines: [
            { name: 'ADAM', portrait: 'ADAM', text: 'Your special-order lug nuts\narrived. All four.' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'The RO needed twenty.' }
        ]
    },
    {
        id: 'ej_motivation',
        minDay: 28, maxDay: 90, weight: 1,
        lines: [
            { name: 'EJ', portrait: 'EJ', text: 'Stay hungry, [PLAYER_NAME].\nThe drive never sleeps.' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'EJ vanishes into the shop\nlike a motivational ghost.' }
        ],
        effects: { csi: 1 }
    },
    {
        id: 'strike_scare',
        minDay: 50, maxDay: 88, weight: 1,
        lines: [
            { name: 'MIKE', portrait: 'MIKE', text: 'You\'ve got ' + (probation.strikes || 0) + ' strike(s).\nThree ends it.' },
            { name: 'MIKE', portrait: 'MIKE', text: 'Play it straight till day 90.' }
        ]
    },
    {
        id: 'rival_challenge',
        minDay: 20, maxDay: 60, weight: 2,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: '[RIVAL_NAME] bets you can\'t\nbeat his oil-change count.' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'You ignore him.\nAdvisors don\'t lube.' }
        ]
    },
    {
        id: 'nav_update',
        minDay: 45, maxDay: 90, weight: 1,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'Car Planet OS wants to\nrestart for an update.' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'You click "Remind me later"\nfor the ninth time.' }
        ]
    },
    {
        id: 'detailing_pitch',
        minDay: 22, maxDay: 90, weight: 1,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'Showroom wants you to pitch\ndetailing on every RO.' },
            { name: 'MIKE', portrait: 'MIKE', text: 'Pitch it when it makes sense.\nDon\'t annoy CSI.' }
        ]
    },
    {
        id: 'phone_tree',
        minDay: 33, maxDay: 90, weight: 1,
        lines: [
            { name: 'SYSTEM', portrait: 'NONE', text: 'Seventeen missed calls\non the advisor line.' },
            { name: 'WHITNEY', portrait: 'WHITNEY', text: 'Welcome to fixed ops.' }
        ]
    },
    {
        id: 'weekend_push',
        minDay: 55, maxDay: 90, weight: 1,
        lines: [
            { name: 'MIKE', portrait: 'MIKE', text: 'Saturday is double points\non surveys. Be sharp.' },
            { name: 'MIKE', portrait: 'MIKE', text: 'I need your CSI above 75\nby Monday.' }
        ],
        effects: { csi: 1 }
    },
    {
        id: 'final_stretch',
        minDay: 75, maxDay: 89, weight: 3,
        lines: [
            { name: 'MIKE', portrait: 'MIKE', text: 'Final two weeks of probation.\nNo dumb mistakes.' },
            { name: 'MIKE', portrait: 'MIKE', text: 'You\'ve come too far to\nblow it on paperwork.' }
        ]
    },
    {
        id: 'jerry_detail',
        minDay: 40, maxDay: 90, weight: 1,
        lines: [
            { name: 'JERRY', portrait: 'JERRY', text: 'That Lincoln needs a wash\nbefore the guest returns.' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'Jerry\'s already buffing it\nlike it\'s his own.' }
        ]
    },
    {
        id: 'troy_quote',
        minDay: 18, maxDay: 90, weight: 1,
        lines: [
            { name: 'TROY', portrait: 'TROY', text: 'Guest wants a quote on\nbrakes AND an alignment.' },
            { name: 'TROY', portrait: 'TROY', text: 'And a loaner. And a latte.\nNormal Tuesday.' }
        ]
    },
    {
        id: 'nick_keys',
        minDay: 14, maxDay: 90, weight: 1,
        lines: [
            { name: 'NICK', portrait: 'NICK', text: 'Keys locked in a Maverick.\nAgain.' },
            { name: 'SYSTEM', portrait: 'NONE', text: 'Nick pops it in 30 seconds.\nNo RO needed. Legend.' }
        ]
    }
];
