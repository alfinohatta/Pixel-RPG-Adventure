/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Quest, Inventory, CharacterClass } from "../types";
import { sound } from "../engine/sound";
import { drawPixelSprite } from "../engine/sprites";
import { getPaletteForClass, CLASS_DEFINITIONS } from "../engine/rpgSystem";
import { 
  Volume2, 
  VolumeX, 
  Backpack, 
  Compass, 
  Heart, 
  ShoppingBag, 
  Users 
} from "lucide-react";

interface HUDProps {
  episode: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  classType: CharacterClass;
  selectedSkill: "magic_missile" | "fireball" | "holy_heal" | "mana_shield" | "sucker_punch";
  quests: Quest[];
  inventory: Inventory;
  onOpenInventory: () => void;
  onOpenShop: () => void;
  onOpenCharacterSelection: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onSelectSkill?: (skill: "magic_missile" | "fireball" | "holy_heal" | "mana_shield" | "sucker_punch") => void;
  onUsePotion?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  episode,
  health,
  maxHealth,
  mana,
  maxMana,
  classType,
  selectedSkill,
  quests,
  inventory,
  onOpenInventory,
  onOpenShop,
  onOpenCharacterSelection,
  isMuted,
  onToggleSound,
  onSelectSkill,
  onUsePotion,
}) => {
  const activeQuest = quests.find((q) => q.status === "Active");
  const healthPercent = Math.max(0, Math.min(100, (health / maxHealth) * 100));
  const manaPercent = maxMana > 0 ? Math.max(0, Math.min(100, (mana / maxMana) * 100)) : 0;

  // Persistent Player Name customization
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem("aether_player_name") || "Pahlawan";
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  const [alertModal, setAlertModal] = useState<{ title: string; content: string; icon?: string } | null>(null);

  // Avatar Canvas Ref and Effect
  const avatarCanvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = avatarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw player down sprite cropped to the head region with class palette coloring!
    const palette = getPaletteForClass(classType);
    drawPixelSprite(ctx, "player_down_idle", -8, -6, 80, 80, {
      paletteOverride: palette,
    });
  }, [classType]);

  // State to track which slot is hovered for the RPG interactive tooltip
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number | null>(null);

  // Determine health bar color based on HP
  const getHealthColor = () => {
    if (healthPercent > 50) return "bg-red-500 border-red-700 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
    if (healthPercent > 20) return "bg-amber-500 border-amber-700 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
    return "bg-red-700 border-red-900 animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.8)]";
  };

  const getClassNameString = () => {
    const found = CLASS_DEFINITIONS.find((c) => c.id === classType);
    return found ? `${found.emoji} ${found.name}` : classType;
  };

  const getSkillBadge = () => {
    switch (selectedSkill) {
      case "magic_missile":
        return { name: "Aether Bullet", cost: "0 MP", icon: "✨" };
      case "sucker_punch":
        return { name: "Sucker Punch", cost: "8 EP", icon: "🥊" };
      case "fireball":
        return { name: "Bola Api", cost: "15 MP", icon: "🔥" };
      case "holy_heal":
        return { name: "Cahaya Suci", cost: "30 MP", icon: "💖" };
      case "mana_shield":
        return { name: "Perisai Aura", cost: "25 MP", icon: "🛡️" };
      default:
        return { name: "Normal", cost: "0 MP", icon: "✨" };
    }
  };

  const activeSkill = getSkillBadge();

  // Define RPG item slots with their details/tooltips similar to the image
  const hotbarSlots = [
    {
      key: "magic_missile",
      type: "skill",
      name: "Aether Bullet",
      icon: "✨",
      hotkey: "1",
      unlocked: true,
      desc: "Tembakkan proyektil sihir Aether beruntun yang menembus pertahanan musuh untuk 10-15 poin damage.",
      rank: "Rank 1",
      cast: "Instant cast",
      cooldown: "1.0 second COOLDOWN",
      cost: "0 Mana cost",
      stat: "INTELLECT 15"
    },
    {
      key: "sucker_punch",
      type: "skill",
      name: "Sucker Punch",
      icon: "🥊",
      hotkey: "2",
      unlocked: inventory.unlockedSkills.includes("sucker_punch"),
      desc: "Lakukan serangan pukulan kejutan telak dari jarak dekat, memberikan 8-22 poin physical damage ke lawan! Mereka pantas mendapatkannya.",
      rank: "Rank 1",
      cast: "Instant cast",
      cooldown: "1.0 second COOLDOWN",
      cost: "8 energy cost",
      stat: "STRENGTH 20"
    },
    {
      key: "fireball",
      type: "skill",
      name: "Bola Api",
      icon: "🔥",
      hotkey: "3",
      unlocked: inventory.unlockedSkills.includes("fireball"),
      desc: "Lepaskan sihir kegelapan pembakar yang meledak hebat saat mengenai musuh, menimbulkan 40-50 poin fire damage rasi luas.",
      rank: "Rank 1",
      cast: "Instant cast",
      cooldown: "2.0 second COOLDOWN",
      cost: "15 Mana cost",
      stat: "INTELLECT 28"
    },
    {
      key: "holy_heal",
      type: "skill",
      name: "Cahaya Suci",
      icon: "💖",
      hotkey: "4",
      unlocked: inventory.unlockedSkills.includes("holy_heal"),
      desc: "Mandikan tubuh dalam kehangatan cahaya penyembuh dimensi. Memulihkan 40 HP seketika.",
      rank: "Rank 1",
      cast: "Instant cast",
      cooldown: "3.5 second COOLDOWN",
      cost: "30 Mana cost",
      stat: "SPIRIT 25"
    },
    {
      key: "mana_shield",
      type: "skill",
      name: "Perisai Aura",
      icon: "🛡️",
      hotkey: "5",
      unlocked: inventory.unlockedSkills.includes("mana_shield"),
      desc: "Selimuti tubuh dengan lapisan pelindung energi murni. Menambah kesehatan tempur (HP) sebanyak 25 poin.",
      rank: "Rank 1",
      cast: "Instant cast",
      cooldown: "5.0 second COOLDOWN",
      cost: "25 Mana cost",
      stat: "STAMINA 20"
    },
    {
      key: "potion",
      type: "item",
      name: "Health Potion",
      icon: "🧪",
      hotkey: "6",
      unlocked: true,
      count: inventory.potion,
      desc: "Ramuan cair kental merah delima berkhasiat tinggi. Memulihkan 50 HP karakter seketika.",
      rank: "Konsumsi",
      cast: "Instant cast",
      cooldown: "Tanpa Cooldown",
      cost: "1x Ramuan Potion",
      stat: "ALCHEMY Level 1"
    },
    {
      key: "crystal",
      type: "item",
      name: "Kristal Aether",
      icon: "💎",
      hotkey: "Pass",
      unlocked: true,
      count: inventory.crystal,
      desc: "Pecahan kristal magis murni pemancar energi kosmis. Kumpulkan kristal ini untuk menuntaskan gerbang dimensi.",
      rank: "Barang Misi",
      cast: "Pasif",
      cooldown: "Barang Misi",
      cost: "Quest Item",
      stat: "QUEST REQUIRED"
    },
    {
      key: "gold",
      type: "item",
      name: "Koin Emas",
      icon: "💰",
      hotkey: "Shop",
      unlocked: true,
      count: inventory.gold,
      desc: "Tabungan koin emas berkilau berstempel kerajaan kuno. Belanjakan di Toko Game (Shop) untuk memperkuat status pahlawan Anda.",
      rank: "Mata Uang",
      cast: "Pasif",
      cooldown: "Tabungan",
      cost: "Medium of exchange",
      stat: "GOLD VALUE"
    }
  ];

  const handleSlotClick = (slot: typeof hotbarSlots[0]) => {
    if (slot.key === "potion") {
      if (onUsePotion) {
        onUsePotion();
      }
    } else if (slot.type === "skill") {
      if (slot.unlocked) {
        if (onSelectSkill) {
          onSelectSkill(slot.key as any);
        }
      } else {
        sound.playHit();
      }
    } else {
      sound.playPickup();
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none select-none flex flex-col justify-between h-full z-10 font-sans text-white">
      
      {/* Top Bar (Health, Episode and Icons) */}
      <div className="flex justify-between items-start w-full pointer-events-auto">
        
        {/* LEFT SIDE: ORNATE CHARACTER PLATE UNIT (syifara Style) */}
        <div className="flex items-start gap-2 select-none relative" id="hud-character-plate">
          {/* Circular Ornate Avatar Frame */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#3a3546] bg-[#0c0a0f] flex items-center justify-center shadow-[0_6px_15px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden group hover:border-[#ecc326] transition duration-300">
              <div className="absolute inset-0 bg-radial-gradient from-purple-950/40 via-transparent to-black" />
              {/* Actual Pixel Art Canvas mirroring the playable character */}
              <canvas 
                ref={avatarCanvasRef}
                width={64}
                height={64}
                style={{ imageRendering: "pixelated" }}
                className="w-13 h-13 absolute z-20 scale-110 pointer-events-none"
              />
            </div>
            
            {/* Level Badge ribbon below */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#4d3d2c] to-[#1e1710] border-2 border-[#806c50] text-[#ecc326] font-mono text-[9px] font-extrabold px-2 py-0.5 rounded shadow-[0_3px_5px_rgba(0,0,0,0.7)] z-20 scale-95 flex items-center justify-center leading-none">
              {episode}
            </div>
          </div>

          {/* Health & Mana Bars with Custom Board Border and Name shield */}
          <div className="flex flex-col gap-1 mt-0.5">
            {/* Bars container inside retro black wood framing */}
            <div className="bg-[#121115] border-2 border-[#322d3a] p-1.5 rounded-md flex flex-col gap-1 shadow-lg relative min-w-[210px]">
              
              {/* HP Bar */}
              <div className="relative w-full h-4 bg-[#1e0707] border border-[#441212] rounded-sm overflow-hidden flex items-center">
                <div 
                  className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 border-r-2 border-red-300 transition-all duration-300"
                  style={{ width: `${healthPercent}%` }}
                />
                {/* Visual blocky separator design details */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_90%,rgba(0,0,0,0.3)_10%)] bg-[size:16px_100%] pointer-events-none" />
                {/* Numeric health text */}
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[9.5px] font-extrabold text-[#fecaca] drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                  {health} / {maxHealth}
                </span>
              </div>

              {/* MP Bar */}
              <div className="relative w-full h-4 bg-[#050f1d] border border-[#0d223c] rounded-sm overflow-hidden flex items-center">
                <div 
                  className="h-full bg-gradient-to-r from-blue-700 via-sky-500 to-cyan-400 border-r-2 border-cyan-200 transition-all duration-300"
                  style={{ width: `${manaPercent}%` }}
                />
                {/* Visual blocky separator detail */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_90%,rgba(0,0,0,0.3)_10%)] bg-[size:16px_100%] pointer-events-none" />
                {/* Numeric mana text */}
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[9.5px] font-extrabold text-[#e0f2fe] drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                  {mana} / {maxMana}
                </span>
              </div>

            </div>

            {/* Player Name Shield plate (Click to edit) & passive badge slots */}
            <div className="flex items-center gap-1.5">
              {/* Sleek rounded plaque styled to allow custom name setting */}
              <div 
                className="bg-[#0b0a0e]/95 border-2 border-[#24212a] px-3.5 py-0.5 rounded shadow-md text-left cursor-pointer hover:border-[#ecc326] transition duration-200"
                title="Klik untuk mengubah nama Pahlawan"
                onClick={() => {
                  if (!isEditingName) {
                    setTempName(playerName);
                    setIsEditingName(true);
                  }
                }}
              >
                {isEditingName ? (
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value.slice(0, 12))}
                    onBlur={() => {
                      const finalName = tempName.trim() || "Pahlawan";
                      setPlayerName(finalName);
                      localStorage.setItem("aether_player_name", finalName);
                      setIsEditingName(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const finalName = tempName.trim() || "Pahlawan";
                        setPlayerName(finalName);
                        localStorage.setItem("aether_player_name", finalName);
                        setIsEditingName(false);
                      }
                    }}
                    className="bg-transparent text-white font-mono text-[10.5px] font-bold outline-none border-b border-cyan-400 w-20 px-0.5 py-0 pointer-events-auto"
                    autoFocus
                  />
                ) : (
                  <span className="font-mono text-[10.5px] font-bold text-gray-200 tracking-wide flex items-center gap-1">
                    {playerName} <span className="text-[9px] text-[#ecc326] font-normal font-sans ml-1">({classType})</span> <span className="text-[8px] text-gray-400">✏️</span>
                  </span>
                )}
              </div>

              {/* Status Empty Buff Slots to mimic retro RPG layout */}
              <div className="flex gap-0.5">
                <div className="w-5 h-4 bg-[#14121a]/90 border border-gray-800 rounded flex items-center justify-center text-[7px]" title="Empty Buff Slot"></div>
                <div className="w-5 h-4 bg-[#14121a]/90 border border-gray-800 rounded flex items-center justify-center text-[7px]" title="Empty Buff Slot"></div>
                <div className="w-5 h-4 bg-[#14121a]/90 border border-gray-800 rounded flex items-center justify-center text-[7px]" title="Empty Buff Slot"></div>
              </div>
            </div>

          </div>
        </div>

        {/* CENTER/RIGHT SECTION: HORIZONTAL MENU FLOATING ACTIVE RETRO ICONS */}
        <div className="flex flex-col items-center gap-1.5 pt-0.5" id="hud-floating-menu">
          <div className="bg-[#121017]/95 border-2 border-[#383244] p-1.5 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.95)] flex items-center gap-1.5">
            
            {/* Button 1: Pink/Magenta Gem Active Quest highlight */}
            <button
              onClick={() => {
                sound.playTeleport();
                const title = activeQuest ? activeQuest.title : "Misi Rimba Aether";
                const questContent = activeQuest 
                  ? activeQuest.description 
                  : "Misi Aktif: Bebaskan Lembah Rimba Aether! Kumpulkan pecahan Kristal Aether suci untuk membuka segel portal dimensi kuno dan kalahkan Raja Iblis untuk mengembalikan kejayaan desa.";
                setAlertModal({
                  title: title.toUpperCase(),
                  content: questContent,
                  icon: "🧭"
                });
              }}
              className="w-8 h-8 rounded bg-gradient-to-br from-[#ffd6e8] to-[#9d174d] border-2 border-[#f43f5e]/80 hover:border-white transition-all shadow-md active:scale-95 flex items-center justify-center text-sm cursor-pointer"
              title="Informasi Quest Aktif (🔮)"
            >
              💖
            </button>

            {/* Button 2: Character / Hero Selection class switch */}
            <button
              onClick={() => {
                sound.playPickup();
                onOpenCharacterSelection();
              }}
              className="w-8 h-8 rounded bg-[#1e2a4a]/90 border-2 border-sky-400 hover:border-white transition-all shadow-md active:scale-95 flex items-center justify-center text-sm cursor-pointer"
              title="Ganti Pahlawan (👥)"
            >
              🛡️
            </button>

            {/* Button 3: Spell book Shop selector */}
            <button
              onClick={() => {
                sound.playTeleport();
                onOpenShop();
              }}
              className="w-8 h-8 rounded bg-[#321e4a]/90 border-2 border-purple-400 hover:border-white transition-all shadow-md active:scale-95 flex items-center justify-center text-sm cursor-pointer"
              title="Toko Sihir & Energi (📖)"
            >
              📖
            </button>

            {/* Button 4: Consumable Potion Quick Use */}
            <button
              onClick={() => {
                if (inventory.potion > 0 && onUsePotion) {
                  onUsePotion();
                } else {
                  sound.playHit();
                  setAlertModal({
                    title: "RAMUAN POTION HABIS",
                    content: "Sepertinya ransel perbekalanmu kosong!\n\nKunjungi Toko Sihir & Energi (Menu Buku Sihir 📖) lalu belanjakan koin emasmu petualang untuk membeli tambahan Ramuan Potion (HP).",
                    icon: "🧪"
                  });
                }
              }}
              className="w-8 h-8 rounded bg-[#3b2d18]/90 border-2 border-amber-500 hover:border-white transition-all shadow-md active:scale-95 flex items-center justify-center text-sm cursor-pointer"
              title="Gunakan Ramuan Potion 🧪"
            >
              📜
            </button>

            {/* Button 5: Level guide / Parchment map */}
            <button
              onClick={() => {
                sound.playPickup();
                setAlertModal({
                  title: "PETA DUNIA PETUALANGAN",
                  content: `Petualanganmu saat ini berada pada Episode ${episode}.\n\nTemukan pecahan Kristal Aether suci untuk memurnikan altar kuno dan mengaktifkan portal dimensi yang dijaga erat oleh monster-monster penjaga.`,
                  icon: "🗺️"
                });
              }}
              className="w-8 h-8 rounded bg-[#1f352b]/90 border-2 border-emerald-500 hover:border-white transition-all shadow-md active:scale-95 flex items-center justify-center text-sm cursor-pointer"
              title="Peta Petualangan (🗺️)"
            >
              🗺️
            </button>

            {/* Button 6: Trophy accomplishments */}
            <button
              onClick={() => {
                sound.playPickup();
                setAlertModal({
                  title: "ARSIP PRESTASI PAHLAWAN",
                  content: `Daftar Pencapaian Terkini:\n\n💰 Koin Emas: ${inventory.gold}g\n💎 Kristal yang Dimiliki: ${inventory.crystal}\n🔮 Sihir Dikuasai: ${inventory.unlockedSkills.length} tipe sihir legendaris\n\nKalahkan musuh-musuh elit dan capai kesempurnaan di Episode 3!`,
                  icon: "🏆"
                });
              }}
              className="w-8 h-8 rounded bg-[#493e1a]/90 border-2 border-yellow-400 hover:border-white transition-all shadow-md active:scale-95 flex items-center justify-center text-sm cursor-pointer"
              title="Trophy Pencapaian (🏆)"
            >
              🏆
            </button>

            {/* Button 7: Episode Banner Flag Crest */}
            <button
              onClick={() => {
                sound.playPickup();
                setAlertModal({
                  title: "PANJI RIMBA AETHER",
                  content: "Ini adalah bendera suci pertahanan Rimba Aether.\n\nMelambangkan tekad bulat pahlawan untuk menyatukan kekuatan sihir kosmis demi mengalahkan invasi Raja Iblis dari kegelapan.",
                  icon: "🚩"
                });
              }}
              className="w-8 h-8 rounded bg-[#49161a]/90 border-2 border-red-500 hover:border-white transition-all shadow-md active:scale-95 flex items-center justify-center text-[10px] cursor-pointer font-bold text-center"
              title="Panji Pertempuran (🚩)"
            >
              🚩
            </button>

            {/* Button 8: Skull / Combat statistics */}
            <button
              onClick={() => {
                sound.playPickup();
                setAlertModal({
                  title: "STATISTIK KEKUATAN TEMPUR",
                  content: `Atribut Tempur Pahlawan pasif saat ini:\n\n🛡️ Spesialisasi Kelas: ${classType.toUpperCase()}\n💥 Tembakan Sihir Dasar: ${classType === "mage" ? "15 Damage (Spesialis sihir!)" : "10 Damage"}\n🥊 Damage Pukulan (Sucker punch): ${classType === "warrior" ? "22 DMG (Kekuatan fisik!)" : classType === "rogue" ? "18 DMG" : "12 DMG"}\n⚡ Konsumsi Energi: Sucker punch membutuhkan 8 EP\n🚀 Kecepatan Proyektil: ${classType === "rogue" ? "Bonus 9" : "7"}\n🌀 Pemulihan Mana pasif berjalan konstan di pertempuran.`,
                  icon: "💀"
                });
              }}
              className="w-8 h-8 rounded bg-[#27272a]/90 border-2 border-gray-400 hover:border-white transition-all shadow-md active:scale-95 flex items-center justify-center text-sm cursor-pointer"
              title="Info Kekuatan Tempur (💀)"
            >
              🎃
            </button>

            {/* Button 9: Wooden Mailbox inventory link */}
            <button
              onClick={() => {
                sound.playPickup();
                onOpenInventory();
              }}
              className="w-8 h-8 rounded bg-[#10141f]/90 border-2 border-blue-400 hover:border-white transition-all shadow-md active:scale-95 flex items-center justify-center text-sm cursor-pointer"
              title="Kotak Surat & Tas Karakter (📬)"
            >
              📫
            </button>

            {/* Button 10: Cogwheel sound toggle */}
            <button
              onClick={onToggleSound}
              className="w-8 h-8 rounded bg-[#1e2530]/90 border-2 border-slate-400 hover:border-white transition-all shadow-md active:scale-95 flex items-center justify-center text-sm cursor-pointer"
              title="Sandi Suara Musik (⚙️)"
            >
              ⚙️
            </button>

          </div>
        </div>

        {/* RIGHT SIDE DETAIL BOARD: STATS PILL & WELCOME SCROLL */}
        <div className="flex flex-col items-end gap-2" id="hud-right-metadata">
          {/* Small icons & Pill-shaped status bar containing: Gold (🪙), Shard (💎), and Ticker virtual time */}
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {/* discord and database interactive buttons */}
            <button
              onClick={() => {
                sound.playPickup();
                setAlertModal({
                  title: "ALIANSI GUILD DISCORD",
                  content: "Bergabunglah ke dalam komunitas pusat para petualang! Bagikan pengalamanmu mengalahkan labyrinth dan dapatkan info rilis update map terbaru di masa mendatang.",
                  icon: "👾"
                });
              }}
              className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-[10px] cursor-pointer hover:border-white active:scale-90 transition-all"
              title="Aliansi Guild Discord"
            >
              👾
            </button>
            <button
              onClick={() => {
                sound.playPickup();
                setAlertModal({
                  title: "DATABASE AWAN LIVE",
                  content: "Proses sinkronisasi data petualanganmu berjalan aman!\n\nSeluruh status karakter, koin emas, kristal yang telah dikumpulkan, dan jenis sihir kuno yang telah kamu buka tersimpan aman secara real-time pada local secure storage.",
                  icon: "💾"
                });
              }}
              className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900 border border-slate-750 flex items-center justify-center text-[10px] cursor-pointer hover:border-white active:scale-90 transition-all"
              title="Status Database Live"
            >
              💾
            </button>

            {/* Pill shaped status panel */}
            <div className="flex-shrink-0 bg-[#0b0a0f]/95 border-2 border-[#2b2735] p-1 px-3 rounded-full flex items-center gap-3 shadow-md text-[10.5px] font-mono leading-none">
              
              {/* Gold Counter */}
              <div className="flex items-center gap-1">
                <span className="text-sm">🪙</span>
                <span className="font-extrabold text-[#ecc326]">{inventory.gold}</span>
              </div>

              {/* Shard/crystal Counter */}
              <div className="flex items-center gap-1">
                <span className="text-purple-400 text-xs">💎</span>
                <span className="font-extrabold text-purple-300">{inventory.crystal}</span>
              </div>

              {/* Splitter bar */}
              <span className="text-gray-600">|</span>

              {/* MMORPG virtual game time */}
              <div className="flex items-center gap-1">
                <span className="text-gray-300 font-extrabold tracking-tight">
                  {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false })}
                </span>
              </div>

            </div>
          </div>

          {/* Ornate black scroll feed message (WELCOME TO FANTASY ONLINE 2 style) */}
          <div className="bg-[#040405] border-2 border-[#1e1a26]/90 p-2 px-4 rounded-xl shadow-lg max-w-[210px] text-center flex flex-col items-center justify-center leading-none">
            <span className="text-[8.5px] font-extrabold text-[#10b981] uppercase tracking-widest font-mono animate-pulse">
              WELCOME TO RIMBA AETHER 2!
            </span>
            <div className="text-[10px] font-mono font-bold text-gray-300 mt-1">
              Crystal Misi: <b className="text-cyan-400">{inventory.crystal}</b> / 1
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Row - Active Quest, Item/Skill Hotbar & Key Controls Panel */}
      <div className="flex justify-between items-end w-full mt-auto relative gap-3">
        
        {/* Left COLUMN: Compact Quest Log */}
        {activeQuest ? (
          <div className="bg-[#0b0a0f]/95 border-l-2 border-l-cyan-400 border border-[#242130] p-2 rounded shadow-[0_4px_20px_rgba(0,0,0,0.8)] max-w-[170px] pointer-events-auto text-left select-none shrink-0 font-mono">
            <div className="flex items-center gap-1 text-cyan-400 font-bold text-[8.5px] tracking-wider uppercase mb-0.5 select-none">
              <span>🧭</span>
              <span>QUEST AKTIF</span>
            </div>
            <h4 className="text-[10px] font-bold text-white leading-tight truncate">{activeQuest.title}</h4>
            <p className="text-[9px] text-gray-400 leading-tight font-sans mt-0.5">{activeQuest.description}</p>
            {activeQuest.targetCount > 1 && (
              <div className="text-[9px] text-amber-400 font-bold mt-1 bg-amber-950/35 border border-amber-900/30 px-1 py-0.2 rounded-sm w-fit">
                Progress: {activeQuest.currentCount}/{activeQuest.targetCount}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#0b0a0f]/90 border border-dashed border-gray-800 p-1.5 px-2 rounded font-mono text-[8.5px] text-gray-500 max-w-[170px] select-none shrink-0 text-left leading-tight">
            ⚔️ Bebaskan Rimba Aether!
          </div>
        )}

        {/* Center COLUMN: Interactive Spell & Item Action Hotbar styled as your picture */}
        <div className="flex-grow flex justify-center pb-0.5 relative z-30 shrink-0 select-none">
          <div className="bg-[#0b0a11]/95 border-2 border-[#362f45] rounded-md p-1.5 shadow-[0_12px_45px_rgba(0,0,0,0.95)] flex items-end gap-1.5 pointer-events-auto relative">
            
            {/* Horizontal Slots listing */}
            <div className="flex gap-1 items-center">
              {hotbarSlots.map((slot, index) => {
                const isActive = selectedSkill === slot.key && slot.type === "skill" && slot.unlocked;
                return (
                  <div
                    key={slot.key}
                    onClick={() => handleSlotClick(slot)}
                    onMouseEnter={() => setHoveredSlotIndex(index)}
                    onMouseLeave={() => setHoveredSlotIndex(null)}
                    className={`relative w-11 h-11 border-2 rounded flex flex-col justify-between items-center transition-all bg-[#151221] cursor-pointer cursor-cell select-none p-1 ${
                      isActive 
                        ? "border-[#ecc326] ring-2 ring-[#ecc326]/40 shadow-[0_0_12px_rgba(236,195,38,0.5)] bg-[#1e1a2f]" 
                        : "border-[#3f3852] hover:border-slate-300 hover:bg-[#1a172a]"
                    }`}
                  >
                    {/* Hotkey tag bottom or top left */}
                    <div className="absolute top-0.5 left-0.5 font-mono text-[8px] font-bold text-gray-400 select-none">
                      {slot.hotkey}
                    </div>

                    {/* Rank Indicator / Lock icon */}
                    <div className="absolute top-0.5 right-0.5 font-mono text-[8px] select-none">
                      {!slot.unlocked ? (
                        <span className="text-amber-500 animate-pulse text-[8px]">🔒</span>
                      ) : (
                        slot.rank === "Rank 1" ? <span className="text-gray-400 font-bold scale-90">I</span> : null
                      )}
                    </div>

                    {/* Main Slot Center Icon */}
                    <div className={`text-xl select-none pt-1 transition-transform ${isActive ? "scale-110" : ""} ${!slot.unlocked ? "opacity-30 blur-[0.3px]" : "hover:scale-110"}`}>
                      {slot.icon}
                    </div>

                    {/* Quantity Bubble bottom right for consumable items */}
                    {slot.count !== undefined && (
                      <div className="absolute bottom-0 right-0 font-mono text-[8px] font-extrabold bg-slate-950 border border-slate-700 text-[#ecc326] px-1 rounded-sm scale-90">
                        {slot.count}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stepper Widget or Visual Separation layout as the picture */}
            <div className="flex flex-col gap-1 justify-center px-0.5 border-l border-gray-800/60 pb-1 shrink-0 h-9">
              <span className="text-[7px] text-gray-500 hover:text-white cursor-pointer select-none">▲</span>
              <span className="text-[7px] font-mono font-bold text-gray-400 text-center select-none scale-90">1</span>
              <span className="text-[7px] text-gray-500 hover:text-white cursor-pointer select-none">▼</span>
            </div>

            {/* Leather Backpack icon slot on the right end */}
            <div
              onClick={() => {
                sound.playPickup();
                onOpenInventory();
              }}
              className="w-11 h-11 border-2 border-[#544235] bg-[#3a2012] rounded flex items-center justify-center cursor-pointer hover:border-[#ecc326] hover:bg-[#4d2d1b] transition relative p-0.5 shrink-0"
              title="Buka Tas Karakter (I)"
            >
              <span className="absolute top-0.5 left-0.5 font-mono text-[8px] font-extrabold text-amber-500/85">I</span>
              <span className="text-xl animate-wiggle">🎒</span>
            </div>

            {/* FLOATING ACTION TOOLTIP OVERLAY */}
            {hoveredSlotIndex !== null && (
              <div 
                className="absolute bottom-16 left-1/2 -translate-x-1/2 w-80 bg-black/95 text-white border-2 border-white p-3.5 rounded shadow-[0_12px_45px_rgba(0,0,0,0.95)] z-50 text-left pointer-events-none font-mono flex flex-col gap-1.5"
                id={`tooltip-slot-${hotbarSlots[hoveredSlotIndex].key}`}
              >
                <div className="flex justify-between items-start border-b border-gray-800 pb-1">
                  <div>
                    <h4 className="text-xs font-bold text-[#ecc326] uppercase tracking-wider">{hotbarSlots[hoveredSlotIndex].name}</h4>
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none">
                      {hotbarSlots[hoveredSlotIndex].type === "skill" ? "ACTIVE SKILL" : "ITEM INVENTARIS"}
                    </span>
                  </div>
                  {hotbarSlots[hoveredSlotIndex].rank && (
                    <span className="text-[9px] bg-[#3d2a13] text-[#f59e0b] font-bold border border-amber-800 px-1 rounded">
                      {hotbarSlots[hoveredSlotIndex].rank}
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-gray-300 leading-normal font-sans pt-0.5">
                  {hotbarSlots[hoveredSlotIndex].desc}
                </p>

                <div className="grid grid-cols-2 gap-y-0.5 gap-x-2.5 text-[9px] border-t border-gray-800/80 pt-1.5 text-gray-400">
                  <div>Cast-time: <b className="text-gray-200">{hotbarSlots[hoveredSlotIndex].cast}</b></div>
                  <div>Cooldown: <b className="text-gray-200">{hotbarSlots[hoveredSlotIndex].cooldown}</b></div>
                  <div>Resource: <b className="text-[#38bdf8]">{hotbarSlots[hoveredSlotIndex].cost}</b></div>
                  <div className="text-[#10b981] font-bold">{hotbarSlots[hoveredSlotIndex].stat}</div>
                </div>

                {!hotbarSlots[hoveredSlotIndex].unlocked && (
                  <div className="text-[8px] text-orange-400 font-bold border-t border-dashed border-orange-950 pt-1 mt-1 animate-pulse">
                    ⚠️ TERKUNCI! Beli Buku Sihir ini di Toko Game untuk membukanya.
                  </div>
                )}

                {hotbarSlots[hoveredSlotIndex].unlocked && hotbarSlots[hoveredSlotIndex].type === "skill" && (
                  <div className="text-[8px] text-[#2ee1ff] font-bold border-t border-cyan-950 pt-1 mt-1 bg-cyan-950/20 text-center py-0.5 rounded leading-none">
                    💡 Tekan tombol [{hotbarSlots[hoveredSlotIndex].hotkey}] / Klik untuk mengaktifkan.
                  </div>
                )}
                
                {hotbarSlots[hoveredSlotIndex].key === "potion" && (
                  <div className="text-[8px] text-[#22c55e] font-bold border-t border-green-950 pt-1 mt-1 bg-green-950/20 text-center py-0.5 rounded leading-none">
                     💡 Tekan tombol [6] / Klik untuk langsung memulihkan 50 HP.
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right COLUMN: Spacer to balance layout and keep center Hotbar perfectly centered */}
        <div className="w-[170px] shrink-0 pointer-events-none invisible h-1" />

      </div>

      {/* RETRO RPG MODAL SYSTEM */}
      {alertModal && (
        <div className="absolute inset-0 bg-black/80 flex justify-center items-center z-55 pointer-events-auto select-none backdrop-blur-md p-4" id="hud-alert-overlay">
          <div className="bg-[#110e16] border-2 border-[#ccaa44] rounded-lg max-w-sm w-full p-5 shadow-[0_12px_40px_rgba(0,0,0,0.95)] flex flex-col items-center text-center relative font-mono">
            {/* Ornate Gold Banner */}
            <div className="absolute -top-4 bg-gradient-to-b from-[#e6c15c] to-[#997722] border-2 border-[#110e16] text-[#110e16] font-mono text-[10px] font-extrabold px-3 py-1 rounded shadow-md uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <span>{alertModal.icon}</span>
              <span>{alertModal.title}</span>
            </div>
            
            {/* Modal Body content */}
            <div className="mt-4 text-[10.5px] text-gray-200 leading-relaxed font-sans text-left bg-black/45 border border-[#2b2535] p-3.5 rounded-md w-full whitespace-pre-line max-h-48 overflow-y-auto">
              {alertModal.content}
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                sound.playPickup();
                setAlertModal(null);
              }}
              className="mt-4 px-5 py-2 bg-gradient-to-r from-red-800 to-red-950 border border-red-600 hover:from-red-700 hover:to-red-900 text-white font-mono text-[9px] font-bold uppercase tracking-widest rounded shadow active:scale-95 cursor-pointer"
            >
              [X] TUTUP KOTAK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
