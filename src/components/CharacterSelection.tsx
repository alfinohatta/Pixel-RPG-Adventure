/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CharacterClass } from "../types";
import { sound } from "../engine/sound";
import { CLASS_DEFINITIONS, CLASS_CATEGORIES } from "../engine/rpgSystem";
import { X, Users, Heart, Zap, Shield, Swords, ShieldAlert } from "lucide-react";

interface CharacterSelectionProps {
  currentClass: CharacterClass;
  onSelectClass: (newClass: CharacterClass) => void;
  onClose: () => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  currentClass,
  onSelectClass,
  onClose,
}) => {
  // Category tabs
  const [activeCategory, setActiveCategory] = useState<string>("MELEE");

  // Get active tab definitions
  const categories = Object.keys(CLASS_CATEGORIES) as Array<keyof typeof CLASS_CATEGORIES>;

  const filteredClasses = CLASS_DEFINITIONS.filter((cls) => {
    const cid = cls.id;
    if (activeCategory === "MELEE") {
      return ["warrior", "knight", "paladin", "berserker", "gladiator", "barbarian", "spearman", "duelist", "samurai", "darkknight"].includes(cid);
    }
    if (activeCategory === "RANGED") {
      return ["archer", "hunter", "ranger", "sniper", "crossbowman", "gunslinger"].includes(cid);
    }
    if (activeCategory === "MAGIC") {
      return ["mage", "wizard", "sorcerer", "warlock", "necromancer", "elementalist", "druid", "summoner"].includes(cid);
    }
    if (activeCategory === "STEALTH") {
      return ["rogue", "assassin", "ninja", "shadowwalker", "thief"].includes(cid);
    }
    if (activeCategory === "SUPPORT") {
      return ["priest", "cleric", "monk", "bard", "shaman", "healer"].includes(cid);
    }
    if (activeCategory === "HYBRID") {
      return ["spellblade", "battlemage", "templar", "dragonknight", "arcanewarrior"].includes(cid);
    }
    return false;
  });

  const handleSelect = (clsId: string) => {
    sound.playSelectCharacter(); // Play nice selection chime sound
    onSelectClass(clsId);
  };

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-3 z-30 font-sans backdrop-blur-md transition-all duration-300 pointer-events-auto">
      {/* Container Box */}
      <div className="w-full max-w-2xl bg-[#0a090d] border-2 border-cyan-500/60 rounded-xl shadow-[0_0_40px_rgba(6,182,212,0.35)] overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header bar */}
        <div className="bg-gradient-to-r from-[#0d171d] to-[#040406] px-5 py-3 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm tracking-wider uppercase">
            <Users className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span>KEDAI PAHLAWAN KERAJAAN (PILIH 40 KELAS)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition active:scale-95 cursor-pointer"
            title="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap gap-1 p-2 bg-[#050508] border-b border-gray-850 shrink-0">
          {categories.map((catKey) => {
            const isSelected = activeCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => {
                  sound.playPickup();
                  setActiveCategory(catKey);
                }}
                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                    : "bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {CLASS_CATEGORIES[catKey]}
              </button>
            );
          })}
        </div>

        {/* Character options body */}
        <div className="p-4 overflow-y-auto flex-grow flex flex-col gap-3 scrollbar-thin">
          <div className="text-[11px] text-gray-400 leading-relaxed bg-slate-950/40 p-2.5 rounded border border-gray-900">
            Dunia ini terguncang oleh letupan energi iblis. Pilih salah satu dari <span className="text-cyan-400 font-bold">40 Kelas Pahlawan</span> unik! Setiap kelas memiliki sebaran statistik HP, Mana (MP), daya serang fisik/sihir, perlindungan armor (defense), kecepatan gerak bebas, serta dua skill khusus yang dipelajari di kuil.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
            {filteredClasses.map((cls) => {
              const isSelected = currentClass === cls.id;
              return (
                <div 
                  key={cls.id}
                  className={`border rounded-lg p-3 transition-all text-left flex flex-col justify-between ${
                    isSelected 
                      ? "bg-cyan-950/20 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]" 
                      : "bg-[#100f13] border-gray-850 hover:border-slate-800"
                  }`}
                >
                  <div>
                    {/* Icon & Name */}
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg bg-slate-950 p-1.5 rounded border border-gray-800/80">{cls.emoji}</span>
                        <div>
                          <h4 className="text-xs font-black text-white uppercase tracking-wide">{cls.name}</h4>
                          <span className="text-[9px] text-gray-500 font-mono">Kelas: {cls.id}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="bg-cyan-500/20 text-cyan-300 font-mono text-[8px] font-bold px-1 rounded border border-cyan-500/30">
                          Aktif
                        </span>
                      )}
                    </div>

                    {/* Stats mini bar Grid */}
                    <div className="grid grid-cols-2 gap-1 mb-2.5 bg-black/40 p-2 rounded text-[10px] font-mono">
                      <div className="flex items-center gap-1 text-red-400">
                        <Heart className="w-3 h-3 shrink-0" />
                        <span>HP: <b>{cls.hp}</b></span>
                      </div>
                      <div className="flex items-center gap-1 text-sky-450">
                        <Zap className="w-3 h-3 shrink-0" />
                        <span>MP: <b>{cls.mana}</b></span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-400">
                        <Swords className="w-3 h-3 shrink-0" />
                        <span>ATK: <b>{cls.attack}</b></span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Shield className="w-3 h-3 shrink-0" />
                        <span>DEF: <b>{cls.defense}</b></span>
                      </div>
                      <div className="col-span-2 text-[9px] text-emerald-400 pt-0.5 border-t border-gray-850">
                        ⚡ SPD: <b>{cls.speed.toFixed(1)}</b> unit
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-gray-300 leading-relaxed mb-2.5 min-h-[44px]">
                      {cls.description}
                    </p>

                    {/* Skills list preview */}
                    <div className="bg-black/20 p-2 rounded border border-gray-900/60 mb-3 text-[10px]">
                      <div className="text-[9px] font-bold text-yellow-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-yellow-500" />
                        <span>Gaya & Skill Bawaan:</span>
                      </div>
                      <div className="flex flex-col gap-1 text-gray-400">
                        {cls.skills.map((sk, sidx) => (
                          <div key={sidx} className="flex justify-between items-center bg-[#070609] p-1 rounded">
                            <span className="font-bold text-gray-200">⚔️ {sk.name}</span>
                            <span className="text-sky-400 text-[8px]">-{sk.manaCost} MP / {sk.damage > 0 ? `${sk.damage} ATK` : `${Math.abs(sk.damage)} HEAL`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-900/80 flex justify-end">
                    {!isSelected ? (
                      <button
                        onClick={() => handleSelect(cls.id)}
                        className="w-full px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold uppercase text-[9px] tracking-wide rounded transition active:scale-95 cursor-pointer text-center"
                      >
                        PILIH HERO INI
                      </button>
                    ) : (
                      <span className="text-[9px] font-bold text-cyan-400 font-mono flex items-center gap-1">✓ Karakter Utama</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer controls guide */}
        <div className="bg-[#040406] px-5 py-2.5 border-t border-gray-850 text-[9px] text-gray-500 font-mono text-center">
          Ubah pahlawan kapan saja tanpa kehilangan progres quest atau koin emas terkumpul!
        </div>
      </div>
    </div>
  );
};
