/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Inventory } from "../types";
import { sound } from "../engine/sound";
import { X, Shield, Award, Heart, Backpack, CheckCircle, Flame, HeartPulse, ShieldAlert, Coins } from "lucide-react";

interface InventoryMenuProps {
  inventory: Inventory;
  playerHealth: number;
  playerMaxHealth: number;
  playerMana: number;
  playerMaxMana: number;
  selectedSkill: string;
  onUsePotion: () => void;
  onSelectSkill: (skill: "magic_missile" | "fireball" | "holy_heal" | "mana_shield") => void;
  onUseSkillBook: (skillType: "fireball" | "holy_heal" | "mana_shield") => void;
  onClose: () => void;
}

export const InventoryMenu: React.FC<InventoryMenuProps> = ({
  inventory,
  playerHealth,
  playerMaxHealth,
  playerMana,
  playerMaxMana,
  selectedSkill,
  onUsePotion,
  onSelectSkill,
  onUseSkillBook,
  onClose,
}) => {
  // Support custom selected item on the grid
  const [selectedItem, setSelectedItem] = useState<
    "potion" | "crystal" | "key" | "skill_book_fireball" | "skill_book_heal" | "skill_book_shield" | null
  >(inventory.potion > 0 ? "potion" : "crystal");

  const handleUsePotion = () => {
    if (inventory.potion <= 0) return;
    if (playerHealth >= playerMaxHealth) return;
    sound.playDrinkPotion();
    onUsePotion();
  };

  const handleLearnSkill = (skillType: "fireball" | "holy_heal" | "mana_shield") => {
    sound.playDrinkPotion(); // Play learning magic sound
    onUseSkillBook(skillType);
  };

  // Check if a skill book is in inventory
  const hasFireballBook = inventory.unlockedSkills.indexOf("fireball") === -1 && (inventory as any).skill_book_fireball > 0;
  // Fallback if not directly inside inventory count: we can store skillbooks inside the generic inventory keys!
  // To keep types safe, let's assume we can also store book counts directly in inventory (which we'll initialize in App.tsx)

  const getBookCount = (type: "fireball" | "heal" | "shield") => {
    return (inventory as any)[`book_${type}`] || 0;
  };

  const getItemExplanation = () => {
    switch (selectedItem) {
      case "potion":
        return {
          name: "Healing Potion",
          emoji: "🧪",
          qty: inventory.potion,
          desc: "Kocokan herbal rahasia berwarna merah cerah. Memulihkan 30 poin Health (HP) saat diminum secara langsung.",
          type: "Dapat Digunakan",
          effect: "Regenerasi +30 HP",
          action: handleUsePotion,
          actionLabel: playerHealth >= playerMaxHealth ? "HP Sudah Penuh" : "Minum Potion",
          actionDisabled: inventory.potion <= 0 || playerHealth >= playerMaxHealth,
        };
      case "crystal":
        return {
          name: "Kristal Aether",
          emoji: "💎",
          qty: inventory.crystal,
          desc: "Kristal magis yang memancarkan pendaran cahaya suci berwarna biru langit. Digunakan sebagai sumber energi utama portal dimensi dan kekuatan sihir aura.",
          type: "Quest Item",
          effect: "Aktivasi Portal Elrick",
          actionLabel: "Tersimpan di Kantong",
          actionDisabled: true,
        };
      case "key":
        return {
          name: "Kunci Labyrinth",
          emoji: "🔑",
          qty: inventory.key,
          desc: "Kunci emas berornamen tengkorak yang terbuat dari logam kuno. Digunakan untuk membongkar gerbang segel besi dungeon menuju singgasana Raja Iblis.",
          type: "Quest Item",
          effect: "Membuka Gerbang Utama Boss",
          actionLabel: "Tersimpan di Kantong",
          actionDisabled: true,
        };
      case "skill_book_fireball":
        const hasFireball = inventory.unlockedSkills.includes("fireball");
        const fbQty = getBookCount("fireball");
        return {
          name: "Buku Sihir: Bola Api",
          emoji: "🔥",
          qty: fbQty,
          desc: "Naskah kuno bersampul kulit naga. Membaca buku ini akan mengajarkan Anda sihir 'Bola Api' yang melontarkan tembakan berdaya ledak tinggi.",
          type: "Sihir / Skill Book",
          effect: "Membuka Skill Bola Api (15 MP)",
          action: () => handleLearnSkill("fireball"),
          actionLabel: hasFireball ? "Sudah Dipelajari" : "Pelajari Sihir",
          actionDisabled: fbQty <= 0 || hasFireball,
        };
      case "skill_book_heal":
        const hasHeal = inventory.unlockedSkills.includes("holy_heal");
        const healQty = getBookCount("heal");
        return {
          name: "Buku Sihir: Cahaya Suci",
          emoji: "💖",
          qty: healQty,
          desc: "Kitab bersayap emas pemancar aura kedamaian. Mengajarkan mantra 'Cahaya Suci' untuk memulihkan luka parah seketika.",
          type: "Penyembuhan / Skill Book",
          effect: "Membuka Skill Cahaya Suci (30 MP)",
          action: () => handleLearnSkill("holy_heal"),
          actionLabel: hasHeal ? "Sudah Dipelajari" : "Pelajari Sihir",
          actionDisabled: healQty <= 0 || hasHeal,
        };
      case "skill_book_shield":
        const hasShield = inventory.unlockedSkills.includes("mana_shield");
        const shieldQty = getBookCount("shield");
        return {
          name: "Buku Sihir: Perisai Aether",
          emoji: "🛡️",
          qty: shieldQty,
          desc: "Gulungan mantra bercorak prismatik. Mengajarkan sihir 'Perisai Aether' yang melindungi Anda dari serangan magis musuh.",
          type: "Pertahanan / Skill Book",
          effect: "Membuka Skill Perisai Aether (25 MP)",
          action: () => handleLearnSkill("mana_shield"),
          actionLabel: hasShield ? "Sudah Dipelajari" : "Pelajari Sihir",
          actionDisabled: shieldQty <= 0 || hasShield,
        };
      default:
        return null;
    }
  };

  const activeDetails = getItemExplanation();

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-30 font-sans backdrop-blur-md transition-all duration-300 pointer-events-auto">
      {/* Container Box */}
      <div className="w-full max-w-2xl bg-[#0f0e13] border-2 border-[#3b3542] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header bar */}
        <div className="bg-[#17151c] px-5 py-4 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-2.5 text-[#ecc326] font-bold text-base tracking-wider uppercase">
            <Backpack className="w-5 h-5 animate-bounce" />
            <span>KOTAK PENYIMPANAN & AJIAN SIHIR</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/25 px-2.5 py-1 rounded text-yellow-400 font-mono text-xs font-bold">
              <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>{inventory.gold} Gold</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition active:scale-95"
              title="Tutup (I)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-grow overflow-y-auto">
          
          {/* Left Block: Items & Skill Books (col-span-7) */}
          <div className="p-5 border-b md:border-b-0 md:border-r border-gray-800 flex flex-col justify-start md:col-span-7">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#ecc326] mb-3 font-mono border-b border-gray-800/80 pb-1.5 flex items-center gap-1.5">
              <span>🎒</span> Tas Utama
            </h4>
            
            <div className="grid grid-cols-4 gap-2 mb-6">
              {/* Potion Item Card */}
              <button
                onClick={() => setSelectedItem("potion")}
                className={`aspect-square border p-1 rounded-lg flex flex-col items-center justify-between text-center transition-all ${
                  selectedItem === "potion"
                    ? "bg-[#341d1e] border-red-500 scale-95 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                    : "bg-gray-900/60 border-gray-800 hover:bg-gray-800/80 hover:border-gray-600"
                }`}
              >
                <span className="text-2xl mt-1">🧪</span>
                <span className="text-[9px] font-bold truncate max-w-full text-gray-300">Potion</span>
                <span className={`text-[9px] p-0.5 px-1.5 font-bold font-mono rounded-full ${
                  inventory.potion > 0 ? "bg-red-500/30 text-red-400" : "bg-gray-800 text-gray-500"
                }`}>
                  x{inventory.potion}
                </span>
              </button>

              {/* Crystal Item Card */}
              <button
                onClick={() => setSelectedItem("crystal")}
                className={`aspect-square border p-1 rounded-lg flex flex-col items-center justify-between text-center transition-all ${
                  selectedItem === "crystal"
                    ? "bg-[#112d3c] border-cyan-500 scale-95 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                    : "bg-gray-900/60 border-gray-800 hover:bg-gray-800/80 hover:border-gray-600"
                }`}
              >
                <span className="text-2xl mt-1 animate-pulse">💎</span>
                <span className="text-[9px] font-bold truncate max-w-full text-gray-300">Kristal</span>
                <span className={`text-[9px] p-0.5 px-1.5 font-bold font-mono rounded-full ${
                  inventory.crystal > 0 ? "bg-cyan-500/30 text-cyan-400" : "bg-gray-800 text-gray-500"
                }`}>
                  x{inventory.crystal}
                </span>
              </button>

              {/* Key Item Card */}
              <button
                onClick={() => setSelectedItem("key")}
                className={`aspect-square border p-1 rounded-lg flex flex-col items-center justify-between text-center transition-all ${
                  selectedItem === "key"
                    ? "bg-[#332b1a] border-yellow-500 scale-95 shadow-[0_0_12px_rgba(234,179,8,0.2)]"
                    : "bg-gray-900/60 border-gray-800 hover:bg-gray-800/80 hover:border-gray-600"
                }`}
              >
                <span className="text-2xl mt-1">🔑</span>
                <span className="text-[9px] font-bold truncate max-w-full text-gray-300">Kunci</span>
                <span className={`text-[9px] p-0.5 px-1.5 font-bold font-mono rounded-full ${
                  inventory.key > 0 ? "bg-yellow-500/30 text-yellow-400" : "bg-gray-800 text-gray-500"
                }`}>
                  x{inventory.key}
                </span>
              </button>
            </div>

            {/* Skill Books Grid Header */}
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#a855f7] mb-3 font-mono border-b border-gray-800/80 pb-1.5 flex items-center gap-1.5 pt-2">
              <span>📖</span> Buku Sihir / Skill Book
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {/* Fireball Book */}
              <button
                onClick={() => setSelectedItem("skill_book_fireball")}
                className={`aspect-square border p-1.5 rounded-lg flex flex-col items-center justify-between text-center transition-all ${
                  selectedItem === "skill_book_fireball"
                    ? "bg-[#3c1e19] border-orange-500 scale-95 shadow-[0_0_12px_rgba(249,115,22,0.2)]"
                    : "bg-gray-900/60 border-gray-800 hover:bg-gray-800/80 hover:border-gray-650"
                }`}
              >
                <span className="text-2xl mt-1">🔥</span>
                <span className="text-[9px] font-bold text-gray-300">Buku Bola Api</span>
                <span className={`text-[8px] p-0.5 px-1.5 font-bold font-mono rounded-full ${
                  getBookCount("fireball") > 0 ? "bg-orange-500/30 text-orange-400 animate-pulse" : "bg-gray-800 text-gray-505"
                }`}>
                  {inventory.unlockedSkills.includes("fireball") ? "Lulus" : `x${getBookCount("fireball")}`}
                </span>
              </button>

              {/* Healing Book */}
              <button
                onClick={() => setSelectedItem("skill_book_heal")}
                className={`aspect-square border p-1.5 rounded-lg flex flex-col items-center justify-between text-center transition-all ${
                  selectedItem === "skill_book_heal"
                    ? "bg-[#183424] border-emerald-500 scale-95 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                    : "bg-gray-900/60 border-gray-800 hover:bg-gray-800/80 hover:border-gray-650"
                }`}
              >
                <span className="text-2xl mt-1">💖</span>
                <span className="text-[9px] font-bold text-gray-300">Kitab Cahaya</span>
                <span className={`text-[8px] p-0.5 px-1.5 font-bold font-mono rounded-full ${
                  getBookCount("heal") > 0 ? "bg-emerald-500/30 text-emerald-400 animate-pulse" : "bg-gray-800 text-gray-505"
                }`}>
                  {inventory.unlockedSkills.includes("holy_heal") ? "Lulus" : `x${getBookCount("heal")}`}
                </span>
              </button>

              {/* Shield Book */}
              <button
                onClick={() => setSelectedItem("skill_book_shield")}
                className={`aspect-square border p-1.5 rounded-lg flex flex-col items-center justify-between text-center transition-all ${
                  selectedItem === "skill_book_shield"
                    ? "bg-[#132c3c] border-violet-500 scale-95 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                    : "bg-gray-900/60 border-gray-800 hover:bg-gray-800/80 hover:border-gray-650"
                }`}
              >
                <span className="text-2xl mt-1">🛡️</span>
                <span className="text-[9px] font-bold text-gray-300">Buku Perisai</span>
                <span className={`text-[8px] p-0.5 px-1.5 font-bold font-mono rounded-full ${
                  getBookCount("shield") > 0 ? "bg-violet-500/30 text-violet-400 animate-pulse" : "bg-gray-800 text-gray-505"
                }`}>
                  {inventory.unlockedSkills.includes("mana_shield") ? "Lulus" : `x${getBookCount("shield")}`}
                </span>
              </button>
            </div>

            {/* Selected Active Skill Toggle */}
            <div className="mt-5 border-t border-gray-800 pt-4">
              <h4 className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-2 font-mono flex items-center gap-1.5">
                <span>⚡</span> Pilih Jurus Aktif Anda:
              </h4>
              <div className="flex flex-wrap gap-2">
                {/* Magic Missile (Selalu Ada) */}
                <button
                  onClick={() => onSelectSkill("magic_missile")}
                  className={`px-3 py-1.5 text-xs rounded-md border font-mono transition-all flex items-center gap-1.5 ${
                    selectedSkill === "magic_missile"
                      ? "bg-cyan-900/30 border-cyan-400 text-cyan-300 font-bold"
                      : "bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700"
                  }`}
                >
                  <span>✨</span> Misil Aether (0 MP)
                </button>

                {playerMana > 0 && inventory.unlockedSkills.includes("fireball") && (
                  <button
                    onClick={() => onSelectSkill("fireball")}
                    className={`px-3 py-1.5 text-xs rounded-md border font-mono transition-all flex items-center gap-1.5 ${
                      selectedSkill === "fireball"
                        ? "bg-orange-950/30 border-orange-400 text-orange-300 font-bold"
                        : "bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <span>🔥</span> Bola Api (15 MP)
                  </button>
                )}

                {playerMana > 0 && inventory.unlockedSkills.includes("holy_heal") && (
                  <button
                    onClick={() => onSelectSkill("holy_heal")}
                    className={`px-3 py-1.5 text-xs rounded-md border font-mono transition-all flex items-center gap-1.5 ${
                      selectedSkill === "holy_heal"
                        ? "bg-emerald-950/30 border-emerald-400 text-emerald-300 font-bold"
                        : "bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <span>💖</span> Cahaya Suci (30 MP)
                  </button>
                )}

                {playerMana > 0 && inventory.unlockedSkills.includes("mana_shield") && (
                  <button
                    onClick={() => onSelectSkill("mana_shield")}
                    className={`px-3 py-1.5 text-xs rounded-md border font-mono transition-all flex items-center gap-1.5 ${
                      selectedSkill === "mana_shield"
                        ? "bg-violet-950/30 border-violet-400 text-violet-300 font-bold"
                        : "bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <span>🛡️</span> Perisai Aura (25 MP)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Block: Stats & Details (col-span-5) */}
          <div className="p-5 bg-[#141217] flex flex-col justify-between min-h-[250px] md:col-span-5 border-t md:border-t-0 border-gray-800">
            {activeDetails ? (
              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-[#ecc326] uppercase font-bold">
                      {activeDetails.type}
                    </span>
                    {activeDetails.qty > 0 && (
                      <span className="text-[10px] bg-black/40 text-gray-300 font-mono font-bold p-0.5 px-2 rounded">
                        Tersedia: {activeDetails.qty}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-4xl">{activeDetails.emoji}</span>
                    <h3 className="text-md font-extrabold text-white leading-tight">{activeDetails.name}</h3>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed py-1 italic font-sans">
                    "{activeDetails.desc}"
                  </p>

                  <div className="bg-black/70 p-2.5 rounded border border-gray-800 flex items-center gap-2 text-xs font-semibold text-cyan-300 font-mono mt-1">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Efek: {activeDetails.effect}</span>
                  </div>
                </div>

                <div className="mt-6">
                  {activeDetails.qty > 0 ? (
                    <button
                      disabled={activeDetails.actionDisabled}
                      onClick={activeDetails.action}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition active:scale-95 disabled:from-gray-800 disabled:to-gray-800 disabled:border-2 disabled:border-gray-750 disabled:text-gray-500 disabled:scale-100 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(6,182,212,0.3)] disabled:shadow-none"
                    >
                      {activeDetails.actionLabel}
                    </button>
                  ) : (
                    <div className="w-full text-center py-2 text-xs text-red-400 font-bold bg-red-950/20 rounded border border-red-900/30 font-mono">
                      Barang Kosong
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center m-auto text-gray-500 px-4">
                <Backpack className="w-10 h-10 mb-2 opacity-35" />
                <p className="text-xs text-gray-400">Klik salah satu barang / buku ajaib di sebelah kiri untuk membaca kegunaannya.</p>
              </div>
            )}

            {/* Health & Mana Live Bars */}
            <div className="mt-4 pt-4 border-t border-gray-800 flex flex-col gap-2 text-xs font-mono">
              <div className="flex justify-between items-center text-gray-300">
                <span>Nyawa (HP):</span>
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                  {playerHealth} / {playerMaxHealth}
                </span>
              </div>
              <div className="w-full bg-gray-950 border border-gray-800 rounded h-2 relative overflow-hidden">
                <div className="bg-red-500 h-full rounded" style={{ width: `${Math.min(100, (playerHealth / playerMaxHealth) * 100)}%` }} />
              </div>

              {playerMaxMana > 0 ? (
                <>
                  <div className="flex justify-between items-center text-gray-300 mt-1">
                    <span>Sihir (MP):</span>
                    <span className="text-sky-400 font-bold flex items-center gap-1">
                      <span>🌀</span>
                      {playerMana} / {playerMaxMana}
                    </span>
                  </div>
                  <div className="w-full bg-gray-950 border border-gray-800 rounded h-2 relative overflow-hidden">
                    <div className="bg-sky-500 h-full rounded" style={{ width: `${Math.min(100, (playerMana / playerMaxMana) * 100)}%` }} />
                  </div>
                </>
              ) : (
                <div className="text-[10px] text-gray-500 font-sans mt-1">
                  *Karakter ini tidak memiliki Mana. Ganti ke kelas Mage untuk sihir +5% Mana bonus!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer controls guide */}
        <div className="bg-[#0b090c] px-5 py-2.5 border-t border-gray-800 text-[10px] text-gray-500 font-mono text-center">
          Dapatkan Gold dari mengalahkan boss atau monster di dungeon, kemudian belanjakan di Toko Game!
        </div>
      </div>
    </div>
  );
};
