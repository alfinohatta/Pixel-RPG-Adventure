/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TileType, NPC, Item, Quest } from "../types";

// Legend:
// g = Grass
// p = Path
// t = Tree
// s = Stone
// o = Portal
// . = Empty space (resolved to grass)

const RAW_MAP_DESIGN = [
  "tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt", // 0
  "t..........................................................t", // 1
  "t...s.....................................tttttttt.........t", // 2
  "t.........................................t......t.........t", // 3
  "t......g..................................t..s.g.t.........t", // 4
  "t.....................ppppppppppppppp.....t......t.........t", // 5
  "t...............g.....p.............p.....tttttttt.........t", // 6
  "t...ppppppppppppppppppp..t......t...p......................t", // 7
  "t...p.................p..tttttttt...ppppppppppppppp........t", // 8
  "t...p.............................................p........t", // 9
  "t...p.............................................p........t", // 10
  "t...pppppppppp........tttttttttttttttttttttttt....p........t", // 11
  "t............p........t......................t....p........t", // 12
  "t............p........t..s................s..t....p........t", // 13
  "t............p........t......................t....p........t", // 14
  "t............p........t...pppppppppppppppp...t....p........t", // 15
  "ttttttttttttttttttttttt...p..............p...ttttttttttttttt", // 16
  "t.........................p..............p.................t", // 17
  "t.........................p..ttttttttt...p........g........t", // 18
  "t.....s......g............p..t.......t...p.................t", // 19
  "t.........................pppp........ctttpppppppppppppp...t", // 20
  "t......................................................p...t", // 21
  "t......................................................p...t", // 22
  "t...s..................................................p...t", // 23
  "t.......................s......s.......................p...t", // 24
  "t...........g..........................................p...t", // 25
  "t......................................................p...t", // 26
  "t......................................................p...t", // 27
  "t......................................................c...t", // 28
  "tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt"  // 29
];

// Map layout generator
export const getMapGrid = (): TileType[][] => {
  const paddedMap = RAW_MAP_DESIGN.map(row => row.padEnd(60, "t").slice(0, 60));
  return paddedMap.map(row =>
    row.split("").map(char => {
      switch (char) {
        case "t": return "tree_obstacle";
        case "s": return "stone_obstacle";
        case "p": return "dirt_path";
        case "o": return "portal";
        case "c": return "portal"; // Episode 1 Portal is at the bottom right path!
        default: return "grass";
      }
    })
  );
};

export const episode1Npcs: NPC[] = [
  {
    id: "sage_1",
    name: "Kakek Elrick",
    x: 6 * 48,
    y: 4 * 48,
    width: 38,
    height: 44,
    direction: "down",
    dialogues: [
      "Halo petualang muda! Dunia kita sedang dalam bahaya besar.",
      "Iblis kuno yang tertidur di kedalaman Dungeon bawah tanah mulai terbangun.",
      "Untuk mengalahkannya, kamu membutuhkan senjata suci yang didayai oleh kekuatan Kristal Aether.",
      "Carilah Kristal Aether suci yang berkilau di bagian tenggara lembah ini!",
      "Jika sudah mendapatkannya, kembalilah padaku agar aku bisa mengaktifkan gerbang dimensi."
    ],
    currentDialogueIndex: 0,
    spriteType: "sage",
    questIdTrigger: "q1"
  },
  {
    id: "merchant_1",
    name: "Paman Bardo",
    x: 16 * 48,
    y: 6 * 48,
    width: 38,
    height: 44,
    direction: "left",
    dialogues: [
      "Wah, ada pembeli! Sayangnya tokoku belum buka sepenuhnya akibat guncangan dari dungeon akhir-akhir ini.",
      "Tapi tenang, ini ambillah Ramuan Kesehatan (Potion) gratis untuk perbekalanmu!",
      "Gunakan tombol 'I' di keyboard untuk membuka kantong inventory-mu, dan gunakan potion untuk memulihkan lukamu.",
      "Semoga selamat sampai tujuan, anak muda!"
    ],
    currentDialogueIndex: 0,
    spriteType: "merchant"
  }
];

export const episode1Items: Item[] = [
  {
    id: "pot_1",
    type: "potion",
    name: "Healing Potion",
    x: 20 * 48 + 12,
    y: 7 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(238, 77, 45, 0.5)",
    pulseTimer: 0
  },
  {
    id: "aether_crystal",
    type: "crystal",
    name: "Kristal Aether",
    x: 52 * 48 + 12,
    y: 20 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(0, 240, 255, 0.7)",
    pulseTimer: 0
  },
  {
    id: "gold_ep1_1",
    type: "gold_pile" as any,
    name: "Timbunan Emas",
    x: 14 * 48 + 12,
    y: 11 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(253, 224, 71, 0.7)",
    pulseTimer: 1.2,
    goldValue: 20
  } as any,
  {
    id: "gold_ep1_2",
    type: "gold_pile" as any,
    name: "Timbunan Emas",
    x: 38 * 48 + 12,
    y: 15 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(253, 224, 71, 0.7)",
    pulseTimer: 0.5,
    goldValue: 20
  } as any,
  {
    id: "pot_1_bonus",
    type: "potion",
    name: "Super Potion",
    x: 48 * 48 + 12,
    y: 18 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(238, 77, 45, 0.5)",
    pulseTimer: 0.2
  },
  {
    id: "gold_ep1_bonus1",
    type: "gold_pile" as any,
    name: "Timbunan Emas Melimpah",
    x: 52 * 48 + 12,
    y: 2 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(253, 224, 71, 0.7)",
    pulseTimer: 0.8,
    goldValue: 35
  } as any,
  {
    id: "gold_ep1_bonus2",
    type: "gold_pile" as any,
    name: "Timbunan Emas Tersembunyi",
    x: 5 * 48 + 12,
    y: 20 * 48 + 12,
    width: 24,
    height: 24,
    collected: false,
    glowColor: "rgba(253, 224, 71, 0.7)",
    pulseTimer: 1.4,
    goldValue: 30
  } as any
];

export const episode1Quests: Quest[] = [
  {
    id: "q1",
    title: "Cari Kristal Aether",
    description: "Kakek Elrick memintamu mencari Kristal Aether suci di wilayah bagian tenggara lembah.",
    status: "Active",
    reward: "Aktivasi Portal Dimensi Kebun",
    targetCount: 1,
    currentCount: 0
  }
];
