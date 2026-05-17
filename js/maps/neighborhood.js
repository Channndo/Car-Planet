/* Phase E — street & neighborhood stores */
const neighborhoodMaps = {
    street: {
        bg: '#5a6b4a',
        layout: generateEmptyMap(),
        warps: [
            { tx: 9, ty: 13, to: 'parkinglot', px: 9, py: 12 },
            { tx: 10, ty: 13, to: 'parkinglot', px: 10, py: 12 },
            { tx: 3, ty: 4, to: 'gas_station', px: 9, py: 12 },
            { tx: 4, ty: 4, to: 'gas_station', px: 10, py: 12 },
            { tx: 9, ty: 4, to: 'fast_food', px: 9, py: 12 },
            { tx: 10, ty: 4, to: 'fast_food', px: 10, py: 12 },
            { tx: 13, ty: 4, to: 'liquor_store', px: 9, py: 12 },
            { tx: 14, ty: 4, to: 'liquor_store', px: 10, py: 12 },
            { tx: 17, ty: 4, to: 'autoworld', px: 9, py: 12 },
            { tx: 18, ty: 4, to: 'autoworld', px: 10, py: 12 }
        ],
        npcs: [
            {
                id: 'street_sign',
                tx: 9, ty: 8,
                isObject: true,
                charCode: 'STREET_SIGN',
                name: 'STREET MAP',
                dialogue: [
                    "NORTH (across street) —\nClutch Burger & shops",
                    "WEST — Quick Fill Gas",
                    "EAST — Last Call Liquors",
                    "FAR EAST — AUTOWORLD\n(rival store)",
                    "SOUTH — Car Planet lot"
                ]
            },
            {
                id: 'crosswalk_mark',
                tx: 9, ty: 11,
                isObject: true,
                charCode: 'CROSSWALK',
                name: 'CROSSWALK',
                dialogue: [
                    "Main Street.\nClutch Burger is straight\nacross from the lot."
                ]
            }
        ]
    },
    gas_station: {
        bg: '#e8e4dc',
        layout: generateEmptyMap(),
        warps: [
            { tx: 9, ty: 13, to: 'street', px: 3, py: 5 },
            { tx: 10, ty: 13, to: 'street', px: 4, py: 5 }
        ],
        npcs: [
            {
                id: 'gas_clerk',
                tx: 14, ty: 7,
                color: '#ffdbac', shirt: '#dc2626', sleeves: 'short',
                hair: '#333', name: 'PETE', charCode: 'PETE',
                dialogue: [
                    "Pump's on prepay.\nDon't ask me to run a tab.",
                    "87, 89, or regret?\nYour Bronco wants 89.",
                    "I see a lot of advisors\nfilling up on Monster."
                ]
            },
            {
                id: 'gas_pump_a',
                tx: 4, ty: 5,
                isObject: true, charCode: 'GAS_PUMP', name: 'PUMP 1',
                dialogue: ["Out of order.\nClassic.", "The card reader ate\nanother advisor's lunch money."]
            },
            {
                id: 'gas_pump_b',
                tx: 7, ty: 5,
                isObject: true, charCode: 'GAS_PUMP', name: 'PUMP 2',
                dialogue: ["Click. Full.\nSmells like victory.", "Diesel nozzle is missing.\nVinnie probably borrowed it."]
            },
            {
                id: 'gas_snacks',
                tx: 2, ty: 9,
                isObject: true, charCode: 'SNACK_RACK', name: 'SNACKS',
                dialogue: ["Beef jerky older than\nyour oldest comeback.", "They only sell hot dogs\nafter 11. It's always after 11."]
            }
        ]
    },
    liquor_store: {
        bg: '#2a1f1a',
        layout: generateEmptyMap(),
        warps: [
            { tx: 9, ty: 13, to: 'street', px: 13, py: 5 },
            { tx: 10, ty: 13, to: 'street', px: 14, py: 5 },
            { tx: 1, ty: 8, to: 'parkinglot', px: 16, py: 5 },
            { tx: 1, ty: 9, to: 'parkinglot', px: 16, py: 6 }
        ],
        npcs: [
            {
                id: 'liquor_clerk',
                tx: 10, ty: 8,
                color: '#e5c4a8', shirt: '#4c1d95', sleeves: 'long',
                hair: '#222', name: 'RITA', charCode: 'RITA',
                acc: { glasses: true },
                dialogue: [
                    "IDs at the counter.\nNo exceptions, hotshot.",
                    "Mike sent three advisors\nhere last Friday. Just saying.",
                    "We close at ten.\nThe lot doesn't."
                ]
            },
            {
                id: 'liquor_shelf',
                tx: 3, ty: 4,
                isObject: true, charCode: 'SHELF', name: 'TOP SHELF',
                dialogue: ["Premium labels.\nProbation salary can't reach.", "Someone knocked over\nthe cinnamon whiskey again."]
            },
            {
                id: 'liquor_cooler',
                tx: 16, ty: 5,
                isObject: true, charCode: 'COOLER', name: 'COOLER',
                dialogue: ["Ice cold.\nDoor sticks on humid days.", "Mike's favorite seltzer\nis always sold out."]
            }
        ]
    },
    fast_food: {
        bg: '#fff7ed',
        layout: generateEmptyMap(),
        warps: [
            { tx: 9, ty: 13, to: 'street', px: 9, py: 5 },
            { tx: 10, ty: 13, to: 'street', px: 10, py: 5 }
        ],
        npcs: [
            {
                id: 'burger_clerk',
                tx: 10, ty: 7,
                color: '#ffdbac', shirt: '#ea580c', sleeves: 'short',
                hair: '#f59e0b', name: 'TY', charCode: 'TY',
                dialogue: [
                    "Welcome to Clutch Burger!\nHome of the Triple Clutch.",
                    "We're right across the street\nfrom Car Planet. Easy commute.",
                    "Drive-thru's backed up\nwith shop trucks.",
                    "Loyalty punch cards?\nComing soon. Eat anyway."
                ]
            },
            {
                id: 'burger_menu',
                tx: 3, ty: 3,
                isObject: true, charCode: 'MENU_BOARD', name: 'MENU',
                dialogue: [
                    "TRIPLE CLUTCH — $8.99",
                    "EXTRA SHIFT FRIES — $2.49",
                    "COMBO BUFFS — coming in a\nfuture update. Eat for morale."
                ]
            },
            {
                id: 'burger_table',
                tx: 15, ty: 10,
                isObject: true, charCode: 'BOOTH', name: 'BOOTH',
                dialogue: [
                    "Sticky table.\nEvery advisor's been here.",
                    "Rival left a bag of fries\nand a note: \"Catch up.\""
                ]
            },
            {
                id: 'burger_customer',
                tx: 6, ty: 11,
                color: '#dcb', shirt: '#1e3a8a', sleeves: 'short',
                hair: '#555', name: 'CUSTOMER', charCode: 'CUST',
                dialogue: [
                    "They forgot my sauce again.",
                    "I come here every time\nmy advisor says \"two hours.\""
                ]
            }
        ]
    },
    autoworld: {
        bg: '#1a1f2e',
        layout: generateEmptyMap(),
        warps: [
            { tx: 9, ty: 13, to: 'street', px: 17, py: 5 },
            { tx: 10, ty: 13, to: 'street', px: 18, py: 5 }
        ],
        npcs: [
            {
                id: 'aw_sign',
                tx: 9, ty: 2,
                isObject: true,
                charCode: 'AW_SIGN',
                name: 'AUTOWORLD',
                dialogue: [
                    "AUTOWORLD — Drive Different™",
                    "Car Planet's cross-town rival.",
                    "Their CSI billboard updates\nin real time. Rude."
                ]
            },
            {
                id: 'aw_advisor',
                tx: 14, ty: 9,
                color: '#e8b898', shirt: '#1d4ed8', sleeves: 'long',
                hair: '#222', name: 'BLAKE', charCode: 'CUSTOMER',
                dialogue: [
                    "You're from Car Planet?\nBold walk-in.",
                    "We poach advisors every\nquarter. Just saying.",
                    "Our express lane actually\nexpresses."
                ]
            },
            {
                id: 'aw_rival_tech',
                tx: 5, ty: 7,
                color: '#ffccaa', shirt: '#dc2626', sleeves: 'short',
                hair: '#d4a017', name: 'RIVAL', charCode: 'RIVAL',
                dialogue: [
                    "Whatever, tourist.\nThis is MY lane.",
                    "Mike wouldn't even let me\nwork at Car Planet.",
                    "AUTOWORLD pays time, not\nflat-rate tears."
                ]
            },
            {
                id: 'aw_lot_car_a',
                tx: 3, ty: 4,
                isObject: true, charCode: 'CAR', name: 'DEMO SUV',
                _vehicleColor: '#1e40af',
                dialogue: ["Still has plastic on\nthe seats.", "0% APR banner magnet\non the roof."]
            },
            {
                id: 'aw_lot_car_b',
                tx: 15, ty: 5,
                isObject: true, charCode: 'SUV_BLACK', name: 'LUX TRIM',
                dialogue: ["Window sticker says\n$899/mo. Yikes.", "Someone traded this in\nwith mulch in the trunk."]
            }
        ]
    }
};
