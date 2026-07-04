/* Unique dealership story arcs — one scripted multi-step story per key probation day.
   Engine: js/systems/storyArcs.js. Each arc replaces the mid-day (noon) appointment.
   Step types:
     talk  — go speak to an NPC ({npc, maps, name, lines, assignTech?, hint})
     timer — wait N game-minutes ({minutes, pa?, busy?, deskLine?, hint})
   Every arc must end with a timer step (completion fires when it expires). */

const STORY_ARCS = [
    {
        id: 'buck_diesel_day',
        probationDay: 3,
        title: 'Earning Joe',
        customerId: 6, /* BUCK ODOM — F-150 */
        concern: 'Diesel knock at idle.\nSounds expensive.',
        teaser: 'Heads up — Buck Odom booked\nthe noon slot. Big diesel job.',
        guestIntro: [
            "Mornin', chief. She's knockin'\nat idle like a screen door.",
            "This truck IS my business.\nNo truck, no paycheck.",
            "Do me right and I'll tell\nevery farmer in the county."
        ],
        guestWaiting: [
            "Take your time, chief.\nJust not TOO much time."
        ],
        steps: [
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'JOE',
                lines: [
                    "MIKE: Diesel knock on Buck's F-150?\nThat's heavy-line work.",
                    "MIKE: Joe's the only tech here\nI'd trust with it.",
                    "MIKE: Fair warning — he's gonna\ngive you attitude. Take the RO over."
                ],
                hint: "Take Buck's RO to Mike for dispatch."
            },
            {
                type: 'talk', npc: 'joe', maps: ['shop'], name: 'JOE', portrait: 'JOE',
                lines: [
                    "JOE: A diesel knock. Written up by\na brand-new advisor. Great.",
                    "JOE: I'm not opening that engine\nblind. I need service history.",
                    "JOE: Jerry in parts has records\ngoing back thirty years.\nGo make yourself useful."
                ],
                hint: "Joe wants service history.\nAsk Jerry in parts."
            },
            {
                type: 'talk', npc: 'jerry', maps: ['parts'], name: 'JERRY', portrait: 'JERRY',
                lines: [
                    "JERRY: Buck Odom's F-150? Oh sure.\nI remember every truck.",
                    "JERRY: Injector job in '21. We used\nthe updated part number.",
                    "JERRY: Here's the printout. You know,\nmy son Kevin drives a diesel...",
                    "JERRY: ...anyway. Tell Joe it's the\nnumber-six injector. It's ALWAYS\nthe number-six."
                ],
                hint: "Jerry found the history.\nBring it back to Joe."
            },
            {
                type: 'talk', npc: 'joe', maps: ['shop'], name: 'JOE', portrait: 'JOE',
                lines: [
                    "JOE: Number six, huh. Jerry's\nusually right, annoyingly.",
                    "JOE: Fine. You actually did the\nlegwork. I'm mildly impressed.",
                    "JOE: Pull it in. Give me half\nan hour and don't hover."
                ],
                hint: "Joe took the job.\nLet him work."
            },
            {
                type: 'timer', minutes: 30,
                busy: {
                    npc: 'joe', maps: ['shop'], name: 'JOE', portrait: 'JOE',
                    lines: ["JOE: Still on the injector.\nWhat did I say about hovering?"]
                },
                deskLine: "RO in progress — Joe is deep\nin Buck's F-150.",
                hint: "Joe is on the injector.\nCheck the desk for progress."
            }
        ],
        completion: {
            csi: 3,
            lines: [
                "BUCK: She purrs like new, chief!",
                "Knew this place had at least\none advisor worth a dang.",
                "Every farmer in the county's\ngonna hear about you."
            ],
            guestAfter: [
                "Best shop in the county.\nI said what I said, chief."
            ]
        }
    },
    {
        id: 'tiffany_influencer',
        probationDay: 5,
        title: 'Going Viral',
        customerId: 3, /* TIFFANY BROOKS — Mustang */
        concern: 'Sunroof rattle. Also filming\neverything for her followers.',
        teaser: 'Tiffany Brooks booked at noon.\nShe films EVERYTHING.',
        guestIntro: [
            "Hiii! Okay so my sunroof rattles\nand it's ruining my audio.",
            "Also I'm filming this whole visit\nfor my followers. Smile!",
            "If my car comes back dusty,\nthat's content too. Bad content."
        ],
        guestWaiting: [
            "I'm doing a lil' vlog intro\nby your vending machine. Carry on!"
        ],
        steps: [
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'VINNIE',
                lines: [
                    "MIKE: The influencer? Her last video\ngot forty thousand views.",
                    "MIKE: Sunroof rattle is a quick job.\nGive it to Vinnie.",
                    "MIKE: And [PLAYER_NAME] — the car needs\nto LOOK perfect on camera.\nThink about that."
                ],
                hint: "Dispatch Tiffany's Mustang\nthrough Mike."
            },
            {
                type: 'talk', npc: 'vinnie', maps: ['shop'], name: 'VINNIE', portrait: 'VINNIE',
                lines: [
                    "VINNIE: Sunroof rattle? Loose guide\nrail. Twenty minutes, tops.",
                    "VINNIE: But she wants it camera-ready?\nThat ain't my department.",
                    "VINNIE: Talk to Damone. Nobody makes\na car shine like that guy."
                ],
                hint: "Vinnie's on the rattle.\nAsk Damone about the shine."
            },
            {
                type: 'talk', npc: 'damone', maps: ['shop'], name: 'DAMONE', portrait: 'DAMONE',
                lines: [
                    "DAMONE: A red Mustang on camera?\nSay less.",
                    "DAMONE: Two-bucket wash, ceramic spray,\ntire dressing. The full drip.",
                    "DAMONE: Gimme fifteen. When I'm done\nthat thing's gonna trend."
                ],
                hint: "Damone's detailing the Mustang.\nGive him a few minutes."
            },
            {
                type: 'timer', minutes: 20,
                pa: 'Detail bay to service —\nthe Mustang is ready.',
                busy: {
                    npc: 'damone', maps: ['shop'], name: 'DAMONE', portrait: 'DAMONE',
                    lines: ["DAMONE: You can't rush the shine.\nThe shine arrives when it arrives."]
                },
                deskLine: "RO in progress — Vinnie fixed\nthe rattle. Damone is detailing.",
                hint: "Rattle fixed. Damone is\nfinishing the detail."
            }
        ],
        completion: {
            csi: 4,
            lines: [
                "TIFFANY: STOP. It's GLEAMING.",
                "Okay followers — THIS is how a\ndealership treats you. Tag yourself.",
                "Five stars. Posting it with\nthree fire emojis."
            ],
            guestAfter: [
                "The video's already at 10k views.\nYou're famous, kind of!"
            ]
        }
    },
    {
        id: 'adam_parts_mixup',
        probationDay: 8,
        title: 'The Wrong Pads',
        customerId: 2, /* GARY HENDERSON — Fusion brakes */
        concern: 'Brakes squeal every morning.\nHe brought printouts.',
        teaser: 'Gary Henderson at noon.\nHe reads Consumer Reports.',
        guestIntro: [
            "The brakes squeal from my house\nto the stop sign. Every day.",
            "Consumer Reports says squealing\nindicates worn friction material.",
            "I also printed the article.\nWould you like a copy?"
        ],
        guestWaiting: [
            "I'll be reading the newspaper.\nThe PHYSICAL newspaper."
        ],
        steps: [
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'BRONSON',
                lines: [
                    "MIKE: Brake job on the Fusion?\nBronson can handle pads.",
                    "MIKE: Even Bronson can't come back\non a brake pad. Probably.",
                    "MIKE: Run it over to him."
                ],
                hint: "Take Gary's RO to Mike,\nthen find Bronson."
            },
            {
                type: 'talk', npc: 'bronson', maps: ['shop'], name: 'BRONSON', portrait: 'BRONSON',
                lines: [
                    "BRONSON: Pads. Easy money.\nLemme grab the parts.",
                    "BRONSON: ...These are wiper blades.\nThe box says brake pads.\nThe box is lying.",
                    "BRONSON: Parts counter strikes again.\nGo yell at Jake for me."
                ],
                hint: "Wrong part in the box.\nTalk to Jake in parts."
            },
            {
                type: 'talk', npc: 'jake', maps: ['parts'], name: 'JAKE', portrait: 'JAKE',
                lines: [
                    "JAKE: Wiper blades in a brake box?\nADAM!",
                    "JAKE: I label everything. EVERYTHING.\nAnd he still finds a way.",
                    "JAKE: He's hiding behind the counter.\nGo get his side of it."
                ],
                hint: "Jake is furious.\nGet Adam's side of it."
            },
            {
                type: 'talk', npc: 'adam', maps: ['parts'], name: 'ADAM', portrait: 'ADAM',
                lines: [
                    "ADAM: Okay in my defense, the part\nnumbers are VERY similar.",
                    "ADAM: One digit off. One!\nIt's practically the same part.",
                    "ADAM: ...It is not the same part.\nEJ! Help me fix this, buddy!"
                ],
                hint: "Adam owned it, sort of.\nEJ can hot-shot the pads."
            },
            {
                type: 'talk', npc: 'ej', maps: ['parts'], name: 'EJ', portrait: 'EJ',
                lines: [
                    "EJ: Correct pads? The warehouse\nacross town has four sets.",
                    "EJ: I'll send the shuttle driver.\nTwenty-five minutes, tops.",
                    "EJ: Go tell Gary his brakes are\nworth the wait. Politely."
                ],
                hint: "EJ's hot-shotting the pads.\nHang tight."
            },
            {
                type: 'timer', minutes: 25,
                pa: 'Parts to service drive —\nbrake pads have arrived.',
                busy: {
                    npc: 'ej', maps: ['parts'], name: 'EJ', portrait: 'EJ',
                    lines: ["EJ: Shuttle's on the highway.\nAlmost here!"]
                },
                deskLine: "RO on parts hold —\ncorrect pads en route.",
                hint: "Pads on the way. Bronson\ninstalls when they land."
            },
            {
                type: 'talk', npc: 'bronson', maps: ['shop'], name: 'BRONSON', portrait: 'BRONSON',
                lines: [
                    "BRONSON: Real pads this time.\nI checked the box TWICE.",
                    "BRONSON: Give me twenty and Gary's\nFusion stops squealing forever.",
                    "BRONSON: Well. For 30,000 miles.\nSame thing."
                ],
                hint: "Bronson has the pads.\nLet him wrench."
            },
            {
                type: 'timer', minutes: 20,
                busy: {
                    npc: 'bronson', maps: ['shop'], name: 'BRONSON', portrait: 'BRONSON',
                    lines: ["BRONSON: Torquing the caliper bolts.\nTo spec, even. Mostly."]
                },
                deskLine: "RO in progress —\nBronson is on the brake job.",
                hint: "Brakes going on now.\nAlmost done."
            }
        ],
        completion: {
            csi: 3,
            lines: [
                "GARY: Silent. Completely silent.",
                "I performed three test stops\nin your parking lot.",
                "Consumer Reports would rate this\nexperience... acceptable.\nThat's high praise."
            ],
            guestAfter: [
                "I'm mailing the survey back\nthe day I receive it. All fives."
            ]
        }
    },
    {
        id: 'rival_sabotage',
        probationDay: 12,
        title: 'Missing Paperwork',
        customerId: 7, /* PAMELA ROSS — Edge, coupon */
        concern: 'Coupon oil change.\nShe has the mailer. Laminated.',
        teaser: 'Pamela Ross at noon with\na coupon. Check your printer.',
        guestIntro: [
            "I have the $39.95 mailer.\nI laminated it.",
            "It says rotation included.\nI will be checking.",
            "My binder and I will wait\nright here."
        ],
        guestWaiting: [
            "The coupon has no expiration.\nI checked with a magnifying glass."
        ],
        steps: [
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'VINNIE',
                lines: [
                    "MIKE: Coupon oil change. Vinnie.\nEasy day, right?",
                    "MIKE: Except your printed RO never\nmade it to my rack.",
                    "MIKE: Paperwork doesn't vanish,\n[PLAYER_NAME]. Find it. Now."
                ],
                hint: "Your RO vanished off the rack.\nSomeone must have seen it."
            },
            {
                type: 'talk', npc: 'coolant_joe', maps: ['parts'], name: 'COOLANT JOE', portrait: 'COOLANT_JOE',
                lines: [
                    "COOLANT JOE: *Gulp* ...A missing RO?",
                    "COOLANT JOE: I see everything from\nthis aisle. EVERYTHING.",
                    "COOLANT JOE: Lube kid. Gold hair. Stuffed\nsome papers behind the oil rack\nin the shop. *Gulp*"
                ],
                hint: "Coolant Joe saw everything.\nGold hair... the lube tech."
            },
            {
                type: 'talk', npc: 'rival', maps: ['shop'], name: 'RIVAL', portrait: 'RIVAL',
                lines: [
                    "[RIVAL_NAME]: Papers? Behind the oil rack?\nWeird. Wonder who did that.",
                    "[RIVAL_NAME]: Maybe advisors who can't keep\ntrack of paperwork shouldn't\nbe advisors.",
                    "[RIVAL_NAME]: ...Fine. FINE. Here. It was\na joke. You people can't\ntake a joke."
                ],
                hint: "Confront [RIVAL_NAME] in the shop."
            },
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                lines: [
                    "MIKE: [RIVAL_NAME] hid it? My own nephew?",
                    "MIKE: He just earned two weeks of\nlot duty in the rain.",
                    "MIKE: You handled that without\nblowing up. Noted. Now get\nPamela's Edge to Vinnie."
                ],
                hint: "Tell Mike what happened,\nthen let Vinnie work."
            },
            {
                type: 'timer', minutes: 20,
                busy: {
                    npc: 'vinnie', maps: ['shop'], name: 'VINNIE', portrait: 'VINNIE',
                    lines: ["VINNIE: LOF and rotation.\nCoupon work still gets my\nbest torque wrench."]
                },
                deskLine: "RO in progress — Vinnie is on\nPamela's coupon special.",
                hint: "Vinnie's on the Edge.\nAlmost done."
            }
        ],
        completion: {
            csi: 3,
            lines: [
                "PAMELA: Rotation included, oil\nchanged, coupon honored.",
                "I'm noting this dealership in\nmy binder. The GOOD section.",
                "There are only two entries\nin the good section."
            ],
            guestAfter: [
                "I have a coupon for next time.\nAnd the time after that."
            ]
        }
    },
    {
        id: 'bodyshop_ding',
        probationDay: 16,
        title: 'The Door Ding',
        customerId: 12, /* CLINT BARBER — Ranger */
        concern: '4x4 service — plus a door ding\nhe is weirdly emotional about.',
        teaser: 'Clint Barber at noon.\nBring boots. Mud incoming.',
        guestIntro: [
            "4x4's actin' up. But look here —\nsome idiot dinged my door\nat the feed store.",
            "I don't care about mud.\nI care about DENTS.",
            "Can your body fellas knock\nthat out while she's here?"
        ],
        guestWaiting: [
            "Don't mind the dirt in the bed.\nThat's premium topsoil."
        ],
        steps: [
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'VINNIE',
                lines: [
                    "MIKE: 4x4 linkage to Vinnie.\nThat's the easy half.",
                    "MIKE: The door ding is body shop\nterritory. Walk it over to Gus.",
                    "MIKE: Two departments, one visit.\nThis is how you build CSI."
                ],
                hint: "Vinnie gets the 4x4.\nGus quotes the ding."
            },
            {
                type: 'talk', npc: 'gus', maps: ['bodyshop'], name: 'GUS', portrait: 'GUS',
                lines: [
                    "GUS: A door ding on a work truck?\nMost guys wouldn't care.",
                    "GUS: I respect a man who loves\nhis truck. I can pull that dent\nclean in twenty minutes.",
                    "GUS: But the paint chip needs Stan.\nHe's in the booth. Whisper."
                ],
                hint: "Gus pulls the dent.\nStan matches the paint."
            },
            {
                type: 'talk', npc: 'paint_stan', maps: ['paintroom'], name: 'STAN', portrait: 'PAINT_TECH',
                lines: [
                    "STAN: Shhh. ...Okay. Speak.",
                    "STAN: Ranger green, 2019? Factory\ncode GN. I can blend a chip\nthat small in my sleep.",
                    "STAN: Perfect finish. Every time.\nNow leave before your dust\nruins my clear coat."
                ],
                hint: "Stan's blending the paint.\nGive the body shop time."
            },
            {
                type: 'timer', minutes: 30,
                pa: 'Body shop to service —\nthe green Ranger is ready.',
                busy: {
                    npc: 'gus', maps: ['bodyshop'], name: 'GUS', portrait: 'GUS',
                    lines: ["GUS: Dent's pulled. Stan's blending.\nSmell that? Job well done."]
                },
                deskLine: "RO in progress — 4x4 fixed,\nbody shop finishing the door.",
                hint: "Dent pulled, paint drying.\nAlmost there."
            }
        ],
        completion: {
            csi: 3,
            lines: [
                "CLINT: Well I'll be. Can't even\ntell where the ding was.",
                "4x4 grabs like new too.",
                "Y'all just earned every truck\non my farm. All six of 'em."
            ],
            guestAfter: [
                "Six trucks. You heard me.\nSee you soon."
            ]
        }
    },
    {
        id: 'joeys_diy_disaster',
        probationDay: 21,
        title: 'YouTube University',
        customerId: 10, /* JOEY "WRENCH" PITTS — Bronco */
        concern: 'Misfire — worse AFTER he\nreplaced the plugs himself.',
        teaser: "Joey Pitts at noon. He 'fixed'\nit himself first. Brace.",
        guestIntro: [
            "So the video said 20 minutes.\nIt took me six hours.",
            "And now it misfires WORSE.\nWhich is impossible. I think.",
            "Don't tell your tech I touched it.\nOkay tell him. He'll know."
        ],
        guestWaiting: [
            "I left a comment on the video.\nIt did not help."
        ],
        steps: [
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'JOE',
                lines: [
                    "MIKE: A DIY plug job gone wrong?\nJoe is going to LOVE this.",
                    "MIKE: Seriously. Watch him. This is\nhis favorite kind of angry.",
                    "MIKE: Go on. Take it to him."
                ],
                hint: "Take the DIY disaster to Joe.\nStand back."
            },
            {
                type: 'talk', npc: 'joe', maps: ['shop'], name: 'JOE', portrait: 'JOE',
                lines: [
                    "JOE: Let me guess. YouTube said\n'easy 20-minute job.'",
                    "JOE: Wrong gap, wrong torque, and he\nswapped two coil connectors.\nIt's a miracle it runs.",
                    "JOE: I'll fix it. But the customer\nhears the WHOLE speech after.\nNon-negotiable."
                ],
                hint: "Joe's untangling the DIY job.\nThe speech comes later."
            },
            {
                type: 'timer', minutes: 25,
                pa: 'Shop to drive — the Bronco\nis running right again.',
                busy: {
                    npc: 'joe', maps: ['shop'], name: 'JOE', portrait: 'JOE',
                    lines: ["JOE: Re-gapping plug four.\nSix hours, this guy spent.\nSIX."]
                },
                deskLine: "RO in progress — Joe is\nundoing the YouTube special.",
                hint: "Joe's on it. Let the\nmaster work."
            },
            {
                type: 'talk', npc: 'joe', maps: ['shop'], name: 'JOE', portrait: 'JOE',
                lines: [
                    "JOE: Done. Runs like a Bronco should.",
                    "JOE: Tell Pitts: watching a video\ndoesn't make you a tech, same as\nwatching surgery don't make\nyou a doctor.",
                    "JOE: ...And tell him the plugs he\nbought were actually decent.\nDon't make it weird."
                ],
                hint: "Deliver Joe's speech to Joey.\nGently-ish."
            },
            {
                type: 'timer', minutes: 5,
                deskLine: "Closing out Joey's RO now.",
                hint: "Wrap up Joey's paperwork\nat your desk."
            }
        ],
        completion: {
            csi: 2,
            lines: [
                "JOEY: 'Watching surgery doesn't\nmake you a doctor.' Wow.",
                "That's brutal. That's fair.\nI'm putting it in my bio.",
                "Next time I'm just... coming\nhere first. Lesson learned."
            ],
            guestAfter: [
                "I unsubscribed from the channel.\nGrowth, right?"
            ]
        }
    },
    {
        id: 'navigator_vip',
        probationDay: 27,
        title: 'White Glove',
        customerId: 9, /* HELEN PRICE — Navigator */
        concern: 'Massage seat is down.\nLincoln loyalty on the line.',
        teaser: 'Helen Price. Navigator. Noon.\nSales is watching this one.',
        guestIntro: [
            "The massage seat stopped\nmid-massage. Traumatic, frankly.",
            "I've owned Lincolns since 1998.\nI know how I should be treated.",
            "The nice young man in the\nshowroom promised white-glove\nservice. I intend to collect."
        ],
        guestWaiting: [
            "I'll be admiring the new\nNavigator in your showroom.\nDangerous, I know."
        ],
        steps: [
            {
                type: 'talk', npc: 'nick', maps: ['showroom'], name: 'NICK', portrait: 'NICK',
                lines: [
                    "NICK: Helen Price is here? She's\nbought FIVE Navigators from us.",
                    "NICK: If service fumbles her,\nI lose my next sale.\nWhite glove. I mean it.",
                    "NICK: Get Mike to put his best\non it. GO."
                ],
                hint: "Nick is sweating. Get Mike\nto assign the best."
            },
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'JOE',
                lines: [
                    "MIKE: Seat module diagnosis on a\nNavigator? That's Joe.",
                    "MIKE: And Nick's right, don't tell\nhim I said that.",
                    "MIKE: Have Damone give it the spa\ntreatment while it's here.\nFull white glove."
                ],
                hint: "Joe diagnoses the seat.\nDamone handles the shine."
            },
            {
                type: 'talk', npc: 'joe', maps: ['shop'], name: 'JOE', portrait: 'JOE',
                lines: [
                    "JOE: Seat module. Lemme scan it.",
                    "JOE: ...Module's dead. Needs the\npart. If parts doesn't stock it\nthis becomes a bad day.",
                    "JOE: Run to EJ. Pray."
                ],
                hint: "Dead seat module. Ask EJ\nif one's in stock."
            },
            {
                type: 'talk', npc: 'ej', maps: ['parts'], name: 'EJ', portrait: 'EJ',
                lines: [
                    "EJ: Navigator seat module...\nchecking...",
                    "EJ: ONE in stock. Last one in\nthe region. Jerry made us stock\nit years ago. 'Trust me,' he said.",
                    "EJ: Jerry wins again. Take it\nto Joe!"
                ],
                hint: "EJ found the last module!\nRun it to Joe."
            },
            {
                type: 'talk', npc: 'joe', maps: ['shop'], name: 'JOE', portrait: 'JOE',
                lines: [
                    "JOE: In stock? Huh. Jerry.",
                    "JOE: Module swap is 20 minutes.\nTell Damone he's up after me."
                ],
                hint: "Joe's swapping the module.\nDamone details after."
            },
            {
                type: 'timer', minutes: 30,
                pa: 'Service team — the Navigator\nis ready. White glove complete.',
                busy: {
                    npc: 'damone', maps: ['shop'], name: 'DAMONE', portrait: 'DAMONE',
                    lines: ["DAMONE: Leather conditioner, cabin\nscent, the works. Ms. Price\ndeserves the deluxe."]
                },
                deskLine: "RO in progress — module in,\nDamone finishing the spa day.",
                hint: "Module swapped. Damone is\nfinishing the white glove."
            }
        ],
        completion: {
            csi: 5,
            lines: [
                "HELEN: The seat works, the cabin\nsmells divine, and someone\nconditioned the leather.",
                "THIS is why I've been a Lincoln\nwoman since 1998.",
                "Tell that nice manager the\nwhite glove was... immaculate."
            ],
            guestAfter: [
                "I may have also bought a sixth\nNavigator today. Don't judge me."
            ]
        }
    },
    {
        id: 'coolant_crisis',
        probationDay: 34,
        title: 'The Coolant Crisis',
        customerId: 11, /* SANDRA KIM — Escape */
        concern: 'Coolant flush before a\ndouble shift. She is exhausted.',
        teaser: 'Sandra Kim, noon, coolant\nflush. Should be simple. Should.',
        guestIntro: [
            "Coolant flush, please. I have\na double shift at seven.",
            "Sorry if I doze off in your\nwaiting room. Nurse life.",
            "Wake me if anything explodes."
        ],
        guestWaiting: [
            "Zzz... huh? I'm awake.\nI'm totally awake."
        ],
        steps: [
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'VINNIE',
                lines: [
                    "MIKE: Coolant flush to Vinnie.\nIn and out. Simple.",
                    "MIKE: ...Why do you look like it's\nnot going to be simple?"
                ],
                hint: "Coolant flush — dispatch\nto Vinnie."
            },
            {
                type: 'talk', npc: 'vinnie', maps: ['shop'], name: 'VINNIE', portrait: 'VINNIE',
                lines: [
                    "VINNIE: Flush is easy. Grabbing the\ncoolant... uh.",
                    "VINNIE: The rack's EMPTY. We had a\nwhole case of orange yesterday.",
                    "VINNIE: A whole CASE. Where does a\ncase of coolant just GO?"
                ],
                hint: "The coolant case vanished.\nParts might know. Or..."
            },
            {
                type: 'talk', npc: 'jake', maps: ['parts'], name: 'JAKE', portrait: 'JAKE',
                lines: [
                    "JAKE: The orange case? It was HERE.\nI signed for it MYSELF.",
                    "JAKE: Wait. Orange. A whole case.\n...No. NO.",
                    "JAKE: JOE! COOLANT JOE!\nWHERE ARE YOU?!"
                ],
                hint: "Jake has a suspect.\nFind Coolant Joe."
            },
            {
                type: 'talk', npc: 'coolant_joe', maps: ['parts'], name: 'COOLANT JOE', portrait: 'COOLANT_JOE',
                lines: [
                    "COOLANT JOE: *Guilty gulp*",
                    "COOLANT JOE: In my defense... it was\nthe good orange. The 2-AM orange.",
                    "COOLANT JOE: Little Mike keeps an\nemergency case behind aisle\nthree. Don't tell him I told you."
                ],
                hint: "He drank the case. Ask\nLittle Mike about the backup."
            },
            {
                type: 'talk', npc: 'little_mike', maps: ['parts'], name: 'LITTLE MIKE', portrait: 'LITTLE_MIKE',
                lines: [
                    "LITTLE MIKE: My emergency case?!\nThat was for EMERGENCIES!",
                    "LITTLE MIKE: ...A nurse needs her car\nbefore a double shift? Okay.\nThat's an emergency.",
                    "LITTLE MIKE: Take it. Second best\nparts guy saves the day. AGAIN."
                ],
                hint: "Backup coolant secured!\nGet it to Vinnie."
            },
            {
                type: 'timer', minutes: 20,
                pa: 'Shop to drive — the Escape\nflush is finished.',
                busy: {
                    npc: 'vinnie', maps: ['shop'], name: 'VINNIE', portrait: 'VINNIE',
                    lines: ["VINNIE: Flushin'. And I hid one\njug where Coolant Joe will\nnever look: the water cooler."]
                },
                deskLine: "RO in progress — flush underway\nwith the emergency coolant.",
                hint: "Vinnie's flushing the system.\nCrisis averted."
            }
        ],
        completion: {
            csi: 3,
            lines: [
                "SANDRA: Done already? I got a\nfull nap AND a coolant flush.",
                "This is the best day of my\nentire week. That's nursing.",
                "Five stars. If anyone comes into\nmy ER, I'll be gentle with them."
            ],
            guestAfter: [
                "Off to the double shift.\nWish me luck!"
            ]
        }
    },
    {
        id: 'secret_audit',
        probationDay: 41,
        title: 'The Audit',
        customerId: 17, /* WENDY HOLT — Maverick */
        concern: 'First service on a new lease.\nSomething about her clipboard...',
        teaser: 'Wendy Holt at noon. Word is\ncorporate is auditing today.',
        guestIntro: [
            "First service on my lease!\nJust the scheduled maintenance.",
            "Don't mind the clipboard.\nIt's an HR thing. Habit.",
            "I always give fives.\nIf they're deserved."
        ],
        guestWaiting: [
            "Interesting greet time.\nJust... noting it. For fun."
        ],
        steps: [
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'VINNIE',
                lines: [
                    "MIKE: Listen carefully. Wendy Holt\nis corporate's secret shopper.\nRyan recognized her from a\nregional conference.",
                    "MIKE: Everything by the book today.\nGreet, walkaround, dispatch,\nstatus updates. THE BOOK.",
                    "MIKE: Vinnie's on it. Go tell him\nto pretend he's on camera."
                ],
                hint: "It's an audit! By the book:\nbrief Vinnie next."
            },
            {
                type: 'talk', npc: 'vinnie', maps: ['shop'], name: 'VINNIE', portrait: 'VINNIE',
                lines: [
                    "VINNIE: Secret shopper?! Why do\nI suddenly forget how to\nhold a wrench?",
                    "VINNIE: Okay. Okay. Scheduled maintenance,\ntorque to spec, no shortcuts.",
                    "VINNIE: I'm even putting the paper\nfloor mat in. THE PAPER MAT."
                ],
                hint: "Vinnie's on best behavior.\nUpdate the guest like a pro."
            },
            {
                type: 'talk', npc: 'whitney', maps: ['drive'], name: 'WHITNEY', portrait: 'WHITNEY',
                lines: [
                    "WHITNEY: An auditor on YOUR lane?\nOh, you sweet rookie.",
                    "WHITNEY: Status update every 15 minutes.\nOffer water. Confirm the total\nBEFORE the keys.",
                    "WHITNEY: That's the checklist that got\nme to 98. Don't waste it."
                ],
                hint: "Whitney shared her secret\nCSI checklist. Use it."
            },
            {
                type: 'timer', minutes: 25,
                pa: 'Service — the Maverick\nis buttoned up and ready.',
                busy: {
                    npc: 'vinnie', maps: ['shop'], name: 'VINNIE', portrait: 'VINNIE',
                    lines: ["VINNIE: Paper mat is IN.\nI've never been this careful\nin my LIFE."]
                },
                deskLine: "RO in progress — audit-spec\nservice underway.",
                hint: "Service in progress.\nEverything by the book."
            }
        ],
        completion: {
            csi: 5,
            lines: [
                "WENDY: Greeted in under a minute.\nClear communication. Updates\nwithout my asking.",
                "You knew, didn't you?\n...Doesn't matter. The score\ncounts either way.",
                "Tell Mike the region will see\nthis report. All fives. Deserved."
            ],
            guestAfter: [
                "The clipboard never lies.\nGreat work today."
            ]
        }
    },
    {
        id: 'bronson_redemption',
        probationDay: 50,
        title: "Bronson's Redemption",
        customerId: 30, /* EARL DUNN — F-150, same rattle 3 visits */
        concern: 'The SAME rattle. Third visit.\nHe is threatening corporate.',
        teaser: "Earl Dunn. Noon. Third visit\nfor the same rattle. Careful.",
        guestIntro: [
            "Third. Visit. Same rattle.",
            "Your man Bronson touched it\ntwice. TWICE.",
            "Fix it today or I call corporate,\nand I already know the number\nby heart."
        ],
        guestWaiting: [
            "I've memorized your hold music.\nThat's how many times I've called."
        ],
        steps: [
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'BRONSON',
                lines: [
                    "MIKE: Earl's rattle again?\nThat's Bronson's comeback.\nNumber eleven this quarter.",
                    "MIKE: Here's the play: Bronson fixes\nhis own mess, but Joe checks\nthe work. Both of them. Together.",
                    "MIKE: Yes, they'll hate it.\nThat's half the point."
                ],
                hint: "Mike's orders: Bronson fixes it,\nJoe verifies. Tell Bronson."
            },
            {
                type: 'talk', npc: 'bronson', maps: ['shop'], name: 'BRONSON', portrait: 'BRONSON',
                lines: [
                    "BRONSON: A babysitter? Joe's gonna\ncheck MY work?",
                    "BRONSON: ...You know what. Fine.\nEleven comebacks. Maybe I've\nbeen coasting.",
                    "BRONSON: Third time's the charm.\nGo get the old man."
                ],
                hint: "Bronson accepted the help.\nNow get Joe on board."
            },
            {
                type: 'talk', npc: 'joe', maps: ['shop'], name: 'JOE', portrait: 'JOE',
                lines: [
                    "JOE: Check Bronson's work? I've been\nsaying that for two years.",
                    "JOE: ...He actually agreed? Huh.",
                    "JOE: Fine. Watch this, kid. This is\nwhat thirty years of experience\nnext to raw talent looks like."
                ],
                hint: "Joe and Bronson, together.\nHistory in the making."
            },
            {
                type: 'timer', minutes: 35,
                pa: 'Shop to drive — Earl Dunn\'s\nF-150 is finally fixed.',
                busy: {
                    npc: 'joe', maps: ['shop'], name: 'JOE', portrait: 'JOE',
                    lines: ["JOE: Found it. Cracked heat shield\nAND a loose cat bracket.\nTwo rattles pretending to be one.\nNo wonder he kept missing it."]
                },
                deskLine: "RO in progress — Joe and Bronson\nare BOTH on Earl's truck.",
                hint: "Two rattles, two techs.\nThey've got it now."
            }
        ],
        completion: {
            csi: 4,
            lines: [
                "EARL: ...It's gone. The rattle\nis actually gone.",
                "Three years I've heard that noise.\nBought it off this very lot in '09,\nyou know.",
                "First five-star survey I've ever\ngiven anyone. Frame it."
            ],
            guestAfter: [
                "I deleted corporate's number.\nWell. I wrote it down first.\nJust in case."
            ]
        }
    },
    {
        id: 'food_truck_rush',
        probationDay: 62,
        title: 'Race the Lunch Rush',
        customerId: 16, /* ANTHONY CRUZ — Transit */
        concern: 'Transit won\'t hold a charge.\nLunch rush starts at noon-thirty.',
        teaser: 'Anthony Cruz, noon. His food\ntruck HAS to make lunch rush.',
        guestIntro: [
            "Battery died twice this week.\nThe Transit IS the business.",
            "Lunch rush starts in thirty\nminutes across town.",
            "Get me rolling and everyone\nin this building eats free\ntacos. I'm serious."
        ],
        guestWaiting: [
            "Every minute here is forty\ntacos I'm not selling."
        ],
        steps: [
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'VINNIE',
                lines: [
                    "MIKE: Dying battery, twice jumped?\nThat's an alternator.",
                    "MIKE: Vinnie's fastest hands in the\nshop. And [PLAYER_NAME] — RUN.\nThe man's livelihood is parked\non our drive.",
                    "MIKE: Also. Free tacos. GO."
                ],
                hint: "Race the clock! Vinnie needs\nan alternator from EJ."
            },
            {
                type: 'talk', npc: 'ej', maps: ['parts'], name: 'EJ', portrait: 'EJ',
                lines: [
                    "EJ: Transit alternator...\nIN STOCK. Aisle two!",
                    "EJ: Pulled and on the counter\nbefore you finish this sentence.",
                    "EJ: Tell Anthony I want two\nal pastor. This is my finest hour."
                ],
                hint: "Alternator in hand!\nSprint it to Vinnie."
            },
            {
                type: 'talk', npc: 'vinnie', maps: ['shop'], name: 'VINNIE', portrait: 'VINNIE',
                lines: [
                    "VINNIE: Gimme that. Serpentine belt\noff... alternator out...",
                    "VINNIE: You ever seen a 15-minute\nalternator swap? You're about to.",
                    "VINNIE: For tacos? I'd do a\ntransmission."
                ],
                hint: "Fastest swap in dealership\nhistory, in progress."
            },
            {
                type: 'timer', minutes: 15,
                pa: 'Drive team — the food truck\nis CHARGED and ready. Go go go!',
                busy: {
                    npc: 'vinnie', maps: ['shop'], name: 'VINNIE', portrait: 'VINNIE',
                    lines: ["VINNIE: Belt's going back on.\nSomebody warm up the salsa."]
                },
                deskLine: "RO in progress — the great\nalternator sprint of the year.",
                hint: "Almost done. The lunch\nrush waits for no one."
            }
        ],
        completion: {
            csi: 4,
            lines: [
                "ANTHONY: Charging at 14.4 volts!\nYou beautiful people!",
                "I'll make the rush with four\nminutes to spare.",
                "Taco truck's parked out front\nFriday. Everything's on me.\nEVERYTHING."
            ],
            guestAfter: [
                "Friday. Tacos. Don't be late.\nEJ gets a double order."
            ]
        }
    },
    {
        id: 'sold_unit_scramble',
        probationDay: 75,
        title: 'The Showroom Scramble',
        customerId: 29, /* NICOLE BRANDT — Expedition trade-in */
        concern: 'Trading in the Expedition —\nsales needs it inspected TODAY.',
        teaser: 'Sales sold a unit that needs\nsame-day inspection. Brace.',
        guestIntro: [
            "We're trading this in and\ndriving the new one home TODAY.",
            "The kids are already fighting\nover seats in the new car.",
            "Please hurry. There are three\ncar seats and one juice box\nbetween us and disaster."
        ],
        guestWaiting: [
            "The goldfish crackers won't\nhold them forever."
        ],
        steps: [
            {
                type: 'talk', npc: 'dave', maps: ['showroom'], name: 'DAVE', portrait: 'DAVE',
                lines: [
                    "DAVE: Buddy! BUDDY! I sold the new\nExpedition. Deal's DONE.",
                    "DAVE: I just need her trade\ninspected and the new unit\ndetailed. In an hour. Easy!",
                    "DAVE: What do you mean 'that's two\njobs'? Chop chop!"
                ],
                hint: "Dave needs an inspection AND\na detail. Mike sorts it out."
            },
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'VINNIE',
                lines: [
                    "MIKE: Dave promised WHAT in an hour?",
                    "MIKE: ...Fine. Vinnie inspects the\ntrade. Bri details the new unit.",
                    "MIKE: When service saves a deal,\nsales owes us lunch for a month.\nRemember I said that."
                ],
                hint: "Vinnie inspects, Bri details.\nBrief them both."
            },
            {
                type: 'talk', npc: 'vinnie', maps: ['shop'], name: 'VINNIE', portrait: 'VINNIE',
                lines: [
                    "VINNIE: Trade-in inspection?\nBrakes, tires, fluids, frame.\nTwenty minutes flat.",
                    "VINNIE: If I find goldfish crackers\nin the seat rails I'm keeping 'em."
                ],
                hint: "Vinnie's inspecting.\nNow tell Bri about the detail."
            },
            {
                type: 'talk', npc: 'bri', maps: ['shop'], name: 'BRI', portrait: 'BRI',
                lines: [
                    "BRI: A brand-new unit for a mom\nwith three car seats?",
                    "BRI: I'm doing the fabric guard.\nTrust me, she NEEDS the\nfabric guard.",
                    "BRI: And Damone said HE should do it.\nAs IF. Watch this."
                ],
                hint: "Bri's on the detail with a\npoint to prove. Perfect."
            },
            {
                type: 'timer', minutes: 30,
                pa: 'Sales and service — the\nExpedition swap is READY.',
                busy: {
                    npc: 'bri', maps: ['shop'], name: 'BRI', portrait: 'BRI',
                    lines: ["BRI: Fabric guard on every\nsurface a juice box can reach.\nWhich is all of them."]
                },
                deskLine: "RO in progress — inspection\nand detail racing the clock.",
                hint: "Inspection done, detail\nfinishing. Deal's alive."
            }
        ],
        completion: {
            csi: 4,
            lines: [
                "NICOLE: The new one's ready?\nAND scotch-guarded?",
                "You just survived three kids'\nworth of chaos. Respect.",
                "Dave says service 'always slows\nhim down.' Dave is wrong."
            ],
            guestAfter: [
                "The kids already spilled juice.\nThe fabric guard HELD. Heroes."
            ]
        }
    },
    {
        id: 'kasey_showdown',
        probationDay: 85,
        title: 'The Showdown',
        customerId: 13, /* MONICA VEGA — Expedition */
        concern: 'Oil change — but something is\nsmoking under the hood...',
        teaser: 'Monica Vega at noon. Simple\noil change. What could go wrong?',
        guestIntro: [
            "Just the recall work and an\noil change. I have a 3 PM pickup\nwindow. Non-negotiable.",
            "Why is there smoke coming\nfrom under my hood?",
            "There was NOT smoke when\nI dropped it off last month."
        ],
        guestWaiting: [
            "3 PM. Pickup window.\nI trust you understand."
        ],
        steps: [
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'JOE',
                lines: [
                    "MIKE: Smoke? Her last oil change\nwas... let me check...",
                    "MIKE: ...[RIVAL_NAME]. My nephew did it.\nOf course he did.",
                    "MIKE: Handle this quietly. Joe\nverifies what happened —\nfacts first, drama never."
                ],
                hint: "Smoke on a fresh oil change.\nJoe finds the truth."
            },
            {
                type: 'talk', npc: 'joe', maps: ['shop'], name: 'JOE', portrait: 'JOE',
                lines: [
                    "JOE: Oil cap's loose and there's\noil misted all over the manifold.\nThat's your smoke.",
                    "JOE: Sloppy lube work. No damage,\nbut sloppy.",
                    "JOE: The kid needs to hear it from\nanother tech's mouth. Bring him."
                ],
                hint: "Loose oil cap. Kasey's work.\nBring [RIVAL_NAME] to face it."
            },
            {
                type: 'talk', npc: 'rival', maps: ['shop'], name: 'RIVAL', portrait: 'RIVAL',
                lines: [
                    "[RIVAL_NAME]: My cap? MY torque?\nNo way, I always—",
                    "[RIVAL_NAME]: ...that was the Friday I\nrushed out early. I didn't\ndouble-check it.",
                    "[RIVAL_NAME]: Ugh. FINE. I'll fix it,\nclean the manifold, and...\nand apologize to the customer.\nDon't make it a thing."
                ],
                hint: "[RIVAL_NAME] owned the mistake.\nGrowth. Let him fix it."
            },
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                lines: [
                    "MIKE: He owned it? Apologized?",
                    "MIKE: You know, when he started here\nI told Rick you'd either kill\neach other or fix each other.",
                    "MIKE: Between us — you've got the\none thing he doesn't. You give\na damn. Five more days, kid."
                ],
                hint: "Mike sees you. Five days left.\nLet Kasey finish the fix."
            },
            {
                type: 'timer', minutes: 20,
                pa: 'Lube bay to drive — the\nExpedition is clean and ready.',
                busy: {
                    npc: 'rival', maps: ['shop'], name: 'RIVAL', portrait: 'RIVAL',
                    lines: ["[RIVAL_NAME]: Cap torqued. Manifold\ncleaned. Checked THREE times.\nHappy?"]
                },
                deskLine: "RO in progress — [RIVAL_NAME] is\nmaking it right, personally.",
                hint: "Kasey's making it right.\nAlmost done."
            }
        ],
        completion: {
            csi: 4,
            lines: [
                "MONICA: The young technician\napologized to me directly.\nIn complete sentences.",
                "Accountability. I'm a principal —\nI know how rare that is.",
                "It's 2:41. I'll make my pickup\nwindow. Well managed."
            ],
            guestAfter: [
                "I gave the young man a gold\nstar sticker. He kept it."
            ]
        }
    },
    {
        id: 'final_test',
        probationDay: 89,
        title: 'The Final Test',
        customerId: 22, /* HAROLD GRIMES — MKZ */
        concern: 'AC blows warm. He has\ncomplaints about the complaints.',
        teaser: "Day 89. Mike booked Harold\nGrimes on YOUR lane. On purpose.",
        guestIntro: [
            "Harold Grimes. You've probably\nheard of me. The staff flinches.",
            "AC blows warm, waiting room\ncoffee is worse, and the old\nplace on 5th did it cheaper.",
            "...And yet here I am. Again.\nBecause you people actually\nfix things. Don't tell anyone\nI said that."
        ],
        guestWaiting: [
            "The old place would've greeted\nme faster. They'd have been\nwrong about the car, but faster."
        ],
        steps: [
            {
                type: 'talk', npc: 'mike', maps: ['drive', 'office'], name: 'MIKE', portrait: 'MIKE',
                assignTech: 'JOE',
                lines: [
                    "MIKE: Harold Grimes, on your lane,\nthe day before your review.\nThat's not a coincidence.",
                    "MIKE: He's the hardest guest we have.\nHandle him and there's nothing\nleft I can teach you.",
                    "MIKE: AC work goes to Joe.\nGood luck, kid. You won't\nneed it."
                ],
                hint: "The final test. Dispatch\nHarold's AC job to Joe."
            },
            {
                type: 'talk', npc: 'joe', maps: ['shop'], name: 'JOE', portrait: 'JOE',
                lines: [
                    "JOE: Grimes' MKZ. AC compressor\nclutch, I'd bet my toolbox.",
                    "JOE: Ninety days ago I'd have told\nyou to get off my lift.",
                    "JOE: Now? Give me the RO. You write\nclean tickets, kid. That's rarer\nthan you know. One hour."
                ],
                hint: "Joe's on the compressor.\nKeep Harold updated."
            },
            {
                type: 'talk', npc: 'whitney', maps: ['drive'], name: 'WHITNEY', portrait: 'WHITNEY',
                lines: [
                    "WHITNEY: Grimes on day 89.\nMike's got jokes.",
                    "WHITNEY: Update him every 15 minutes.\nAgree with his complaints —\nEXCEPT about the coffee.\nDefend the coffee.",
                    "WHITNEY: ...Good luck, [PLAYER_NAME].\nWe're all watching. No pressure."
                ],
                hint: "Whitney's final advice:\nupdates, and defend the coffee."
            },
            {
                type: 'timer', minutes: 45,
                pa: 'Shop to drive — the MKZ\nis blowing COLD.',
                busy: {
                    npc: 'joe', maps: ['shop'], name: 'JOE', portrait: 'JOE',
                    lines: ["JOE: Compressor clutch, like I said.\nThirty years and I've never\nbet my toolbox wrong."]
                },
                deskLine: "RO in progress — Joe is on\nHarold's AC. The whole store\nis watching.",
                hint: "Joe's on it. Keep Harold\ncalm. Finish strong."
            }
        ],
        completion: {
            csi: 5,
            lines: [
                "HAROLD: Cold air. Forty-one degrees\nat the vent. I measured.",
                "You greeted me fast, updated me\nconstantly, and nobody flinched.\nNot once.",
                "The old place on 5th never did\nTHAT. All fives. First time\nfor everything."
            ],
            guestAfter: [
                "See you at the 30k service.\nDon't get worse."
            ]
        }
    }
];

