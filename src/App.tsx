/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { 
  Player, 
  TileType, 
  NPC, 
  Item, 
  Quest, 
  DialogueState, 
  Boss, 
  Projectile, 
  GameState,
  Direction
} from "./types";

// Import modules
import { TILE_SIZE, checkCollision, drawFloorTile } from "./engine/map";
import { drawPixelSprite } from "./engine/sprites";
import { sound } from "./engine/sound";

// Import episode configurations
import * as ep1 from "./episodes/episode1";
import * as ep2 from "./episodes/episode2";
import * as ep3 from "./episodes/episode3";

// Import UI Overlays
import { HUD } from "./components/HUD";
import { DialogueBox } from "./components/DialogueBox";
import { InventoryMenu } from "./components/InventoryMenu";
import { GameShop } from "./components/GameShop";
import { CharacterSelection } from "./components/CharacterSelection";
import { CharacterClass } from "./types";
import { createEpisodeNPCs, CLASS_DEFINITIONS, getPaletteForClass } from "./engine/rpgSystem";

// Icons
import { Play, RotateCcw, Award, Sparkles, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";

const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 480;

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scaler state for responsive game view
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        if (width < VIEW_WIDTH) {
          setScale(width / VIEW_WIDTH);
        } else {
          setScale(1);
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Sound Muted state
  const [isMuted, setIsMuted] = useState(sound.getMutedState());

  // Game UI/Overlay React States
  const [gameState, setGameState] = useState<GameState>({
    currentEpisode: 1,
    inventory: { 
      potion: 2, 
      crystal: 0, 
      key: 0, 
      gold: 15, // start with some Gold to test Game Shop!
      unlockedSkills: ["magic_missile", "sucker_punch"],
      book_fireball: 0,
      book_heal: 0,
      book_shield: 0,
      hasLegendaryWeapon: false
    } as any,
    quests: ep1.episode1Quests,
    dialogue: null,
    activeNpcs: createEpisodeNPCs(1),
    activeItems: ep1.episode1Items,
    activeProjectiles: [],
    gameState: "menu",
    transitionAlpha: 0,
    transitionMessage: "",
    selectedSkill: "magic_missile",
    showShop: false,
    showCharacterSelector: false,
  });

  // A Ref to always hold the latest gameState for our event listeners and game loop
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Hotkey helpers
  const [showControlsModal, setShowControlsModal] = useState(false);

  // Player state references
  const playerRef = useRef<Player>({
    x: 4 * TILE_SIZE,
    y: 7 * TILE_SIZE,
    vx: 0,
    vy: 0,
    width: 32,
    height: 48,
    speed: 3.1, // Adjusted base to 3.1
    health: 120, // Warrior HP is 120
    maxHealth: 120,
    direction: "down",
    isMoving: false,
    animFrame: 0,
    animTimer: 0,
    classType: "warrior",
    mana: 40,
    maxMana: 40,
    manaPercentBonus: 0,
  });

  // Current Tile Map Grid
  const mapGridRef = useRef<TileType[][]>(ep1.getMapGrid());

  // Camera scroll offsets
  const cameraRef = useRef({ x: 0, y: 0 });

  // Keyboard references
  const keysRef = useRef<Record<string, boolean>>({});

  // Episode Transition State Ref
  const transitionRef = useRef({ alpha: 0, targetAlpha: 0, message: "" });

  // Floating texts (damage numbers, item picks)
  const floatingTextsRef = useRef<FloatingText[]>([]);
  // Visual spell particles
  const particlesRef = useRef<Particle[]>([]);

  // BOSS (only active in Episode 3)
  const bossRef = useRef<Boss | null>(null);
  const [bossHealth, setBossHealth] = useState(120);
  const [bossMaxHealth, setBossMaxHealth] = useState(120);

  // Speak proximity range check
  const [proximityNpc, setProximityNpc] = useState<NPC | null>(null);

  // Trigger sound mute
  const toggleSoundMute = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  };

  // Switch between episodes beautifully
  const loadEpisode = (epNum: 1 | 2 | 3) => {
    sound.playTeleport();
    
    setGameState((prev) => ({
      ...prev,
      transitionAlpha: 1,
      transitionMessage: `Menuju Episode ${epNum}...`,
    }));
    transitionRef.current = { alpha: 1, targetAlpha: 1, message: `Episode ${epNum}` };

    setTimeout(() => {
      // Re-map keys to false to prevent sticky movement
      keysRef.current = {};

      if (epNum === 1) {
        mapGridRef.current = ep1.getMapGrid();
        playerRef.current = {
          ...playerRef.current,
          x: 4 * TILE_SIZE,
          y: 7 * TILE_SIZE,
          health: 100,
          maxHealth: 100,
          isMoving: false,
        };
        bossRef.current = null;
        setGameState((prev) => ({
          ...prev,
          currentEpisode: 1,
          quests: JSON.parse(JSON.stringify(ep1.episode1Quests)),
          activeNpcs: createEpisodeNPCs(1),
          activeItems: JSON.parse(JSON.stringify(ep1.episode1Items)),
          activeProjectiles: [],
          dialogue: {
            speaker: "Log Petualangan",
            text: "Episode 1 Dimulai: Lembah Aether. Bicaralah pada Kakek Elrick di dekat kebun.",
          },
        }));
      } else if (epNum === 2) {
        mapGridRef.current = ep2.getMapGrid();
        playerRef.current = {
          ...playerRef.current,
          x: 13 * TILE_SIZE,
          y: 14 * TILE_SIZE, // Spawn near bottom corridor
          isMoving: false,
        };
        bossRef.current = null;
        setGameState((prev) => ({
          ...prev,
          currentEpisode: 2,
          quests: JSON.parse(JSON.stringify(ep2.episode2Quests)),
          activeNpcs: createEpisodeNPCs(2),
          activeItems: JSON.parse(JSON.stringify(ep2.episode2Items)),
          activeProjectiles: [],
          dialogue: {
            speaker: "Log Petualangan",
            text: "Dungeon Lembah Hitam. Temukan Kunci Labyrinth emas di altar utara DAN senjata suci 'Aether Blade' di altar timur (sebelah kanan)!",
          },
        }));
      } else if (epNum === 3) {
        mapGridRef.current = ep3.getMapGrid();
        playerRef.current = {
          ...playerRef.current,
          x: 14 * TILE_SIZE,
          y: 12 * TILE_SIZE, // Bottom spawn
          isMoving: false,
        };
        bossRef.current = JSON.parse(JSON.stringify(ep3.initialBoss));
        setBossHealth(ep3.initialBoss.health);
        setBossMaxHealth(ep3.initialBoss.maxHealth);

        setGameState((prev) => ({
          ...prev,
          currentEpisode: 3,
          quests: JSON.parse(JSON.stringify(ep3.episode3Quests)),
          activeNpcs: createEpisodeNPCs(3),
          activeItems: JSON.parse(JSON.stringify(ep3.episode3Items)),
          activeProjectiles: [],
          dialogue: {
            speaker: "Penyembuh Arena",
            text: "SIAPKAN SENJATAMU! Tembakkan Bola Sihir Aether dengan [SPACEBAR] untuk mengalahkan Raja Iblis!",
          },
        }));
      }

      // Smooth fade-in
      transitionRef.current.targetAlpha = 0;
      setGameState((prev) => ({
        ...prev,
        gameState: "playing",
        transitionAlpha: 0,
      }));
    }, 1200);
  };

  const resetGameTotal = () => {
    playerRef.current.classType = "warrior";
    playerRef.current.health = 120;
    playerRef.current.maxHealth = 120;
    playerRef.current.speed = 3.1;
    playerRef.current.mana = 40;
    playerRef.current.maxMana = 40;
    playerRef.current.manaPercentBonus = 0;

    setGameState((prev) => ({
      ...prev,
      inventory: { 
        potion: 2, 
        crystal: 0, 
        key: 0, 
        gold: 15,
        unlockedSkills: ["magic_missile", "sucker_punch"],
        book_fireball: 0,
        book_heal: 0,
        book_shield: 0,
        hasLegendaryWeapon: false
      } as any,
      selectedSkill: "magic_missile",
      showShop: false,
      showCharacterSelector: false,
    }));
    loadEpisode(1);
  };

  const useSkillBook = (skillType: "fireball" | "holy_heal" | "mana_shield") => {
    let skillKey = "";
    let bookKey = "";
    let displayName = "";
    let color = "";

    if (skillType === "fireball") {
      skillKey = "fireball";
      bookKey = "book_fireball";
      displayName = "Bola Api";
      color = "#f97316";
    } else if (skillType === "holy_heal") {
      skillKey = "holy_heal";
      bookKey = "book_heal";
      displayName = "Cahaya Suci";
      color = "#10b981";
    } else if (skillType === "mana_shield") {
      skillKey = "mana_shield";
      bookKey = "book_shield";
      displayName = "Perisai Aura";
      color = "#8b5cf6";
    }

    const ownCount = (gameState.inventory as any)[bookKey] || 0;
    if (ownCount <= 0) return;

    if (gameState.inventory.unlockedSkills.includes(skillKey)) {
      addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Sudah Dipelajari!", "#ef4444");
      return;
    }

    setGameState((prev) => {
      const nextSkills = [...prev.inventory.unlockedSkills];
      if (!nextSkills.includes(skillKey)) {
        nextSkills.push(skillKey);
      }
      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          [bookKey]: ownCount - 1,
          unlockedSkills: nextSkills
        } as any,
        selectedSkill: skillKey as any
      };
    });

    addFloatingText(
      playerRef.current.x + playerRef.current.width / 2,
      playerRef.current.y - 15,
      `Paham Sihir ${displayName}! 📖`,
      color
    );

    spawnSparks(
      playerRef.current.x + playerRef.current.width / 2,
      playerRef.current.y + playerRef.current.height / 2,
      color,
      25
    );
  };

  const buyShopItem = (itemKey: "potion" | "book_fireball" | "book_heal" | "book_shield" | "mana_5_percent") => {
    const gold = gameState.inventory.gold;
    const inv = gameState.inventory as any;

    if (itemKey === "potion") {
      if (gold < 15) return;
      setGameState((prev) => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          gold: gold - 15,
          potion: prev.inventory.potion + 1
        }
      }));
      addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Beli Potion 🧪 (+1)!", "#f43f5e");
    } else if (itemKey === "mana_5_percent") {
      if (gold < 30 || playerRef.current.maxMana <= 0) return;
      playerRef.current.manaPercentBonus += 5;
      
      setGameState((prev) => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          gold: gold - 30
        }
      }));
      addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Mana Maksimum +5%! 🌀", "#38bdf8");
    } else if (itemKey === "book_fireball") {
      if (gold < 40) return;
      setGameState((prev) => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          gold: gold - 40,
          book_fireball: (inv.book_fireball || 0) + 1
        } as any
      }));
      addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Beli Buku Bola Api! 📖", "#f97316");
    } else if (itemKey === "book_heal") {
      if (gold < 55) return;
      setGameState((prev) => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          gold: gold - 55,
          book_heal: (inv.book_heal || 0) + 1
        } as any
      }));
      addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Beli Kitab Cahaya Suci! 📖", "#10b981");
    } else if (itemKey === "book_shield") {
      if (gold < 45) return;
      setGameState((prev) => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          gold: gold - 45,
          book_shield: (inv.book_shield || 0) + 1
        } as any
      }));
      addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Beli Buku Perisai Aura! 📖", "#a855f7");
    }
  };

  const changeHeroClass = (newClass: CharacterClass) => {
    const p = playerRef.current;
    p.classType = newClass;

    const classDef = CLASS_DEFINITIONS.find((c) => c.id === newClass);
    if (classDef) {
      p.maxHealth = classDef.hp;
      p.health = Math.min(classDef.hp, p.health);
      p.maxMana = classDef.mana;
      p.mana = Math.min(classDef.mana, p.mana);
      p.speed = classDef.speed;
      
      addFloatingText(p.x + p.width / 2, p.y - 14, `Hero Ganti: ${classDef.name}! ${classDef.emoji}`, "#2ee1ff");
    } else {
      addFloatingText(p.x + p.width / 2, p.y - 14, `Hero Ganti: ${newClass}! ✨`, "#2ee1ff");
    }
    
    spawnSparks(p.x + p.width/2, p.y + p.height/2, "#2ee1ff", 20);

    setGameState((prev) => ({
      ...prev,
      showCharacterSelector: false
    }));
  };

  // Keyboard Event Binders
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const gameState = gameStateRef.current;
      const code = e.key.toLowerCase();

      // If viewing menu or loading transitions, ignore game keys
      if (gameState.gameState === "menu") {
        if (e.key === "Enter") {
          sound.playTeleport();
          loadEpisode(1);
        }
        return;
      }

      // Quick Keys:
      if (e.key === "Escape") {
        if (gameState.gameState === "inventory") {
          setGameState(prev => ({ ...prev, gameState: "playing" }));
        } else if (gameState.gameState === "playing") {
          setGameState(prev => ({ ...prev, gameState: "inventory" }));
        }
        return;
      }

      // Action Bar Hotkeys (1-6)
      if (gameState.gameState === "playing") {
        if (e.key === "1") {
          sound.playPickup();
          setGameState(prev => ({ ...prev, selectedSkill: "magic_missile" }));
          addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Sihir: Aether Bullet!", "#2ee1ff");
          return;
        }
        if (e.key === "2") {
          if (gameState.inventory.unlockedSkills.includes("sucker_punch")) {
            sound.playPickup();
            setGameState(prev => ({ ...prev, selectedSkill: "sucker_punch" }));
            addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Sihir: Sucker Punch!", "#fb7185");
          }
          return;
        }
        if (e.key === "3") {
          if (gameState.inventory.unlockedSkills.includes("fireball")) {
            sound.playPickup();
            setGameState(prev => ({ ...prev, selectedSkill: "fireball" }));
            addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Sihir: Bola Api!", "#f97316");
          } else {
            addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Beli Buku Bola Api di Toko! 📖", "#f97316");
          }
          return;
        }
        if (e.key === "4") {
          if (gameState.inventory.unlockedSkills.includes("holy_heal")) {
            sound.playPickup();
            setGameState(prev => ({ ...prev, selectedSkill: "holy_heal" }));
            addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Sihir: Cahaya Suci!", "#10b981");
          } else {
            addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Beli Kitab Cahaya Suci di Toko! 📖", "#10b981");
          }
          return;
        }
        if (e.key === "5") {
          if (gameState.inventory.unlockedSkills.includes("mana_shield")) {
            sound.playPickup();
            setGameState(prev => ({ ...prev, selectedSkill: "mana_shield" }));
            addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Sihir: Perisai Aura!", "#a855f7");
          } else {
            addFloatingText(playerRef.current.x + playerRef.current.width/2, playerRef.current.y - 12, "Beli Buku Perisai Aura di Toko! 📖", "#a855f7");
          }
          return;
        }
        if (e.key === "6") {
          useHealthPotion();
          return;
        }
      }

      if (code === "i") {
        setGameState((prev) => ({
          ...prev,
          gameState: prev.gameState === "inventory" ? "playing" : "inventory",
        }));
        return;
      }

      // Dialogue advancement key E
      if (code === "e") {
        if (gameState.dialogue) {
          // Handled via Dialogue skip or overlay click triggers
          const dialogSkipBtn = document.querySelector(".w-full.max-w-2xl") as HTMLDivElement;
          if (dialogSkipBtn) dialogSkipBtn.click();
          return;
        }

        // If player is proximate to an NPC, initiate dialogue
        if (proximityNpc) {
          initiateConversation(proximityNpc);
          return;
        }
      }

      // Spells / Shooting (All Episodes)
      if (e.code === "Space") {
        e.preventDefault();
        if (gameState.dialogue) {
          const dialogSkipBtn = document.querySelector(".w-full.max-w-2xl") as HTMLDivElement;
          if (dialogSkipBtn) dialogSkipBtn.click();
          return;
        }

        if (gameState.gameState === "playing") {
          castActiveSkill();
        }
        return;
      }

      // Store directions keys
      keysRef.current[code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.key.toLowerCase();
      keysRef.current[code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState.gameState, gameState.dialogue, gameState.currentEpisode, proximityNpc]);

  // Launch interaction / dialogue lines
  const initiateConversation = (npc: NPC) => {
    sound.playTalk(1);

    // 1. Check if branching dialogueTree exists!
    if (npc.dialogueTree && npc.dialogueTree.length > 0) {
      const nodeId = npc.currentDialogueNodeId || "start";
      const node = npc.dialogueTree.find((n) => n.id === nodeId) || npc.dialogueTree[0];
      
      // Custom Quest triggers during branching nodes to hook missions seamlessly:
      if (gameState.currentEpisode === 1 && npc.id === "sage_1" && nodeId === "start") {
        if (gameState.inventory.crystal > 0) {
          const completeNode = npc.dialogueTree.find((n) => n.id === "quest_complete");
          if (completeNode) {
            setGameState((prev) => {
              const updatedQuests = prev.quests.map((q) =>
                q.id === "q1" ? { ...q, status: "Completed" as const, currentCount: 1 } : q
              );
              if (mapGridRef.current) {
                mapGridRef.current[14][28] = "portal";
              }
              setTimeout(() => { sound.playQuestComplete(); }, 500);
              return { ...prev, quests: updatedQuests };
            });
            
            setGameState((prev) => ({
              ...prev,
              dialogue: {
                speaker: npc.name,
                text: completeNode.text,
                options: completeNode.options,
                currentNodeId: completeNode.id,
                npcId: npc.id,
              }
            }));
            return;
          }
        }
      }

      if (gameState.currentEpisode === 2 && npc.id === "guard_1" && nodeId === "start") {
        const hasKey = gameState.inventory.key > 0;
        const hasWeapon = gameState.inventory.hasLegendaryWeapon;
        if (hasKey && hasWeapon) {
          const completeNode = npc.dialogueTree.find((n) => n.id === "all_complete");
          if (completeNode) {
            setGameState((prev) => {
              const updatedQuests = prev.quests.map((q) =>
                q.id === "q2" || q.id === "q2b" ? { ...q, status: "Completed" as const, currentCount: 1 } : q
              );
              if (mapGridRef.current) {
                mapGridRef.current[11][13] = "portal";
              }
              setTimeout(() => { sound.playQuestComplete(); }, 500);
              return { ...prev, quests: updatedQuests };
            });
            setGameState((prev) => ({
              ...prev,
              dialogue: {
                speaker: npc.name,
                text: completeNode.text,
                options: completeNode.options,
                currentNodeId: completeNode.id,
                npcId: npc.id,
              }
            }));
            return;
          }
        }
      }

      setGameState((prev) => ({
        ...prev,
        dialogue: {
          speaker: npc.name,
          text: node.text,
          options: node.options,
          currentNodeId: node.id,
          npcId: npc.id,
          onComplete: () => {
            if (!node.options || node.options.length === 0) {
              setGameState((p) => {
                const updatedNpcs = p.activeNpcs.map((n) => 
                  n.id === npc.id ? { ...n, currentDialogueNodeId: "start" } : n
                );
                return { ...p, activeNpcs: updatedNpcs };
              });
            }
          }
        }
      }));
      return;
    }

    // Dynamic dialogue callbacks depending on quests or items
    let dialogueMessage = npc.dialogues[npc.currentDialogueIndex % npc.dialogues.length];
    
    // Custom check for quests logic in Episode 1
    if (gameState.currentEpisode === 1 && npc.id === "sage_1") {
      if (gameState.inventory.crystal > 0) {
        dialogueMessage = "Luar biasa! Kamu berhasil mengamankan Kristal Aether suci. Sekarang, gerbang portal dimensi di ujung kanan jalan telah terbuka kembali. Masuklah, hadapi rintangan labyrinth!";
        
        // Mark Quest completed!
        setGameState(prev => {
          const updatedQuests = prev.quests.map(q => q.id === "q1" ? { ...q, status: "Completed" as const, currentCount: 1 } : q);
          
          // Open the Portal tile in Episode 1 bottom right!
          // Replace portal border block to make it walkable
          if (mapGridRef.current) {
            mapGridRef.current[14][28] = "portal";
          }

          // Complete quest audio
          setTimeout(() => { sound.playQuestComplete(); }, 500);

          return {
            ...prev,
            quests: updatedQuests
          };
        });
      } else {
        // Trigger Quest active if speaking to Elrick first time
        setGameState(prev => {
          const updatedQuests = prev.quests.map(q => q.id === "q1" ? { ...q, status: "Active" as const } : q);
          return { ...prev, quests: updatedQuests };
        });
      }
    }

    // Custom check for quests logic in Episode 2 (Wounded Captain)
    if (gameState.currentEpisode === 2 && npc.id === "guard_1") {
      const hasKey = gameState.inventory.key > 0;
      const hasWeapon = gameState.inventory.hasLegendaryWeapon;

      if (hasKey && hasWeapon) {
        dialogueMessage = "Luar biasa! Kamu telah menemukan Kunci Emas dan senjata suci 'Aether Blade'! Gerbang portal raksasa menuju sarang Raja Iblis sekarang telah teraliri oleh energi Aether suci dngan sempurna! Bersiaplah, hadapi dan hancurkan kegelapan!";
        
        // Unlock door automatically and complete both quests
        setGameState(prev => {
          const updatedQuests = prev.quests.map(q => {
            if (q.id === "q2" || q.id === "q2b") {
              return { ...q, status: "Completed" as const, currentCount: 1 };
            }
            return q;
          });
          
          if (mapGridRef.current) {
            mapGridRef.current[11][13] = "portal"; // Replace door tile with walkable portal
          }

          setTimeout(() => { sound.playQuestComplete(); }, 500);

          return { ...prev, quests: updatedQuests };
        });
      } else if (hasKey && !hasWeapon) {
        dialogueMessage = "Bagus sekali! Kunci Emas ada di tanganmu. Namun, itu tidaklah cukup untuk menghadapi kengerian Raja Iblis. Pergilah ke ruang timur dahulu, temukan senjata legendaris 'Aether Blade' di altar suci! Tanpanya, serangan biasamu takkan sanggup melukai kulit iblisnya!";
        setGameState(prev => {
          const updatedQuests = prev.quests.map(q => {
            if (q.id === "q2") return { ...q, status: "Completed" as const, currentCount: 1 };
            if (q.id === "q2b") return { ...q, status: "Active" as const };
            return q;
          });
          return { ...prev, quests: updatedQuests };
        });
      } else if (!hasKey && hasWeapon) {
        dialogueMessage = "Senjata legendaris 'Aether Blade' memancarkan cahaya suci yang agung di tanganmu! Tapi segel Gerbang Besi masih mengunci jalan. Pergilah ke ruang barat/utara dan temukan Kunci Emas di altar dungeon!";
        setGameState(prev => {
          const updatedQuests = prev.quests.map(q => {
            if (q.id === "q2b") return { ...q, status: "Completed" as const, currentCount: 1 };
            if (q.id === "q2") return { ...q, status: "Active" as const };
            return q;
          });
          return { ...prev, quests: updatedQuests };
        });
      } else {
        dialogueMessage = "Uhukk... Hati-hati, anak muda! Ruangan di depan sangatlah berbahaya. Kamu membutuhkan Kunci Emas di altar utara dungeon untuk membuka segelnya, DAN senjata suci 'Aether Blade' di altar timur untuk menembus kulit lapis baja Raja Iblis! Amankan keduanya sebelum melangkah!";
        setGameState(prev => {
          const updatedQuests = prev.quests.map(q => {
            if (q.id === "q2" || q.id === "q2b") {
              return { ...q, status: "Active" as const };
            }
            return q;
          });
          return { ...prev, quests: updatedQuests };
        });
      }
    }

    setGameState((prev) => ({
      ...prev,
      dialogue: {
        speaker: npc.name,
        text: dialogueMessage,
        onComplete: () => {
          // Increment dialogue line for variations next talk
          setGameState(p => {
            const updatedNpcs = p.activeNpcs.map(n => 
              n.id === npc.id ? { ...n, currentDialogueIndex: n.currentDialogueIndex + 1 } : n
            );
            return { ...p, activeNpcs: updatedNpcs };
          });
        }
      },
    }));
  };

  // Dialogue Branching Choice Router Callback
  const handleSelectDialogueOption = (option: any, index: number) => {
    if (typeof option === "string") {
      setGameState((prev) => ({ ...prev, dialogue: null }));
      return;
    }

    const { text, nextNodeId, action, actionArg } = option;

    // A. Handle Dialogue Trigger Actions!
    if (action) {
      if (action === "open_shop") {
        setGameState((prev) => ({ ...prev, dialogue: null, showShop: true }));
        return;
      }
      if (action === "open_character_selector") {
        setGameState((prev) => ({ ...prev, dialogue: null, showCharacterSelector: true }));
        return;
      }
      if (action === "start_quest") {
        const questId = actionArg || "q1";
        setGameState((prev) => {
          const updatedQuests = prev.quests.map((q) =>
            q.id === questId && q.status !== "Completed" ? { ...q, status: "Active" as const } : q
          );
          return { ...prev, quests: updatedQuests, dialogue: null };
        });
        sound.playQuestComplete();
        addFloatingText(playerRef.current.x + playerRef.current.width / 2, playerRef.current.y - 12, "Quest Dimulai! 🧭", "#ecc326");
        return;
      }
      if (action === "train_fireball") {
        setGameState((prev) => {
          if (prev.inventory.gold >= 40) {
            const updatedSkills = prev.inventory.unlockedSkills.includes("fireball")
              ? prev.inventory.unlockedSkills
              : [...prev.inventory.unlockedSkills, "fireball"];
            addFloatingText(playerRef.current.x + playerRef.current.width / 2, playerRef.current.y - 12, "Mempelajari Sihir Bola Api! 🔥", "#f97316");
            return {
              ...prev,
              inventory: {
                ...prev.inventory,
                gold: prev.inventory.gold - 40,
                unlockedSkills: updatedSkills,
              },
              dialogue: null,
            };
          } else {
            addFloatingText(playerRef.current.x + playerRef.current.width / 2, playerRef.current.y - 12, "Emas Kurang! 🪙", "#ff3333");
            return { ...prev, dialogue: null };
          }
        });
        return;
      }
      if (action === "train_heal") {
        setGameState((prev) => {
          if (prev.inventory.gold >= 55) {
            const updatedSkills = prev.inventory.unlockedSkills.includes("holy_heal")
              ? prev.inventory.unlockedSkills
              : [...prev.inventory.unlockedSkills, "holy_heal"];
            addFloatingText(playerRef.current.x + playerRef.current.width / 2, playerRef.current.y - 12, "Mempelajari Cahaya Suci! 💖", "#10b981");
            return {
              ...prev,
              inventory: {
                ...prev.inventory,
                gold: prev.inventory.gold - 55,
                unlockedSkills: updatedSkills,
              },
              dialogue: null,
            };
          } else {
            addFloatingText(playerRef.current.x + playerRef.current.width / 2, playerRef.current.y - 12, "Emas Kurang! 🪙", "#ff3333");
            return { ...prev, dialogue: null };
          }
        });
        return;
      }
      if (action === "train_shield") {
        setGameState((prev) => {
          if (prev.inventory.gold >= 45) {
            const updatedSkills = prev.inventory.unlockedSkills.includes("mana_shield")
              ? prev.inventory.unlockedSkills
              : [...prev.inventory.unlockedSkills, "mana_shield"];
            addFloatingText(playerRef.current.x + playerRef.current.width / 2, playerRef.current.y - 12, "Mempelajari Perisai Aura! 🛡️", "#a855f7");
            return {
              ...prev,
              inventory: {
                ...prev.inventory,
                gold: prev.inventory.gold - 45,
                unlockedSkills: updatedSkills,
              },
              dialogue: null,
            };
          } else {
            addFloatingText(playerRef.current.x + playerRef.current.width / 2, playerRef.current.y - 12, "Emas Kurang! 🪙", "#ff3333");
            return { ...prev, dialogue: null };
          }
        });
        return;
      }
    }

    // B. Handle Traversal of Dialogue Nodes!
    if (nextNodeId) {
      const npcId = gameStateRef.current.dialogue?.npcId;
      setGameState((prev) => {
        const updatedNpcs = prev.activeNpcs.map((n) =>
          n.id === npcId ? { ...n, currentDialogueNodeId: nextNodeId } : n
        );
        
        const currentNpc = updatedNpcs.find((n) => n.id === npcId);
        if (currentNpc && currentNpc.dialogueTree) {
          const nextNode = currentNpc.dialogueTree.find((node) => node.id === nextNodeId);
          if (nextNode) {
            return {
              ...prev,
              activeNpcs: updatedNpcs,
              dialogue: {
                speaker: currentNpc.name,
                text: nextNode.text,
                options: nextNode.options,
                currentNodeId: nextNode.id,
                npcId: currentNpc.id,
                onComplete: () => {
                  if (!nextNode.options || nextNode.options.length === 0) {
                    setGameState((p) => {
                      const resetNpcs = p.activeNpcs.map((n) =>
                        n.id === npcId ? { ...n, currentDialogueNodeId: "start" } : n
                      );
                      return { ...p, activeNpcs: resetNpcs };
                    });
                  }
                },
              },
            };
          }
        }
        return { ...prev, dialogue: null };
      });
    } else {
      setGameState((prev) => ({ ...prev, dialogue: null }));
    }
  };

  // Channel energy - Cast Active magic skill
  const castActiveSkill = () => {
    const p = playerRef.current;
    if (gameState.gameState !== "playing") return;

    const skill = gameState.selectedSkill;
    
    // 1. Magic Missile / Aether Bullet (Basic, always available!)
    if (skill === "magic_missile") {
      sound.playShoot();
      let vx = 0, vy = 0;
      const bulletSpeed = p.classType === "rogue" ? 9 : 7; // rogue has faster physical projectile speed!
      switch (p.direction) {
        case "left": vx = -bulletSpeed; break;
        case "right": vx = bulletSpeed; break;
        case "up": vy = -bulletSpeed; break;
        case "down": vy = bulletSpeed; break;
      }
      const projectile: Projectile = {
        x: p.x + p.width / 2,
        y: p.y + p.height / 2,
        vx,
        vy,
        radius: 6,
        damage: p.classType === "mage" ? 15 : 10, // Mage deals higher base damage!
        color: "#2ee1ff",
        fromBoss: false,
        life: 100,
      };
      setGameState((prev) => ({
        ...prev,
        activeProjectiles: [...prev.activeProjectiles, projectile],
      }));
      spawnSparks(p.x + p.width/2, p.y + p.height/2, "#2ee1ff", 6);
      return;
    }

    // 2. Sucker Punch (Melee physical hit, instant cast, 8 energy)
    if (skill === "sucker_punch") {
      const punchCost = 8;
      if (p.mana < punchCost) {
        addFloatingText(p.x + p.width / 2, p.y - 12, "Energi Kurang! ⚡", "#fb7185");
        sound.playHit();
        return;
      }
      p.mana = Math.max(0, p.mana - punchCost);
      sound.playExplosion(); // punch sound!
      
      let vx = 0, vy = 0;
      const bulletSpeed = 12; // swift physical displacement
      switch (p.direction) {
        case "left": vx = -bulletSpeed; break;
        case "right": vx = bulletSpeed; break;
        case "up": vy = -bulletSpeed; break;
        case "down": vy = bulletSpeed; break;
      }
      const projectile: Projectile = {
        x: p.x + p.width / 2,
        y: p.y + p.height / 2,
        vx,
        vy,
        radius: 9, // wider fist impact
        damage: p.classType === "warrior" ? 22 : p.classType === "rogue" ? 18 : 12, // physical force damage
        color: "#fb7185", // punch glowing pink red
        fromBoss: false,
        life: 5, // short-lived melee burst!
      };
      setGameState((prev) => ({
        ...prev,
        activeProjectiles: [...prev.activeProjectiles, projectile],
      }));
      spawnSparks(p.x + p.width/2 + vx * 2, p.y + p.height/2 + vy * 2, "#fda4af", 12);
      addFloatingText(p.x + p.width / 2, p.y - 12, "Sucker Punch! 🥊", "#f43f5e");
      return;
    }

    // Checking Mana for magical spells
    let cost = 0;
    if (skill === "fireball") cost = 15;
    else if (skill === "holy_heal") cost = 30;
    else if (skill === "mana_shield") cost = 25;

    // Apply +5% Mana bonus calculations
    const multiplier = 1 + (p.manaPercentBonus / 100);
    if (p.mana < cost) {
      addFloatingText(p.x + p.width / 2, p.y - 12, "Mana Kurang! 🌀", "#38bdf8");
      sound.playHit();
      return;
    }

    // Spend Mana!
    p.mana = Math.max(0, p.mana - cost);

    if (skill === "fireball") {
      sound.playShoot();
      let vx = 0, vy = 0;
      const bulletSpeed = p.classType === "rogue" ? 11 : 9;
      switch (p.direction) {
        case "left": vx = -bulletSpeed; break;
        case "right": vx = bulletSpeed; break;
        case "up": vy = -bulletSpeed; break;
        case "down": vy = bulletSpeed; break;
      }
      const projectile: Projectile = {
        x: p.x + p.width / 2,
        y: p.y + p.height / 2,
        vx,
        vy,
        radius: 11, // HUGE explosive fireball!
        damage: p.classType === "mage" ? 50 : p.classType === "rogue" ? 35 : 40,
        color: "#f97316",
        fromBoss: false,
        life: 110,
      };
      setGameState((prev) => ({
        ...prev,
        activeProjectiles: [...prev.activeProjectiles, projectile],
      }));
      spawnSparks(p.x + p.width/2, p.y + p.height/2, "#f97316", 18);
      addFloatingText(p.x + p.width / 2, p.y - 12, "Bola Api! 🔥", "#f97316");

    } else if (skill === "holy_heal") {
      sound.playDrinkPotion();
      const healingAmount = 40;
      const originalHealth = p.health;
      p.health = Math.min(p.maxHealth, p.health + healingAmount);
      addFloatingText(p.x + p.width / 2, p.y - 12, `Heal +${p.health - originalHealth} HP! 💖`, "#22c55e");
      spawnSparks(p.x + p.width/2, p.y + p.height/2, "#22c55e", 20);

    } else if (skill === "mana_shield") {
      sound.playTeleport();
      // Increase HP by 25!
      p.health = p.health + 25;
      addFloatingText(p.x + p.width / 2, p.y - 12, "Perisai Aura Aktif! 🛡️", "#a855f7");
      spawnSparks(p.x + p.width/2, p.y + p.height/2, "#c084fc", 15);
    }
  };

  // Generate particle explosion effects
  const spawnSparks = (x: number, y: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2 + Math.random() * 3,
        life: 1,
        maxLife: 20 + Math.random() * 20,
      });
    }
  };

  // Spawns damage floating texts
  const addFloatingText = (x: number, y: number, text: string, color = "#ff4444") => {
    floatingTextsRef.current.push({
      x,
      y,
      text,
      color,
      life: 40,
    });
  };

  const useHealthPotion = () => {
    if (gameState.inventory.potion <= 0) return;
    
    playerRef.current.health = Math.min(
      playerRef.current.maxHealth,
      playerRef.current.health + 30
    );

    // Trigger Floating Recovery UI
    addFloatingText(
      playerRef.current.x + playerRef.current.width / 2,
      playerRef.current.y - 10,
      "+30 HP",
      "#10b981"
    );

    // Take from inventory
    setGameState((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        potion: prev.inventory.potion - 1,
      },
    }));

    spawnSparks(
      playerRef.current.x + playerRef.current.width / 2,
      playerRef.current.y + playerRef.current.height / 2,
      "#10b981",
      12
    );
  };

  // Prime core GameLoop on Mount
  useEffect(() => {
    let animationFrameId: number;
    let lavaDamageCooldown = 0;

    const gameLoop = () => {
      updateGameState();
      renderGameCanvas();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    // Game update sequences
    const updateGameState = () => {
      const gameState = gameStateRef.current;
      if (gameState.gameState !== "playing") return;
      if (gameState.showShop || gameState.showCharacterSelector) return;

      const p = playerRef.current;
      const grid = mapGridRef.current;
      if (!grid) return;

      // Mana regeneration tick
      if (p.maxMana > 0) {
        let regenRate = 0.03; // Base per frame (approx 1.8 MP/sec)
        if (p.classType === "mage") {
          regenRate = 0.08; // Mage has extremely quick mana recovery (approx 4.8 MP/sec)
        } else if (p.classType === "rogue") {
          regenRate = 0.055; // Rogue has medium speed (approx 3.3 MP/sec)
        }
        // Apply Mana +5% upgrade multiplier if owned
        const multiplier = 1 + (p.manaPercentBonus / 100);
        p.mana = Math.min(p.maxMana * multiplier, p.mana + regenRate * multiplier);
      }

      // 1. Process player diagonal normalization and movement velocities
      let moveX = 0;
      let moveY = 0;

      if (keysRef.current["w"] || keysRef.current["arrowup"]) moveY = -1;
      if (keysRef.current["s"] || keysRef.current["arrowdown"]) moveY = 1;
      if (keysRef.current["a"] || keysRef.current["arrowleft"]) moveX = -1;
      if (keysRef.current["d"] || keysRef.current["arrowright"]) moveX = 1;

      p.isMoving = moveX !== 0 || moveY !== 0;

      if (p.isMoving) {
        // Multiplier to keep uniform velocity across diagonals (1 / sqrt(2) approx 0.707)
        let speedMultiplier = 1;
        if (moveX !== 0 && moveY !== 0) {
          speedMultiplier = 0.7071;
        }

        const dx = moveX * p.speed * speedMultiplier;
        const dy = moveY * p.speed * speedMultiplier;

        // Face directions
        if (moveX < 0) p.direction = "left";
        else if (moveX > 0) p.direction = "right";
        else if (moveY < 0) p.direction = "up";
        else if (moveY > 0) p.direction = "down";

        // Incremental motion step with robust wall/stone sliding properties
        // Check X direction individually
        const collX = checkCollision(p.x + dx, p.y, p.width, p.height, grid);
        if (!collX.collide) {
          p.x += dx;
        }

        // Check Y direction individually
        const collY = checkCollision(p.x, p.y + dy, p.width, p.height, grid);
        if (!collY.collide) {
          p.y += dy;
        }

        // Environmental Hazard (Lava) Check
        const currentLava = checkCollision(p.x, p.y, p.width, p.height, grid);
        if (currentLava.hazard) {
          lavaDamageCooldown--;
          if (lavaDamageCooldown <= 0) {
            p.health = Math.max(0, p.health - 5);
            sound.playHit();
            addFloatingText(p.x + p.width/2, p.y - 12, "-5 HP (LAVA)", "#ef4444");
            spawnSparks(p.x + p.width/2, p.y + p.height/2, "#fc5e49", 5);
            lavaDamageCooldown = 50; // Delay damage ticks

            if (p.health <= 0) {
              triggerGameOver("Terperosok ke dalam magma membara!");
            }
          }
        }

        // Run feet walking animations
        p.animTimer++;
        if (p.animTimer > 10) {
          p.animFrame = p.animFrame === 1 ? 2 : 1;
          p.animTimer = 0;
        }
      } else {
        p.animFrame = 0; // Resting idle
      }

      // 2. Camera Centering and Smooth Lerp calculations
      const worldWidth = grid[0].length * TILE_SIZE;
      const worldHeight = grid.length * TILE_SIZE;

      // Target camera to center player
      const targetCamX = p.x + p.width / 2 - VIEW_WIDTH / 2;
      const targetCamY = p.y + p.height / 2 - VIEW_HEIGHT / 2;

      // Clamp camera bounds to prevent panning outside boundaries
      cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.1; // Smooth follow lerp
      cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.1;

      cameraRef.current.x = Math.max(0, Math.min(worldWidth - VIEW_WIDTH, cameraRef.current.x));
      cameraRef.current.y = Math.max(0, Math.min(worldHeight - VIEW_HEIGHT, cameraRef.current.y));

      // 3. Entity Proximity Checks (NPC Dialogue trigger bubbles)
      let foundProximity: NPC | null = null;
      gameState.activeNpcs.forEach((npc) => {
        const dx = (p.x + p.width / 2) - (npc.x + npc.width / 2);
        const dy = (p.y + p.height / 2) - (npc.y + npc.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 64) {
          foundProximity = npc;
        }
      });
      setProximityNpc(foundProximity);

      // 4. Overlapping Item collections
      gameState.activeItems.forEach((item) => {
        if (item.collected) return;

        const ix = item.x + item.width / 2;
        const iy = item.y + item.height / 2;
        const px = p.x + p.width / 2;
        const py = p.y + p.height / 2;

        const distance = Math.sqrt((px - ix) ** 2 + (py - iy) ** 2);
        if (distance < 28) {
          // Collect item!
          item.collected = true;
          sound.playPickup();

          // Spark pick particles
          spawnSparks(item.x + item.width / 2, item.y + item.height / 2, item.glowColor, 12);

          // Update state inventory bags
          setGameState((prev) => {
            const nextInv = { ...prev.inventory };

            if (item.type === "potion") {
              nextInv.potion += 1;
              addFloatingText(item.x, item.y - 12, "+1 Potion ✨", "#10b981");
            } else if (item.type === "crystal") {
              nextInv.crystal += 1;
              addFloatingText(item.x, item.y - 12, "Ambil Kristal Aether! 💎", "#2ee1ff");
              
              // Increment Quest Target count
              const nextQuests = prev.quests.map((q) =>
                q.id === "q1" ? { ...q, currentCount: Math.min(q.targetCount, q.currentCount + 1) } : q
              );
              return { ...prev, inventory: nextInv, quests: nextQuests };
            } else if (item.type === "key") {
              nextInv.key += 1;
              addFloatingText(item.x, item.y - 12, "Ambil Kunci Labyrinth! 🔑", "#ecc326");
              
              // Increment Quest Target count
              const nextQuests = prev.quests.map((q) =>
                q.id === "q2" ? { ...q, currentCount: Math.min(q.targetCount, q.currentCount + 1) } : q
              );
              return { ...prev, inventory: nextInv, quests: nextQuests };
            } else if (item.type === "legendary_weapon") {
              nextInv.hasLegendaryWeapon = true;
              addFloatingText(item.x, item.y - 12, "Aether Blade Diperoleh! ⚔️", "#22d3ee");
              
              // Increment Quest Target count and complete quest
              const nextQuests = prev.quests.map((q) =>
                q.id === "q2b" ? { ...q, currentCount: 1, status: "Completed" as const } : q
              );
              setTimeout(() => { sound.playQuestComplete(); }, 400);
              return { ...prev, inventory: nextInv, quests: nextQuests };
            } else if (item.type === "gold_pile") {
              const goldVal = (item as any).goldValue || 20;
              nextInv.gold = (nextInv.gold || 0) + goldVal;
              addFloatingText(item.x, item.y - 12, `+${goldVal} Gold 💰`, "#ecc326");
              return { ...prev, inventory: nextInv };
            }

            return { ...prev, inventory: nextInv };
          });
        }
      });

      // 5. Projectiles movement & collision testing
      const activeProjectiles = [...gameState.activeProjectiles];
      const nextProjectiles: Projectile[] = [];

      activeProjectiles.forEach((proj) => {
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.life--;

        // Check map wall collision
        const tempCol = checkCollision(proj.x - proj.radius, proj.y - proj.radius, proj.radius*2, proj.radius*2, grid);
        
        let collided = tempCol.collide || proj.life <= 0;

        if (!collided) {
          if (proj.fromBoss) {
            // Collision with Player
            const dx = proj.x - (p.x + p.width / 2);
            const dy = proj.y - (p.y + p.height / 2);
            if (Math.sqrt(dx * dx + dy * dy) < p.width / 2 + proj.radius) {
              collided = true;
              p.health = Math.max(0, p.health - proj.damage);
              sound.playHit();
              addFloatingText(p.x + p.width/2, p.y - 6, `-${proj.damage} HP`, "#f43f5e");
              spawnSparks(proj.x, proj.y, "#ef4444", 8);

              if (p.health <= 0) {
                triggerGameOver("Dikalahkan oleh amukan serangan Raja Iblis!");
              }
            }
          } else {
            // Player bullet hitting Boss
            const boss = bossRef.current;
            if (boss && boss.state !== "dead") {
              const dx = proj.x - (boss.x + boss.width / 2);
              const dy = proj.y - (boss.y + boss.height / 2);
              if (Math.sqrt(dx * dx + dy * dy) < boss.width / 2.2 + proj.radius) {
                collided = true;
                boss.health = Math.max(0, boss.health - proj.damage);
                if (Math.random() < 0.40) {
                  const goldDropVal = Math.floor(Math.random() * 8) + 8;
                  const newGold: Item = {
                    id: `gold_boss_${Date.now()}_${Math.random()}`,
                    type: "gold_pile" as any,
                    name: "Koin Emas",
                    x: boss.x + boss.width / 2 + (Math.random() * 48 - 24),
                    y: boss.y + boss.height / 2 + (Math.random() * 48 - 24),
                    width: 20,
                    height: 20,
                    collected: false,
                    glowColor: "rgba(253, 224, 71, 0.7)",
                    pulseTimer: Math.random() * 3,
                    goldValue: goldDropVal
                  } as any;
                  setGameState((prev) => ({
                    ...prev,
                    activeItems: [...prev.activeItems, newGold]
                  }));
                }
                setBossHealth(boss.health);
                sound.playExplosion();
                addFloatingText(boss.x + boss.width / 2, boss.y - 10, `-${proj.damage}`, "#eab308");
                spawnSparks(proj.x, proj.y, "#ecc326", 14);

                // Flash visual response
                boss.animFrame = 99; // Hurt Frame trigger
                boss.animTimer = 12; // Hurt framing duration

                if (boss.health <= 0) {
                  boss.state = "dead";
                  triggerVictory();
                }
              }
            }
          }
        }

        if (!collided) {
          nextProjectiles.push(proj);
        }
      });

      if (JSON.stringify(gameState.activeProjectiles) !== JSON.stringify(nextProjectiles)) {
        setGameState((prev) => ({ ...prev, activeProjectiles: nextProjectiles }));
      }

      // 6. BOSS AI (Episode 3 actions)
      const boss = bossRef.current;
      if (boss && boss.state !== "dead") {
        boss.actionTimer++;

        // Boss hurt frame flash timer resetting back
        if (boss.animFrame === 99) {
          boss.animTimer--;
          if (boss.animTimer <= 0) {
            boss.animFrame = 0;
          }
        } else {
          // Standard breathing framings
          boss.animTimer++;
          if (boss.animTimer > 25) {
            boss.animFrame = boss.animFrame === 0 ? 1 : 0;
            boss.animTimer = 0;
          }
        }

        // Float or chase players periodically
        const dx = (p.x + p.width / 2) - (boss.x + boss.width / 2);
        const dy = (p.y + p.height / 2) - (boss.y + boss.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);

        const isRaging = boss.health < boss.maxHealth / 2;

        // Move slightly towards player
        if (dist > 100) {
          const chaseSpeed = isRaging ? 1.95 : 1.25;
          boss.x += (dx / dist) * chaseSpeed;
          boss.y += (dy / dist) * chaseSpeed;
          boss.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
        }

        // Show floating rage mode alerts
        if (isRaging && boss.phase === 1) {
          boss.phase = 2; // Move to rage phase
          addFloatingText(boss.x + boss.width / 2, boss.y - 30, "😈 RAGE MODE AKTIF! 🔥", "#ef4444");
          addFloatingText(p.x, p.y - 12, "Raja Iblis Mengamuk!", "#f43f5e");
        }

        // Projectile attack timer logic
        const baseRate = isRaging ? 45 : 80;
        const triggerRate = p.health < 40 ? Math.floor(baseRate * 0.65) : baseRate;

        if (boss.actionTimer > triggerRate) {
          boss.actionTimer = 0;
          sound.playBossRoar();
          
          const newProjectiles: Projectile[] = [];
          const baseAngle = Math.atan2(dy, dx);
          
          // 30% chance for radial ring attack when raging
          const isRadialBlast = isRaging && Math.random() < 0.35;

          if (isRadialBlast) {
            addFloatingText(boss.x + boss.width / 2, boss.y - 20, "Bintang Lahar! 💥", "#ec4899");
            const ringCount = 8;
            const bulletSpeed = 4.0;
            for (let i = 0; i < ringCount; i++) {
              const angle = (i * Math.PI * 2) / ringCount;
              newProjectiles.push({
                x: boss.x + boss.width / 2,
                y: boss.y + boss.height / 2,
                vx: Math.cos(angle) * bulletSpeed,
                vy: Math.sin(angle) * bulletSpeed,
                radius: 8,
                damage: 15,
                color: "#ff007f", // Neon pink fireball
                fromBoss: true,
                life: 140,
              });
            }
          } else {
            // Standard Fan attack
            const fireballCount = isRaging ? 6 : 3;
            const spreadAngle = isRaging ? 0.22 : 0.28;
            const speed = isRaging ? 5.2 : 4.0;
            const damageVal = isRaging ? 18 : 14;

            for (let i = 0; i < fireballCount; i++) {
              const spreadIndex = i - (fireballCount - 1) / 2;
              const angle = baseAngle + spreadIndex * spreadAngle;
              
              newProjectiles.push({
                x: boss.x + boss.width / 2,
                y: boss.y + boss.height / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: isRaging ? 9 : 8,
                damage: damageVal,
                color: isRaging ? "#ef4444" : "#ff5500", // Crimson intense red firebal
                fromBoss: true,
                life: 140,
              });
            }
          }

          if (newProjectiles.length > 0) {
            setGameState((prev) => ({
              ...prev,
              activeProjectiles: [...prev.activeProjectiles, ...newProjectiles],
            }));
          }

          spawnSparks(boss.x + boss.width/2, boss.y + boss.height/2, isRaging ? "#ef4444" : "#ff5500", 12);
        }
      }

      // 7. Check Map Portal Trigger Overlaps
      const roundedPX = Math.floor((p.x + p.width/2) / TILE_SIZE);
      const roundedPY = Math.floor((p.y + p.height/2) / TILE_SIZE);
      if (
        roundedPX >= 0 && 
        roundedPX < grid[0].length && 
        roundedPY >= 0 && 
        roundedPY < grid.length
      ) {
        if (grid[roundedPY][roundedPX] === "portal") {
          // If in Episode 1, move to Episode 2 IF quest q1 is Completed
          if (gameState.currentEpisode === 1) {
            const isQ1Completed = gameState.quests.some(q => q.id === "q1" && q.status === "Completed");
            if (!isQ1Completed) {
              sound.playTalk(1);
              setGameState((prev) => ({
                ...prev,
                dialogue: {
                  speaker: "Portal Kuno Terkunci",
                  text: "Portal Dimensi masih terkunci oleh segel sihir kuno! Kembalilah ke bagian tenggara lembah untuk mencari 'Kristal Aether', lalu serahkan kepada Kakek Elrick untuk membuka segel dimensi ini."
                }
              }));
              // Bounce player slightly left to get them off the portal tile
              p.x = (roundedPX - 1.2) * TILE_SIZE;
              p.vx = 0;
              p.vy = 0;
              p.isMoving = false;
            } else {
              loadEpisode(2);
            }
          } else if (gameState.currentEpisode === 2) {
            // If in Episode 2, move to Episode 3 IF both key and weapon quests are Completed
            const isQ2Completed = gameState.quests.some(q => q.id === "q2" && q.status === "Completed");
            const isQ2bCompleted = gameState.quests.some(q => q.id === "q2b" && q.status === "Completed");
            
            if (!isQ2Completed || !isQ2bCompleted) {
              sound.playTalk(1);
              let dialogueText = "";
              if (!isQ2Completed && !isQ2bCompleted) {
                dialogueText = "Sarang Raja Iblis disegel! Kamu membutuhkan Kunci Emas di altar utara dungeon dan senjata suci 'Aether Blade' di altar timur untuk melenyapkan segel gerbang dimensi ini.";
              } else if (!isQ2Completed) {
                dialogueText = "Kamu sudah memegang Aether Blade! Namun gerbang portal raksasa ini masih terkunci rapat. Temukan Kunci Emas di altar utara dungeon.";
              } else {
                dialogueText = "Gerbang dimensional ini berguncang, namun perlindungan kegelapan Raja Iblis menolaknya! Carilah senjata legendaris 'Aether Blade' di altar timur terlebih dahulu.";
              }

              setGameState((prev) => ({
                ...prev,
                dialogue: {
                  speaker: "Pintu Gerbang Dimensi",
                  text: dialogueText
                }
              }));
              // Bounce player slightly south (down) to get them off the portal/door tile
              p.y = (roundedPY + 1.2) * TILE_SIZE;
              p.vx = 0;
              p.vy = 0;
              p.isMoving = false;
            } else {
              loadEpisode(3);
            }
          }
        }
      }

      // 8. Update transient visual structures (particles, texts)
      floatingTextsRef.current.forEach((text) => text.life--);
      floatingTextsRef.current = floatingTextsRef.current.filter((t) => t.life > 0);

      particlesRef.current.forEach((part) => {
        part.x += part.vx;
        part.y += part.vy;
        part.life++;
      });
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);
    };

    // Render operations on Canvas
    const renderGameCanvas = () => {
      const gameState = gameStateRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const grid = mapGridRef.current;
      if (!grid) return;

      const camX = cameraRef.current.x;
      const camY = cameraRef.current.y;

      // Clear Screen
      ctx.fillStyle = "#09080b";
      ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

      // Save for camera scrolling shifts
      ctx.save();
      ctx.translate(-Math.floor(camX), -Math.floor(camY));

      // Draw standard Tile floors in camera ranges
      const startCol = Math.max(0, Math.floor(camX / TILE_SIZE));
      const endCol = Math.min(grid[0].length - 1, Math.floor((camX + VIEW_WIDTH) / TILE_SIZE));
      const startRow = Math.max(0, Math.floor(camY / TILE_SIZE));
      const endRow = Math.min(grid.length - 1, Math.floor((camY + VIEW_HEIGHT) / TILE_SIZE));

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const tile = grid[r][c];
          drawFloorTile(ctx, tile, c * TILE_SIZE, r * TILE_SIZE, c, r);
        }
      }

      // Draw all items carrying
      gameState.activeItems.forEach((item) => {
        if (item.collected) return;
        
        // Custom animated hovering wave pulse
        item.pulseTimer += 0.08;
        const hoverOffset = Math.sin(item.pulseTimer) * 4;

        // Draw small shadow below hovering crystal
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.beginPath();
        ctx.ellipse(
          item.x + item.width / 2,
          item.y + item.height - 2,
          item.width * 0.4,
          2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Draw actual item sprite
        drawPixelSprite(ctx, item.type, item.x, item.y + hoverOffset, item.width, item.height, {
          glow: true,
          glowColor: item.glowColor,
        });
      });

      // Draw active NPCs
      gameState.activeNpcs.forEach((npc) => {
        const spriteName = `${npc.spriteType}_down`;
        drawPixelSprite(ctx, spriteName, npc.x, npc.y, npc.width, npc.height, {
          shadow: true,
          paletteOverride: npc.paletteOverride,
        });

        // Floating Speak Suggestion Box
        if (proximityNpc?.id === npc.id) {
          const helperFloatOffset = Math.sin(Date.now() / 200) * 3 - 10;
          ctx.save();
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.strokeStyle = "#ecc326";
          ctx.lineWidth = 1;
          
          const textMsg = "Bicara [E]";
          ctx.font = "bold 10px monospace";
          const measure = ctx.measureText(textMsg).width;

          // Box surrounding
          ctx.beginPath();
          ctx.roundRect(
            npc.x + npc.width / 2 - measure / 2 - 6,
            npc.y + helperFloatOffset - 16,
            measure + 12,
            16,
            4
          );
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#fff";
          ctx.fillText(
            textMsg,
            npc.x + npc.width / 2 - measure / 2,
            npc.y + helperFloatOffset - 5
          );
          ctx.restore();
        }
      });

      // Draw Boss (Episode 3 only)
      const boss = bossRef.current;
      if (boss) {
        if (boss.state === "dead") {
          // Draw smoke particles of boss burning down
          ctx.fillStyle = "#ff5500";
          ctx.font = "bold 12px monospace";
          ctx.fillText("LENYAP", boss.x + indexAngleOffset * 3, boss.y);
        } else {
          // Flash white on hit
          const bossSpriteKey = boss.animFrame === 99 ? "boss_hurt" : `boss_idle_${boss.animFrame === 1 ? '2' : '1'}`;
          drawPixelSprite(ctx, bossSpriteKey, boss.x, boss.y, boss.width, boss.height, {
            shadow: true,
            glow: true,
            glowColor: "rgba(239, 68, 68, 0.4)",
          });

          // Floating mini Boss Health Bar above him
          const bossBarW = boss.width * 0.9;
          const bHpPercent = boss.health / boss.maxHealth;
          ctx.fillStyle = "rgba(0,0,0,0.6)";
          ctx.fillRect(boss.x + (boss.width - bossBarW)/2, boss.y - 12, bossBarW, 6);
          ctx.fillStyle = "#fbbf24";
          ctx.fillRect(boss.x + (boss.width - bossBarW)/2 + 1, boss.y - 11, (bossBarW - 2) * bHpPercent, 4);

          // Name tag
          ctx.fillStyle = "#ff6b6b";
          ctx.font = "bold 9px sans-serif";
          ctx.fillText("DEMON LORD", boss.x + 12, boss.y - 16);
        }
      }

      // Draw Player Hero Character
      const p = playerRef.current;
      let walkIdx = "";
      if (p.isMoving) {
        walkIdx = `_walk_${p.animFrame}`;
      } else {
        walkIdx = "_idle";
      }

      // Compose proper sprite frame
      // Draw left directions as flipped right frame representation
      const flipX = p.direction === "left";
      const actualDirection = p.direction === "left" ? "left" : p.direction;
      const pSpriteKey = `player_${actualDirection === "left" ? "left" : actualDirection}${walkIdx}`;
      
      drawPixelSprite(ctx, pSpriteKey, p.x, p.y, p.width, p.height, {
        shadow: true,
        flipX,
        paletteOverride: getPaletteForClass(p.classType),
      });

      // Draw spell sparkles/particles
      particlesRef.current.forEach((part) => {
        ctx.fillStyle = part.color;
        ctx.beginPath();
        const pSize = part.size * (1 - part.life / part.maxLife);
        ctx.arc(part.x, part.y, Math.max(1, pSize), 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw active traveling projectiles
      gameState.activeProjectiles.forEach((proj) => {
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = proj.color;
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw damage floating animations over entities
      floatingTextsRef.current.forEach((text) => {
        ctx.save();
        ctx.fillStyle = text.color;
        ctx.font = "bold 12px monospace";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 4;
        
        // Animate drifting skyward
        const verticalShift = (40 - text.life) * 0.7;
        ctx.fillText(text.text, text.x, text.y - verticalShift);
        ctx.restore();
      });

      ctx.restore(); // Restore camera shift transformations
    };

    let indexAngleOffset = 0;

    // Trigger Game loop frames
    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const triggerGameOver = (cause: string) => {
    sound.playHit();
    setGameState((prev) => ({
      ...prev,
      gameState: "gameover",
      transitionMessage: cause,
    }));
  };

  const triggerVictory = () => {
    sound.playQuestComplete();
    
    // Complete boss quest
    setGameState(prev => {
      const updated = prev.quests.map(q => q.id === "q3" ? { ...q, status: "Completed" as const, currentCount: 1 } : q);
      return {
        ...prev,
        quests: updated,
        gameState: "victory",
        transitionMessage: "Kegelapan telah lenyap! Dunia kembali damai."
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#0d0a0f] text-gray-200 flex flex-col justify-between" id="rpg-arcade-parent">
      
      {/* Main Game Screen Board viewport center */}
      <main className="flex-grow flex items-center justify-center p-3" id="arcade-viewport-container">
        
        {/* Beautiful retro game station container */}
        <div 
          ref={containerRef}
          className="relative border-4 border-[#3b3542] rounded-2xl bg-black p-1 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden w-full max-w-[808px]"
        >
          <div 
            style={{ 
              width: `${VIEW_WIDTH * scale}px`, 
              height: `${VIEW_HEIGHT * scale}px`,
              overflow: "hidden" 
            }}
            className="relative"
          >
            <div 
              className="relative bg-[#0d0912] overflow-hidden rounded-xl border border-black origin-top-left"
              style={{ 
                width: `${VIEW_WIDTH}px`, 
                height: `${VIEW_HEIGHT}px`,
                transform: `scale(${scale})`,
              }}
              id="game-viewport-card"
            >
            {/* 1. Canvas element for Game Rendering */}
            <canvas
              ref={canvasRef}
              width={VIEW_WIDTH}
              height={VIEW_HEIGHT}
              className="absolute inset-0 block w-full h-full rendering-pixelated"
              style={{ imageRendering: "pixelated" }}
              id="game-canvas"
            />

            {/* 2. MENU SCREEN overlay */}
            {gameState.gameState === "menu" && (
              <div 
                className="absolute inset-0 bg-black/90 flex flex-col justify-center items-center text-center p-6"
                id="menu-overlay-screen"
              >
                <div className="animate-pulse mb-2 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
                  ✨ Google AI Studio Build present ✨
                </div>
                
                <h2 className="text-4xl font-extrabold text-[#ecc326] tracking-wider mb-2 font-mono drop-shadow-[0_4px_8px_rgba(236,195,38,0.3)]">
                  RIMBA AETHER
                </h2>
                
                <p className="text-xs text-gray-400 max-w-md leading-relaxed mb-8">
                  Sebuah petualangan pendek Pixel RPG 2D. Kumpulkan Kristal Aether suci, seberangi Labyrinth kuno penuh magma, dan lumpuhkan kekuatan jahat sang Raja Iblis.
                </p>

                {/* Character previews */}
                <div className="flex gap-12 mb-8 select-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-4xl hover:scale-110 transition duration-200">🧙‍♂️</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Elrick</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-4xl animate-bounce hover:scale-110 transition duration-200">👑</span>
                    <span className="text-[10px] text-yellow-400 font-mono">Pahlawan</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-4xl hover:scale-110 transition duration-200">👹</span>
                    <span className="text-[10px] text-red-500 font-mono">Raja Iblis</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playTeleport();
                    loadEpisode(1);
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-sm uppercase tracking-widest rounded-lg transition active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2"
                  id="menu-play-btn"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Mulai Petualangan</span>
                </button>
                
                <div className="text-[9px] text-gray-400 font-mono mt-6 uppercase tracking-wider">
                  Gunakan Keyboard [WASD] untuk Jalan & [E] untuk Interaksi
                </div>
              </div>
            )}

            {/* 3. GAMEOVER SCREEN overlay */}
            {gameState.gameState === "gameover" && (
              <div 
                className="absolute inset-0 bg-red-950/95 flex flex-col justify-center items-center text-center p-6 z-20"
                id="gameover-overlay-screen"
              >
                <div className="w-16 h-16 bg-red-900 border-2 border-red-500 rounded-full flex items-center justify-center text-3xl mb-4 animate-bounce">
                  💀
                </div>
                
                <h2 className="text-3xl font-extrabold text-red-400 tracking-wide font-mono mb-2">
                  ANDA DIKALAHKAN!
                </h2>
                
                <p className="text-sm font-mono text-gray-300 max-w-sm mb-8 bg-black/40 p-2.5 px-4 rounded border border-red-900">
                  {gameState.transitionMessage || "Health Point Anda mencapai 0."}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => loadEpisode(gameState.currentEpisode)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-md transition active:scale-95 flex items-center gap-2 shadow-lg"
                    id="gameover-retry-btn"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Ulangi Episode {gameState.currentEpisode}</span>
                  </button>
                  
                  <button
                    onClick={resetGameTotal}
                    className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs uppercase tracking-widest rounded-md transition active:scale-95 border border-gray-700"
                    id="gameover-mainmenu-btn"
                  >
                    Mulai Ulang Game
                  </button>
                </div>
              </div>
            )}

            {/* 4. VICTORY SCREEN overlay */}
            {gameState.gameState === "victory" && (
              <div 
                className="absolute inset-0 bg-indigo-950/95 flex flex-col justify-center items-center text-center p-6 z-20"
                id="victory-overlay-screen"
              >
                <div className="w-20 h-20 bg-yellow-500/20 border-2 border-[#ecc326] rounded-full flex items-center justify-center text-4xl mb-4 animate-spin-slow">
                  🌟
                </div>
                
                <h2 className="text-3xl font-bold text-[#ecc326] tracking-wide font-mono mb-2 animate-pulse">
                  KEMENANGAN MUTLAK!
                </h2>
                
                <p className="text-xs text-gray-300 max-w-md leading-relaxed mb-6">
                  Raja Iblis berhasil ditumbangkan dengan pukulan beruntun Bola Sihir Aether-mu! Kegelapan telah hilang dari lembah dan perdamaian abadi akhirnya kembali.
                </p>

                <div className="bg-black/40 p-4 rounded-lg border border-indigo-900 max-w-sm text-left mb-8 text-xs leading-relaxed font-mono text-gray-300">
                  <div className="text-[#ecc326] font-bold border-b border-indigo-950 pb-1 mb-2">⭐ PENGHARGAAN PAHLAWAN</div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <span>Episode Terselesaikan:</span> <span className="text-right text-white">1, 2, dan 3 ⚔️</span>
                    <span>Status Kesehatan (HP):</span> <span className="text-right text-emerald-400">{playerRef.current.health} / {playerRef.current.maxHealth}</span>
                    <span>Sisa Potion Kantong:</span> <span className="text-right text-cyan-400">{gameState.inventory.potion} Botol 🧪</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={resetGameTotal}
                    className="px-6 py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-widest rounded-lg transition active:scale-95 flex items-center gap-2 shadow-2xl"
                    id="victory-playagain-btn"
                  >
                    <Sparkles className="w-4 h-4 fill-current text-black" />
                    <span>Mainkan Lagi</span>
                  </button>
                </div>
              </div>
            )}

            {/* 5. ACTIVE GAMEPLAY HUD overlay */}
            {gameState.gameState !== "menu" && (
              <HUD
                episode={gameState.currentEpisode}
                health={playerRef.current.health}
                maxHealth={playerRef.current.maxHealth}
                mana={Math.floor(playerRef.current.mana)}
                maxMana={playerRef.current.maxMana}
                classType={playerRef.current.classType}
                selectedSkill={gameState.selectedSkill as any}
                quests={gameState.quests}
                inventory={gameState.inventory}
                onOpenInventory={() => {
                  sound.playPickup();
                  setGameState((prev) => ({ ...prev, gameState: "inventory" }));
                }}
                onOpenShop={() => {
                  sound.playTeleport();
                  setGameState((prev) => ({ ...prev, showShop: true }));
                }}
                onOpenCharacterSelection={() => {
                  sound.playPickup();
                  setGameState((prev) => ({ ...prev, showCharacterSelector: true }));
                }}
                isMuted={isMuted}
                onToggleSound={toggleSoundMute}
                onSelectSkill={(skill) => {
                  sound.playPickup();
                  setGameState((prev) => ({ ...prev, selectedSkill: skill }));
                }}
                onUsePotion={useHealthPotion}
              />
            )}

            {/* 6. NPC DIALOGUE BOX rendering */}
            {gameState.dialogue && (
              <DialogueBox
                dialogue={gameState.dialogue}
                onClose={() => setGameState({ ...gameState, dialogue: null })}
                onSelectOption={handleSelectDialogueOption}
              />
            )}

            {/* 7. INVENTORY BOX rendering */}
            {gameState.gameState === "inventory" && (
              <InventoryMenu
                inventory={gameState.inventory}
                playerHealth={playerRef.current.health}
                playerMaxHealth={playerRef.current.maxHealth}
                playerMana={Math.floor(playerRef.current.mana)}
                playerMaxMana={playerRef.current.maxMana}
                selectedSkill={gameState.selectedSkill || "magic_missile"}
                onUsePotion={useHealthPotion}
                onSelectSkill={(skill) => {
                  sound.playPickup();
                  setGameState((prev) => ({ ...prev, selectedSkill: skill }));
                }}
                onUseSkillBook={useSkillBook}
                onClose={() => setGameState({ ...gameState, gameState: "playing" })}
              />
            )}

            {/* 7a. GAME SHOP overlay rendering */}
            {gameState.showShop && (
              <GameShop
                inventory={gameState.inventory}
                gold={gameState.inventory.gold || 0}
                unlockedSkills={gameState.inventory.unlockedSkills}
                maxMana={playerRef.current.maxMana}
                onBuyItem={buyShopItem}
                onClose={() => {
                  sound.playPickup();
                  setGameState((prev) => ({ ...prev, showShop: false }));
                }}
              />
            )}

            {/* 7b. CHARACTER SELECTION overlay rendering */}
            {gameState.showCharacterSelector && (
              <CharacterSelection
                currentClass={playerRef.current.classType}
                onSelectClass={changeHeroClass}
                onClose={() => {
                  sound.playPickup();
                  setGameState((prev) => ({ ...prev, showCharacterSelector: false }));
                }}
              />
            )}

            {/* 8. SCREEN FADING TRANSITION FX */}
            <div
              className="absolute inset-0 bg-black/95 flex flex-col justify-center items-center text-center pointer-events-none z-40 transition-opacity duration-500"
              style={{ opacity: gameState.transitionAlpha }}
              id="fader-panel"
            >
              {gameState.transitionAlpha > 0 && (
                <>
                  <div className="animate-spin-slow w-12 h-12 border-t-2 border-cyan-400 rounded-full mb-3" />
                  <h3 className="text-[#ecc326] font-mono tracking-widest font-bold uppercase text-sm">
                    {gameState.transitionMessage}
                  </h3>
                </>
              )}
            </div>

          </div>

        </div>

      </div>

      </main>

      {/* Tutorial How-To Instructions Popup modal */}
      {showControlsModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 font-sans backdrop-blur-sm pointer-events-auto" id="tutorial-modal-bg">
          <div className="w-full max-w-md bg-[#131016] border-2 border-[#3b3542] rounded-xl overflow-hidden shadow-2xl p-6" id="tutorial-modal-card">
            
            <div className="flex justify-between items-start border-b border-gray-800 pb-3 mb-4">
              <h3 className="text-[#ecc326] font-bold text-base tracking-wide flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                <span>PANDUAN PETUALANGAN</span>
              </h3>
              <button
                onClick={() => setShowControlsModal(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-gray-300">
              <div className="flex items-start gap-3 bg-black/30 p-2.5 rounded border border-gray-800">
                <span className="text-xl">🏃‍♂️</span>
                <div>
                  <h4 className="text-white font-bold mb-0.5">Berjalan & Gerakan Lembut</h4>
                  <p>Gunakan tombol keyboard <b className="text-cyan-400">[W, A, S, D]</b> untuk melangkah ke seluruh penjuru dunia. Gerakan dirancang halus dengan deteksi tabrakan presisi lurus menyamping.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-black/30 p-2.5 rounded border border-gray-800">
                <span className="text-xl">💬</span>
                <div>
                  <h4 className="text-white font-bold mb-0.5">Percakapan NPC</h4>
                  <p>Mendekatlah ke orang berkerudung jubah lalu tekan tombol <b className="text-[#ecc326]">[E]</b> untuk membuka percakapan. Selesaikan dialog dengan mengklik atau menekan kembali tomblo <b className="text-[#ecc326]">[E]</b>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-black/30 p-2.5 rounded border border-gray-800">
                <span className="text-xl">🎒</span>
                <div>
                  <h4 className="text-white font-bold mb-0.5">Inventory & Kebutuhan Ramuan</h4>
                  <p>Tekan tombol <b className="text-cyan-400">[I]</b> di keyboard kapan saja untuk membuka kantongmu. Anda dapat menenggak ramuan Potion merah untuk menyembuhkan luka (+30 HP).</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-black/30 p-2.5 rounded border border-gray-800">
                <span className="text-xl">💥</span>
                <div>
                  <h4 className="text-white font-bold mb-0.5">Serangan Aether Magic (Eps 3)</h4>
                  <p>Ketika tiba di singgasana Iblis jahat, gunakan tombol <b className="text-red-400 font-bold">[SPACE_BAR]</b> untuk menghujani Iblis dengan bola sihir pemusnah yang didongkrak daya kristalmu.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowControlsModal(false)}
              className="w-full mt-5 py-2.5 bg-[#ecc326] text-black hover:bg-yellow-400 font-bold rounded text-xs uppercase tracking-widest transition duration-150 active:scale-95"
            >
              Saya Mengerti, Ayo Main!
            </button>
          </div>
        </div>
      )}

      {/* Footer copyright section */}
      <footer className="bg-[#09070c] py-2 px-6 border-t border-[#1a1421] text-[10px] text-gray-500 font-mono flex justify-between items-center" id="arcade-credits">
        <span>© 2026 Rimba Aether • Google AI Studio Build</span>
        <span className="text-gray-400">Dimainkan menggunakan keyboard • Tanpa Database</span>
      </footer>

    </div>
  );
}
