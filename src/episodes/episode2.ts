/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TileType, NPC, Item, Quest } from "../types";

// Legend:
// w = Dungeon Wall
// r = Dungeon Floor
// l = Lava Hazard
// d = Dungeon locked door
// p = Portal (after unlocking door)
// . = Floor

const MAP_DESIGN = [
  "wwwwwwwwwwwwwwwwwwwwwwwwwwwww",
  "w...........wwww............w",
  "w..wwwwwww..wwwww..wwwwwww..w",
  "w..w.....w..wwwww..w.....w..w",
  "w..w..k..w.........w..p..w..w", // k = Key, p = Potion
  "w..w..l..w..wwwww..w..l..w..w",
  "w..w..ll.w..wwwww..w..ll.w..w",
  "w..wwwwwll..wwwww..wwwwwll..w",
  "w.......ll..wwwww.......ll..w",
  "w..wwwwwwl.........wwwwwwl..w",
  "w..wwwwwwwwwwdWwwwwwwwwww...w", // d = Locked Dungeon Door!
  "w..r.........F..........r...w",
  "w..r.llllllllllllllll...r...w", // lava barrier!
  "w....r..............r.......w",
  "w...................o.......w", // o = Entry point is near top/bottom, let's put locked door at key place
  "wwwwwwwwwwwwwwwwwwwwwwwwwwwww"
];

// Let's create an explicit layout grid:
// 60cols x 30rows
export const getMapGrid = (): TileType[][] => {
  const layout = [
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww", // 0
    "w...........................wwww...........................w", // 1
    "w..wwwwwwwwwwwwww.wwwwwwww..wwww..wwwwwwwwwwwwww.wwwwwwww..w", // 2
    "w..w.....................w..wwww..w.....................w..w", // 3
    "w..w..lllllllllllllllll..w........w..lllllllllllllllll..w..w", // 4
    "w..w..lllllllllllllllll..w..wwww..w..lllllllllllllllll..w..w", // 5
    "w..w..ll...............w....wwww....w...............ll..w..w", // 6
    "w..w..ll..wwwwwwwwwww..w..wwwwwwww..w..wwwwwwwwwww..ll..w..w", // 7
    "w..w..ll..w.........w..w..wwwwwwww..w..w.........w..ll..w..w", // 8
    "w..wwwwwww..........wwww............wwww..........wwwwwwwww..w", // 9
    "w..........................................................w", // 10
    "w..wwwwwwwwwwwwwwwwwwwwww..........wwwwwwwwwwwwwwwwwwwwww..w", // 11
    "w..wwwwwwwwwwwwwwwwwwwwww..........wwwwwwwwwwwwwwwwwwwwww..w", // 12
    "w..........................................................w", // 13
    "w..wwwwwwwwwwwwwwwwwwwwwwwwww.dd.wwwwwwwwwwwwwwwwwwwwwwww..w", // 14
    "w..wwwwwwwwwwwwwwwwwwwwwwwwww.dd.wwwwwwwwwwwwwwwwwwwwwwww..w", // 15
    "w............................dd............................w", // 16
    "w............................dd............................w", // 17
    "w..wwwwwwwwwwwwwwwwwwwwwwww.dd.wwwwwwwwwwwwwwwwwwwwwwww....w", // 18 (Locked Door is at row 18, col 28-29)
    "w..wwwwwwwwwwwwwwwwwwwwwwww.oo.wwwwwwwwwwwwwwwwwwwwwwww....w", // 19 (Web Portal behind door)
    "w............................ww............................w", // 20
    "w.llllllllllllllllllllllll..wwww..llllllllllllllllllllllll.w", // 21
    "w.llllllllllllllllllllllll..wwww..llllllllllllllllllllllll.w", // 22
    "w...........................wwww...........................w", // 23
    "w..........................................................w", // 24
    "w..........................................................w", // 25
    "w..........................................................w", // 26
    "w..........................................................w", // 27
    "w..........................................................w", // 28
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"  // 29
  ];

  const paddedLayout = layout.map(row => row.padEnd(60, "w").slice(0, 60));

  return paddedLayout.map(row =>
    row.split("").map(char => {
      switch (char) {
        case "w": return "dungeon_wall";
        case "l": return "lava";
        case "d": return "dungeon_door";
        case "o": return "portal"; // When unlocking door, this portal appears behind it!
        default: return "dungeon_floor";
      }
    })
  );
};