/* Mike's milestone briefings — shown at the start of key probation days */
const PROBATION_MILESTONES = {
    7: [
        "MIKE: One week down, [PLAYER_NAME].",
        "MIKE: You're still here, the drive's\nstill standing, and Whitney\nhasn't filed a complaint.",
        "MIKE: That's a better week one\nthan most. Keep stacking days."
    ],
    14: [
        "WHITNEY: Two weeks in. I've been\nwatching your check-ins.",
        "WHITNEY: They're... not bad.\nThat's the nicest thing I've\nsaid to an advisor all year."
    ],
    30: [
        "MIKE: Thirty days. Official review.",
        "MIKE: CSI [CSI]. [ROS] ROs written.\nThe numbers don't lie, kid.",
        "MIKE: Two thirds to go. The drive\ngets harder before it gets\neasier. Stay sharp."
    ],
    45: [
        "RYAN: Halfway, [PLAYER_NAME]. Day 45.",
        "RYAN: I've seen a dozen advisors\nquit before this mark.",
        "RYAN: You're still running the drive\nin those shoes Mike bought.\nThat tells me everything."
    ],
    60: [
        "MIKE: Day 60. Two thirds done.",
        "MIKE: You need [ROS_LEFT] more ROs to\nhit the target. Do the math\nevery morning like I do.",
        "MIKE: Zack started asking you\nquestions instead of me.\nI noticed."
    ],
    75: [
        "MIKE: Final stretch. Fifteen days.",
        "MIKE: This is where advisors get\ncomfortable and comfortable\nadvisors get sloppy.",
        "MIKE: Don't be comfortable.\nBe good."
    ],
    89: [
        "MIKE: Tomorrow's day 90.\nYour final review.",
        "MIKE: Whatever happens on that\nreview, today still counts.\nRun your lane.",
        "MIKE: ...And kid? Breathe.\nYou've earned the nerves."
    ]
};
