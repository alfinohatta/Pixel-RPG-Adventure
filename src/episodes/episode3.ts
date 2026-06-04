/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TileType, NPC, Item, Quest, Boss } from "../types";

// Legend:
// w = Wall
// l = Lava outline (hazard)
// f = Dungeon/Arena floor

const RAW_MAP_DESIGN = [
  "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww", // 0
  "wllllllllllllllllllllllllllllllllllllllllllllllllw", // 1
  "wl..............................................lw", // 2
  "wl..............................................lw", // 3
  "wl..............................................lw", // 4
  "wl..............................................lw", // 5
  "wl..............................................lw", // 6
  "wl..............................................lw", // 7
  "wl..............................................lw", // 8
  "wl......ll..............................ll......lw", // 9
  "wl......ll..............................ll......lw", // 10
  "wl......ll..............................ll......lw", // 11
  "wl..............................................lw", // 12
  "wl..............................................lw", // 13
  "wl..............................................lw", // 14
  "wl..............................................lw", // 15
  "wl..............................................lw", // 16
  "wl................................--------------lw", // 17
  "wl......llllllllllllllllllllllllllllllllll......lw", // 18
  "wl......llllllllllllllllllllllllllllllllll......lw", // 19
  "wl..............................................lw", // 20
  "wl..............................................lw", // 21
  "wl..............................................lw", // 22
  "wl..............................................lw", // 23
  "wl..............................................lw", // 24
  "wl..............................................lw", // 25
  "wl..............................................lw", // 26
  "wl..............................................lw", // 27
  "wllllllllllllllllllllllllllllllllllllllllllllllllw", // 28
  "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"  // 29
];

export const getMapGrid = (): TileType[][] => {
  const paddedMap = RAW_MAP_DESIGN.map(row => row.padEnd(50, "w").slice(0, 50));
  return paddedMap.map(row =>
    row.split("").map(char => {
      switch (char) {
        case "w": return "dungeon_wall";
        case "l": return "lava";
        default: return "dungeon_floor";
      }
    })
  );
};

export const episode3Npcs: NPC[] = [
  {
    id: "wizard_1",
    name: "Penyihir Jeral",
    x: 8 * 48,
    y: 22 * 48,
    width: 38,
    height: 44,
    direction: "right",
    dialogues: [
      "Petualang! Aku merapal mantra perlindungan terakhir untukmu di arena ini.",
      "Kekuatan Kristal Aether di kantongmu kini aktif sepenuhnya!",
      "Tekan [SPACEBAR] pada keyboardmu untuk menembakkan BOLA CAHAYA AETHER suci!",
      "Bola cahaya tersebut adalah satu-satunya hal yang bisa merusak perisai sang Raja Iblis.",
      "Hindari hujan bola api merah miliknya, dan minum Potion (tekan 'I') jika darahmu sekarat.",
      "Serang dia dengan gagah berani! Menangkan pertempuran ini!"
    ],
    currentDialogueIndex: 0,
    spriteType: "sage"
  }
];

export const episode3Items: Item[] = [
  {
    id: "pot_3a",
    type: "potion",
    name: "Elixir Potion",
    x: 4 * 48 + 12,
    y: 24 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(238, 77, 45, 0.5)",
    pulseTimer: 0
  },
  {
    id: "pot_3b",
    type: "potion",
    name: "Elixir Potion",
    x: 45 * 48 + 12,
    y: 24 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(238, 77, 45, 0.5)",
    pulseTimer: 0
  },
  {
    id: "pot_3c_bonus",
    type: "potion",
    name: "Aether Elixir",
    x: 4 * 48 + 12,
    y: 6 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(238, 77, 45, 0.5)",
    pulseTimer: 0.3
  },
  {
    id: "pot_3d_bonus",
    type: "potion",
    name: "Aether Elixir",
    x: 45 * 48 + 12,
    y: 6 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(238, 77, 45, 0.5)",
    pulseTimer: 0.6
  }
];

export const episode3Quests: Quest[] = [
  {
    id: "q3",
    title: "Kalahkan Raja Iblis!",
    description: "Tembakkan Bola Cahaya Aether [SPACEBAR] untuk melumpuhkan Raja Iblis dan selamatkan dunia.",
    status: "Active",
    reward: "Kedamaian Abadi",
    targetCount: 1,
    currentCount: 0
  }
];

export const initialBoss: Boss = {
  x: 24 * 48,
  y: 6 * 48,
  width: 96, // 2x larger than normal character
  height: 80,
  health: 240, // Boss Boss Hp
  maxHealth: 240,
  direction: "down",
  state: "idle",
  animFrame: 0,
  animTimer: 0,
  actionTimer: 0,
  phase: 1
};
