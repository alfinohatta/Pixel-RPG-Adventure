/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Inventory } from "../types";
import { sound } from "../engine/sound";
import { X, ShoppingBag, Coins, Sparkles, Flame, ShieldAlert, HeartPulse } from "lucide-react";

interface GameShopProps {
  inventory: Inventory;
  gold: number;
  unlockedSkills: string[];
  maxMana: number;
  onBuyItem: (itemKey: "potion" | "book_fireball" | "book_heal" | "book_shield" | "mana_5_percent") => void;
  onClose: () => void;
}

export const GameShop: React.FC<GameShopProps> = ({
  inventory,
  gold,
  unlockedSkills,
  maxMana,
  onBuyItem,
  onClose,
}) => {
  const getBookCount = (type: "fireball" | "heal" | "shield") => {
    return (inventory as any)[`book_${type}`] || 0;
  };

  const shopItems = [
    {
      id: "potion",
      name: "🧪 Healing Potion",
      cost: 15,
      description: "Memulihkan 30 HP seketika saat diminum di medan tempur.",
      badge: "Umum",
      color: "border-red-500/30 text-red-400 bg-red-950/20",
      buttonText: "Beli (15 Gold)",
      disabled: gold < 15,
    },
    {
      id: "mana_5_percent",
      name: "🌀 Upgrade Mana Sihir +5%",
      cost: 30,
      description: "Meningkatkan kapasitas Maksimum Mana Anda sebesar +5% secara permanen lewat energi aether kuno.",
      badge: "Upgrade Pasif",
      color: "border-sky-500/30 text-sky-400 bg-sky-950/20",
      buttonText: "Tingkatkan (30 Gold)",
      disabled: gold < 30 || maxMana <= 0,
      requiresMana: true,
    },
    {
      id: "book_fireball",
      name: "🔥 Skill Book: Bola Api",
      cost: 40,
      description: "Mempelajari mantra Bola Api berkekuatan ledak tinggi. Membutuhkan 15 MP.",
      badge: "Buku Sihir",
      color: "border-orange-500/30 text-orange-400 bg-orange-950/20",
      buttonText: unlockedSkills.includes("fireball") ? "Sudah Dipelajari" : getBookCount("fireball") > 0 ? "Buku Dimiliki" : "Beli (40 Gold)",
      disabled: gold < 40 || unlockedSkills.includes("fireball") || getBookCount("fireball") > 0,
    },
    {
      id: "book_heal",
      name: "💖 Skill Book: Cahaya Suci",
      cost: 55,
      description: "Mempelajari mantra pemulihan lukas parah instan. Membutuhkan 30 MP.",
      badge: "Buku Sihir",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-950/20",
      buttonText: unlockedSkills.includes("holy_heal") ? "Sudah Dipelajari" : getBookCount("heal") > 0 ? "Buku Dimiliki" : "Beli (55 Gold)",
      disabled: gold < 55 || unlockedSkills.includes("holy_heal") || getBookCount("heal") > 0,
    },
    {
      id: "book_shield",
      name: "🛡️ Skill Book: Perisai Aura",
      cost: 45,
      description: "Mempelajari sihir pertahanan yang menyerap serangan iblis. Membutuhkan 25 MP.",
      badge: "Buku Sihir",
      color: "border-violet-500/30 text-violet-400 bg-violet-950/20",
      buttonText: unlockedSkills.includes("mana_shield") ? "Sudah Dipelajari" : getBookCount("shield") > 0 ? "Buku Dimiliki" : "Beli (45 Gold)",
      disabled: gold < 45 || unlockedSkills.includes("mana_shield") || getBookCount("shield") > 0,
    },
  ];

  const handleBuy = (itemKey: any) => {
    sound.playDrinkPotion(); // Use friendly action sound
    onBuyItem(itemKey);
  };

  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-4 z-30 font-sans backdrop-blur-md transition-all duration-300 pointer-events-auto">
      {/* Container Box */}
      <div className="w-full max-w-xl bg-[#0e0c11] border-2 border-[#ecc326]/60 rounded-xl shadow-[0_0_40px_rgba(234,179,8,0.2)] overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header bar */}
        <div className="bg-gradient-to-r from-[#1c1811] to-[#0e0c11] px-5 py-4 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-2.5 text-[#ecc326] font-bold text-base tracking-wider uppercase">
            <ShoppingBag className="w-5 h-5 animate-pulse text-yellow-500" />
            <span>TOKO GAME - LEMBAH AETHER</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded text-yellow-400 font-mono text-xs font-extrabold shadow-sm">
              <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>{gold} Gold</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition active:scale-95"
              title="Tutup Toko"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Catalog Items list */}
        <div className="p-5 overflow-y-auto flex-grow flex flex-col gap-3">
          <p className="text-xs text-gray-400 font-medium mb-1.5 italic">
            "Salam petualang! Tukarkan tumpukan koin Gold hasil jarahan monster Anda dengan peranti sihir istimewa kami."
          </p>

          <div className="flex flex-col gap-3">
            {shopItems.map((item) => {
              // Hide mana upgrade or skill books if player has no mana capacity at all (unless they select arch-mage class later)
              if (item.requiresMana && maxMana <= 0) {
                return (
                  <div key={item.id} className="p-3 border border-dashed border-gray-800 text-gray-500 text-[11px] font-mono rounded text-center">
                    🔒 Upgrade Mana +5% Terkunci: Karakter Anda sekarang tidak menggunakan Mana. Ganti ke kelas penyihir (Mage) di menu Pahlawan untuk melatih sihir ini!
                  </div>
                );
              }

              return (
                <div 
                  key={item.id} 
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 border rounded-lg gap-3 transition-colors ${
                    item.disabled ? "border-gray-900 bg-gray-950/20 opacity-60" : "border-gray-800 bg-[#141217]"
                  }`}
                >
                  <div className="flex flex-col gap-1 max-w-sm">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-150">{item.name}</h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${item.color}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>

                  <button
                    disabled={item.disabled}
                    onClick={() => handleBuy(item.id as any)}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider rounded transition active:scale-95 disabled:from-gray-900 disabled:to-gray-900 disabled:text-gray-500 disabled:cursor-not-allowed disabled:scale-100 shadow-md"
                  >
                    {item.buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer controls guide */}
        <div className="bg-[#09080c] px-5 py-3 border-t border-gray-800 text-[10px] text-gray-500 font-mono text-center">
          Belum punya Gold? Bunuh monster bayangan penjarah di Dungeon Episode 2 & 3 untuk mengoleksi koin emas!
        </div>
      </div>
    </div>
  );
};