export const episode2Npcs: NPC[] = [
  {
    id: "guard_1",
    name: "Kapten Austin",
    x: 28 * 48,
    y: 21 * 48,
    width: 38,
    height: 44,
    direction: "up",
    dialogues: [
      "Uhukk... Hati-hati, anak muda! Ruangan di depan sangatlah berbahaya.",
      "Aku dan pasukan pelindung kerajaan dikalahkan oleh kekuatan kegelapan sang Raja Iblis.",
      "Gerbang besi itu dikunci rapat untuk menahan agar Iblis tidak keluar.",
      "Kunci Emas diletakkan di altar utara dungeon ini, menyeberangi lorong batuan.",
      "Dan senjata pusaka legendaris 'Aether Blade' tersimpan di dalam altar suci sebelah timur (sebelah kananmu dari lorong tengah). Ambil keduanya!",
      "Gunakan kuncinya untuk membuka pintu besi raksasa, dan pakai Aether Blade untuk menembus kulit iblis pelindungnya!",
      "Ambil kunci dan senjata itu, buka gerbangnya, dan hadapi dia! Pertolongan seluruh negeri ada di pundakmu."
    ],
    currentDialogueIndex: 0,
    spriteType: "guard",
    questIdTrigger: "q2"
  }
];

export const episode2Items: Item[] = [
  {
    id: "dungeon_key",
    type: "key",
    name: "Kunci Emas",
    x: 8 * 48 + 12,
    y: 5 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(252, 207, 58, 0.7)",
    pulseTimer: 0
  },
  {
    id: "legendary_weapon",
    type: "legendary_weapon",
    name: "Aether Blade ⚔️",
    x: 50 * 48 + 12,
    y: 6 * 48 + 12,
    width: 28,
    height: 28,
    collected: false,
    glowColor: "rgba(34, 211, 238, 0.8)",
    pulseTimer: 0
  },
  {
    id: "pot_2a",
    type: "potion",
    name: "Healing Potion",
    x: 50 * 48 + 12,
    y: 4 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(238, 77, 45, 0.5)",
    pulseTimer: 0
  },
  {
    id: "pot_2b",
    type: "potion",
    name: "Super Potion",
    x: 20 * 48 + 12,
    y: 3 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(238, 77, 45, 0.5)",
    pulseTimer: 0
  },
  {
    id: "gold_ep2_1",
    type: "gold_pile" as any,
    name: "Timbunan Emas",
    x: 38 * 48 + 12,
    y: 9 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(253, 224, 71, 0.7)",
    pulseTimer: 0.8,
    goldValue: 25
  } as any,
  {
    id: "gold_ep2_2",
    type: "gold_pile" as any,
    name: "Timbunan Emas",
    x: 54 * 48 + 12,
    y: 2 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(253, 224, 71, 0.7)",
    pulseTimer: 1.4,
    goldValue: 25
  } as any,
  {
    id: "gold_ep2_3",
    type: "gold_pile" as any,
    name: "Timbunan Emas",
    x: 4 * 48 + 12,
    y: 16 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(253, 224, 71, 0.7)",
    pulseTimer: 0.3,
    goldValue: 25
  } as any,
  {
    id: "gold_ep2_bonus1",
    type: "gold_pile" as any,
    name: "Peti Emas Terabaikan",
    x: 4 * 48 + 12,
    y: 26 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(253, 224, 71, 0.7)",
    pulseTimer: 0.7,
    goldValue: 40
  } as any,
  {
    id: "gold_ep2_bonus2",
    type: "gold_pile" as any,
    name: "Rahasia Altar Emas",
    x: 52 * 48 + 12,
    y: 26 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(253, 224, 71, 0.7)",
    pulseTimer: 1.1,
    goldValue: 45
  } as any,
  {
    id: "pot_2c_bonus",
    type: "potion",
    name: "Aether Super Potion",
    x: 35 * 48 + 12,
    y: 26 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(238, 77, 45, 0.5)",
    pulseTimer: 0.4
  }
];

export const episode2Quests: Quest[] = [
  {
    id: "q2",
    title: "Temukan Kunci Labyrinth",
    description: "Temukan Kunci Emas di altar utara dungeon untuk membuka Gerbang Besi raksasa.",
    status: "Active",
    reward: "Membuka Gerbang Utama",
    targetCount: 1,
    currentCount: 0
  },
  {
    id: "q2b",
    title: "Temukan Senjata Suci ⚔️",
    description: "Temukan senjata pusaka 'Aether Blade' di altar timur untuk menembus perlindungan Raja Iblis.",
    status: "Active",
    reward: "Izin Menantang Raja Iblis",
    targetCount: 1,
    currentCount: 0
  }
];
