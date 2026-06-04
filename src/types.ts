/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Direction = "down" | "up" | "left" | "right";

export interface Position {
  x: number;
  y: number;
}

export type CharacterClass = string;

export interface Skill {
  name: string;
  description: string;
  manaCost: number;
  damage: number;
  effectType?: string;
}

export interface ClassDefinition {
  id: string;
  name: string;
  description: string;
  hp: number;
  mana: number;
  attack: number;
  defense: number;
  speed: number;
  skills: Skill[];
  spritePath: string; // base key indicating visual style / palette
  accentClass?: string;
  emoji?: string;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  maxHealth: number;
  direction: Direction;
  isMoving: boolean;
  animFrame: number;
  animTimer: number;
  
  // New features
  classType: CharacterClass;
  mana: number;
  maxMana: number;
  manaPercentBonus: number; // e.g. 5 is for +5% mana
}

export type TileType = 
  | "grass" 
  | "dirt_path" 
  | "dirt_border"
  | "stone_obstacle" 
  | "tree_obstacle"
  | "dungeon_floor"
  | "dungeon_wall"
  | "dungeon_door"
  | "portal"
  | "lava"
  | "water";

export type ItemType = 
  | "crystal" 
  | "potion" 
  | "key"
  | "gold_pile"
  | "legendary_weapon"
  | "skill_book_fireball"
  | "skill_book_heal"
  | "skill_book_shield";

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  glowColor: string;
  pulseTimer: number;
}

export interface DialogueOption {
  text: string;
  nextNodeId: string | null;
  action?: "open_shop" | "open_trainer" | "start_quest" | "complete_quest" | string;
  actionArg?: string;
  requiredQuestId?: string;
}

export interface DialogueNode {
  id: string;
  text: string;
  speaker: string;
  options?: DialogueOption[];
}

export interface NPC {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  direction: Direction;
  dialogues: string[];
  currentDialogueIndex: number;
  spriteType: string; // Dynamic path for all pixel arts (townsfolk, monsters, magic, boss, etc.)
  questIdTrigger?: string;
  requiredItemId?: string;

  // Expanded framework parameters
  role?: "friendly" | "quest" | "merchant" | "trainer" | "guard" | "enemy" | "boss";
  dialogueTree?: DialogueNode[];
  currentDialogueNodeId?: string;
  interactionRadius?: number;

  // Hostile NPC and Enemy properties
  hp?: number;
  maxHp?: number;
  attack?: number;
  defense?: number;
  speed?: number;
  patrolPoints?: Position[];
  patrolIndex?: number;
  patrolTimer?: number;
  startX?: number;
  startY?: number;
  isDead?: boolean;
  expReward?: number;
  goldReward?: number;
  dropItemType?: ItemType;
  chaseRadius?: number;
  attackCooldown?: number;
  lastAttackTime?: number;

  // Boss Phase attributes
  phase?: number;
  phaseMaxHp?: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: "Active" | "Completed";
  reward: string;
  targetCount: number;
  currentCount: number;
}

export interface Inventory {
  potion: number;
  crystal: number;
  key: number;
  gold: number;
  unlockedSkills: string[]; // e.g. ["fireball", "heal"]
  hasLegendaryWeapon: boolean;
}

export interface DialogueState {
  speaker: string;
  text: string;
  onComplete?: () => void;
  options?: string[] | DialogueOption[];
  currentNodeId?: string;
  npcId?: string;
}

export interface Boss {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  direction: Direction;
  state: "idle" | "charging" | "attacking" | "teleporting" | "dead";
  animFrame: number;
  animTimer: number;
  actionTimer: number;
  targetX?: number;
  targetY?: number;
  phase: number;
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  color: string;
  fromBoss: boolean;
  life: number;
}

export interface GameState {
  currentEpisode: 1 | 2 | 3;
  inventory: Inventory;
  quests: Quest[];
  dialogue: DialogueState | null;
  activeNpcs: NPC[];
  activeItems: Item[];
  activeProjectiles: Projectile[];
  gameState: "menu" | "playing" | "inventory" | "gameover" | "victory" | "transition";
  transitionAlpha: number;
  transitionMessage: string;
  
  // Expanded for custom systems
  selectedSkill: "magic_missile" | "fireball" | "holy_heal" | "mana_shield" | "sucker_punch";
  showShop: boolean;
  showCharacterSelector: boolean;
}
