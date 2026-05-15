/* Phase E — street & neighborhood stores (cosmetic v1) */
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
            { tx: 15, ty: 4, to: 'liquor_store', px: 9, py: 12 },
            { tx: 16, ty: 4, to: 'liquor_store', px: 10, py: 12 }
        ],
        npcs: [
            {
                id: 'street_sign',
                tx: 9, ty: 8,
                isObject: true,
                charCode: 'STREET_SIGN',
                name: 'STREET MAP',
                dialogue: [
                    "WEST — Quick Fill Gas",
                    "CENTER — Clutch Burger",
                    "EAST — Last Call Liquors",
                    "SOUTH — back to Car Planet lot"
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
            { tx: 9, ty: 13, to: 'street', px: 15, py: 5 },
            { tx: 10, ty: 13, to: 'street', px: 16, py: 5 }
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
    }
};
