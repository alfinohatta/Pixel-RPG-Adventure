/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClassDefinition, NPC, DialogueNode, Position } from "../types";

// Class Categories
export const CLASS_CATEGORIES = {
  MELEE: "Melee (Fisik)",
  RANGED: "Ranged (Jarak Jauh)",
  MAGIC: "Magic (Sihir)",
  STEALTH: "Stealth (Mengendap)",
  SUPPORT: "Support (Penyokong)",
  HYBRID: "Hybrid (Campuran)"
};

// 40 Playable Character Classes as requested
export const CLASS_DEFINITIONS: ClassDefinition[] = [
  // --- MELEE ---
  {
    id: "warrior",
    name: "Warrior",
    description: "Prajurit garda terdepan berkepala dingin, memiliki keseimbangan tinggi antara daya defensif dan ofensif fisik.",
    hp: 120,
    mana: 40,
    attack: 15,
    defense: 12,
    speed: 3.2,
    skills: [
      { name: "Heavy Strike", description: "Tombakan serangan tebasan berat berdaya rusak tinggi", manaCost: 10, damage: 25 },
      { name: "Iron Will", description: "Mengeraskan pertahanan diri, mengurangi damage masuk", manaCost: 15, damage: 0 }
    ],
    spritePath: "player_warrior",
    accentClass: "border-red-500/40 text-red-400 bg-red-950/10",
    emoji: "🛡️"
  },
  {
    id: "knight",
    name: "Knight",
    description: "Ksatria berpelindung baja dengan sumpah perlindungan suci kerajaan.",
    hp: 150,
    mana: 30,
    attack: 12,
    defense: 18,
    speed: 3.0,
    skills: [
      { name: "Shield Slam", description: "Hantaman perisai besi yang membuat musuh terhenti", manaCost: 12, damage: 15 },
      { name: "Provoke", description: "Menarik perhatian ancaman musuh sekitar", manaCost: 8, damage: 5 }
    ],
    spritePath: "player_knight",
    accentClass: "border-slate-500/40 text-slate-300 bg-slate-950/10",
    emoji: "⚔️"
  },
  {
    id: "paladin",
    name: "Paladin",
    description: "Ksatria suci yang mengombinasikan ketahanan pelindung baja dengan sihir penyembuhan cahaya.",
    hp: 140,
    mana: 60,
    attack: 14,
    defense: 15,
    speed: 3.1,
    skills: [
      { name: "Holy Smite", description: "Tebasan cahaya yang melukai musuh dengan kekuatan suci", manaCost: 15, damage: 22 },
      { name: "Lesser Heal", description: "Memulihkan daya hidup menggunakan restu cahaya", manaCost: 15, damage: -25 }
    ],
    spritePath: "player_paladin",
    accentClass: "border-yellow-500/40 text-yellow-300 bg-yellow-950/10",
    emoji: "🌟"
  },
  {
    id: "berserker",
    name: "Berserker",
    description: "Petarung liar yang membiarkan amarah menguasai dirinya demi tebasan berlipat ganda.",
    hp: 110,
    mana: 20,
    attack: 22,
    defense: 6,
    speed: 3.5,
    skills: [
      { name: "Rage Slash", description: "Ayunan kapak membabi buta membakar semangat bertarung", manaCost: 8, damage: 32 },
      { name: "Bloodlust", description: "Meningkatkan daya serang drastis dengan mengorbankan pertahanan", manaCost: 10, damage: 10 }
    ],
    spritePath: "player_berserker",
    accentClass: "border-orange-500/40 text-orange-400 bg-orange-950/10",
    emoji: "🪓"
  },
  {
    id: "gladiator",
    name: "Gladiator",
    description: "Spesialis arena pertarungan berdarah yang unggul dalam duel satu lawan satu.",
    hp: 125,
    mana: 30,
    attack: 16,
    defense: 11,
    speed: 3.3,
    skills: [
      { name: "Disarm Strike", description: "Menyerang titik lemah genggaman senjata lawan", manaCost: 12, damage: 24 },
      { name: "Roar of Victory", description: "Meningkatkan kecepatan gerak dan kegesitan arena", manaCost: 15, damage: 0 }
    ],
    spritePath: "player_gladiator",
    accentClass: "border-amber-700/40 text-amber-500 bg-amber-950/10",
    emoji: "🏟️"
  },
  {
    id: "barbarian",
    name: "Barbarian",
    description: "Prajurit suku pegunungan es berbekal fisik keras serta senjata ganda berdaya hancur tinggi.",
    hp: 135,
    mana: 25,
    attack: 19,
    defense: 8,
    speed: 3.2,
    skills: [
      { name: "Ground Slam", description: "Menghantam tanah membuat gelombang kejut", manaCost: 10, damage: 26 },
      { name: "Primal Cry", description: "Meningkatkan regenerasi HP sementara", manaCost: 12, damage: 0 }
    ],
    spritePath: "player_barbarian",
    accentClass: "border-amber-650/40 text-amber-400 bg-amber-950/10",
    emoji: "🍖"
  },
  {
    id: "spearman",
    name: "Spearman",
    description: "Petarung taktis berbekal tombak panjang untuk menjaga jarak aman dlm pertokoan frontal.",
    hp: 115,
    mana: 35,
    attack: 16,
    defense: 10,
    speed: 3.4,
    skills: [
      { name: "Thrust Cascade", description: "Rentetan tusukan kilat menusuk pertahanan musuh", manaCost: 12, damage: 28 },
      { name: "Vanguard Guard", description: "Menghalau serangan dari depan memakai poros tombak", manaCost: 10, damage: 0 }
    ],
    spritePath: "player_spearman",
    accentClass: "border-sky-450/40 text-sky-300 bg-slate-950/10",
    emoji: "🔱"
  },
  {
    id: "duelist",
    name: "Duelist",
    description: "Petarung anggun bersenjata anggar rapier mengutamakan kecepatan dan tusukan tepat sasaran.",
    hp: 105,
    mana: 40,
    attack: 17,
    defense: 8,
    speed: 3.6,
    skills: [
      { name: "Lunge Precision", description: "Tusukan menusuk jantung pertahanan dalam kedipan mata", manaCost: 10, damage: 27 },
      { name: "Feint Parry", description: "Menghindari serangan lalu membalas seketika", manaCost: 12, damage: 15 }
    ],
    spritePath: "player_duelist",
    accentClass: "border-emerald-450/40 text-emerald-300 bg-emerald-950/10",
    emoji: "🤺"
  },
  {
    id: "samurai",
    name: "Samurai",
    description: "Pendekar pedang timur bersenjatakan Katana pusaka, menjunjung filosofi serangan satu tebasan mematikan.",
    hp: 110,
    mana: 45,
    attack: 20,
    defense: 9,
    speed: 3.5,
    skills: [
      { name: "Iaijutsu Strike", description: "Tebasan kilat mencabut Katana berenergi murni", manaCost: 14, damage: 33 },
      { name: "Inner Calm", description: "Memusatkan pikiran meningkatkan critical rate", manaCost: 10, damage: 0 }
    ],
    spritePath: "player_samurai",
    accentClass: "border-red-400/40 text-red-350 bg-red-950/10",
    emoji: "🏮"
  },
  {
    id: "darkknight",
    name: "Dark Knight",
    description: "Prajurit hitam berselimut kabut kegelapan, mendayai serangan dari luka yang didapat.",
    hp: 130,
    mana: 50,
    attack: 18,
    defense: 13,
    speed: 3.0,
    skills: [
      { name: "Abyssal Slash", description: "Serangan tebasan berdaya kegelapan menghisap HP korban", manaCost: 15, damage: 24 },
      { name: "Shadow Pact", description: "Mengorbankan sedikit HP untuk menambah daya rusak serang", manaCost: 10, damage: 15 }
    ],
    spritePath: "player_darkknight",
    accentClass: "border-indigo-950/80 text-purple-400 bg-[#0e0214]",
    emoji: "🖤"
  },

  // --- RANGED ---
  {
    id: "archer",
    name: "Archer",
    description: "Pemanah lincah berdaya jangkau luas dengan akurasi bidikan tinggi.",
    hp: 95,
    mana: 50,
    attack: 15,
    defense: 7,
    speed: 3.6,
    skills: [
      { name: "Double Shot", description: "Melepaskan dua anak panah berturut-turut pada target", manaCost: 10, damage: 22 },
      { name: "Archers Focus", description: "Meningkatkan kecepatan laju serangan sementara", manaCost: 12, damage: 0 }
    ],
    spritePath: "player_archer",
    accentClass: "border-lime-500/40 text-lime-400 bg-lime-950/10",
    emoji: "🏹"
  },
  {
    id: "hunter",
    name: "Hunter",
    description: "Pemburu belantara penyusun perangkap teritori yang andal melacak kelemahan lawan.",
    hp: 100,
    mana: 55,
    attack: 16,
    defense: 8,
    speed: 3.5,
    skills: [
      { name: "Barbed Arrow", description: "Panah berduri memicu luka pendarahan berkelanjutan", manaCost: 12, damage: 24 },
      { name: "Steel Trap", description: "Peletakan perangkap besi mengikat laju musuh", manaCost: 10, damage: 10 }
    ],
    spritePath: "player_hunter",
    accentClass: "border-emerald-600/40 text-emerald-300 bg-emerald-950/10",
    emoji: "🎒"
  },
  {
    id: "ranger",
    name: "Ranger",
    description: "Penjaga hutan belantara berbekal kelincahan ekstrem melarikan diri dari kepungan.",
    hp: 98,
    mana: 50,
    attack: 17,
    defense: 7,
    speed: 3.8,
    skills: [
      { name: "Wind Walk", description: "Berlari secepat angin melompati rintangan taktis", manaCost: 15, damage: 0 },
      { name: "Poison Arrow", description: "Tembakan panah diolesi racun mematikan daun belantara", manaCost: 12, damage: 26 }
    ],
    spritePath: "player_ranger",
    accentClass: "border-teal-500/40 text-teal-300 bg-teal-980/10",
    emoji: "🌲"
  },
  {
    id: "sniper",
    name: "Sniper",
    description: "Penembak jitu jarak ekstrem, mengorbankan mobilitas untuk satu tembakan pemusnah.",
    hp: 90,
    mana: 60,
    attack: 23,
    defense: 5,
    speed: 3.1,
    skills: [
      { name: "Aether Snipe", description: "Bidikan terkonsentrasi menembus barisan pertahanan", manaCost: 18, damage: 38 },
      { name: "Camouflage", description: "Bersatu dengan alam sekitar, mengurangi deteksi musuh", manaCost: 10, damage: 0 }
    ],
    spritePath: "player_sniper",
    accentClass: "border-sky-500/40 text-sky-300 bg-sky-950/10",
    emoji: "🎯"
  },
  {
    id: "crossbowman",
    name: "Crossbowman",
    description: "Pendayaguna busur silang mekanis berpiston berat, ampuh menghancurkan armor musuh.",
    hp: 105,
    mana: 45,
    attack: 18,
    defense: 9,
    speed: 3.2,
    skills: [
      { name: "Boltdown Bolt", description: "Tembakan anak panah silang berat berdaya tolak mundur", manaCost: 12, damage: 29 },
      { name: "Heavy Loading", description: "Mempersiapkan busur silang menghasilkan ledakan damage", manaCost: 8, damage: 10 }
    ],
    spritePath: "player_crossbowman",
    accentClass: "border-slate-400/40 text-slate-300 bg-slate-900/10",
    emoji: "🔩"
  },
  {
    id: "gunslinger",
    name: "Gunslinger",
    description: "Petarung bergaya modern bersenjatakan pistol mesiu ganda menembakkan rentetan peluru kilat.",
    hp: 96,
    mana: 65,
    attack: 21,
    defense: 6,
    speed: 3.7,
    skills: [
      { name: "Bullet Storm", description: "Hujan peluru beruntun memborbardir area luas mendatar", manaCost: 16, damage: 34 },
      { name: "Quick Draw", description: "Menembak secara spontan sambil bermanuver menghindar", manaCost: 12, damage: 18 }
    ],
    spritePath: "player_gunslinger",
    accentClass: "border-amber-500/40 text-amber-300 bg-[#160d02]",
    emoji: "🤠"
  },

  // --- MAGIC ---
  {
    id: "mage",
    name: "Mage",
    description: "Pengguna kekuatan sihir elemental dasar yang andal memanipulasi energi murni.",
    hp: 85,
    mana: 120,
    attack: 18,
    defense: 5,
    speed: 3.0,
    skills: [
      { name: "Magic Missile", description: "Menembakkan gugusan misil sihir biru murni secara kilat", manaCost: 10, damage: 24 },
      { name: "Mana Shield", description: "Merubah suplai mana menjadi tameng pelindung tubuh", manaCost: 15, damage: 0 }
    ],
    spritePath: "player_mage",
    accentClass: "border-cyan-500/40 text-cyan-400 bg-cyan-950/10",
    emoji: "🔮"
  },
  {
    id: "wizard",
    name: "Wizard",
    description: "Penyihir akademis yang meneliti rahasia mantra agung penghancur masal.",
    hp: 80,
    mana: 140,
    attack: 21,
    defense: 4,
    speed: 2.9,
    skills: [
      { name: "Arcane Blast", description: "Ledakan pusaran kosmis melumatkan target musuh", manaCost: 15, damage: 30 },
      { name: "Disintegrate", description: "Pancaran sinar laser sihir menyala mematikan", manaCost: 20, damage: 36 }
    ],
    spritePath: "player_wizard",
    accentClass: "border-purple-500/40 text-purple-300 bg-purple-950/10",
    emoji: "🧙‍♂️"
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    description: "Penyihir berbakat alami dialiri darah naga kuno memicu insting elemental panas.",
    hp: 90,
    mana: 130,
    attack: 23,
    defense: 5,
    speed: 3.1,
    skills: [
      { name: "Primal Phoenix", description: "Serangan burung api membakar sekeliling arena", manaCost: 18, damage: 34 },
      { name: "Ignite Magic", description: "Menyelemuti diri dlm aura api meningkatkan damage sihir", manaCost: 12, damage: 10 }
    ],
    spritePath: "player_sorcerer",
    accentClass: "border-red-500/40 text-red-400 bg-red-950/10",
    emoji: "🔥"
  },
  {
    id: "warlock",
    name: "Warlock",
    description: "Pengabdi kuil setan pengikat janji kegelapan memicu kutukan pembusukan jiwa.",
    hp: 92,
    mana: 125,
    attack: 20,
    defense: 6,
    speed: 3.0,
    skills: [
      { name: "Corrupt Curse", description: "Kutukan pembusukan menghancurkan regenerasi HP musuh", manaCost: 14, damage: 28 },
      { name: "Hellfire Rain", description: "Hujan meteor api ungu meluncur deras dari kegelapan", manaCost: 20, damage: 35 }
    ],
    spritePath: "player_warlock",
    accentClass: "border-purple-650/40 text-pink-400 bg-[#16021e]",
    emoji: "🌌"
  },
  {
    id: "necromancer",
    name: "Necromancer",
    description: "Pengendali mayat hidup dari kubur, menyerap letupan jiwa yang gugur dlm pertempuran.",
    hp: 88,
    mana: 135,
    attack: 19,
    defense: 6,
    speed: 2.9,
    skills: [
      { name: "Raise Skeleton", description: "Membangkitkan tentara tulang untuk melukai lawan", manaCost: 16, damage: 25 },
      { name: "Death Coil", description: "Proyektil tengkorak beracun menghisap nyawa lawan", manaCost: 15, damage: 28 }
    ],
    spritePath: "player_necromancer",
    accentClass: "border-emerald-600/40 text-emerald-400 bg-emerald-950/10",
    emoji: "💀"
  },
  {
    id: "elementalist",
    name: "Elementalist",
    description: "Empu penguasa empat elemen (Api, Air, Angin, Tanah) secara fleksibel.",
    hp: 86,
    mana: 140,
    attack: 22,
    defense: 5,
    speed: 3.1,
    skills: [
      { name: "Elemental Surge", description: "Penyatuan pilar api-es memecah belah garis lawan", manaCost: 18, damage: 35 },
      { name: "Eartyshield", description: "Tameng batu kokoh menolak pukulan rintangan", manaCost: 12, damage: 0 }
    ],
    spritePath: "player_elementalist",
    accentClass: "border-cyan-400/50 text-amber-300 bg-[#0d1c23]",
    emoji: "🌪️"
  },
  {
    id: "druid",
    name: "Druid",
    description: "Pendeta suci penjaga ekosistem alam, mampu memanggil energi badai kilat semesta.",
    hp: 105,
    mana: 110,
    attack: 16,
    defense: 9,
    speed: 3.2,
    skills: [
      { name: "Wrath of Nature", description: "Akar pohon menjalar mengurung gerakan musuh seketika", manaCost: 14, damage: 25 },
      { name: "Photosynthesis", description: "Penyembuhan berkelanjutan memanfaatkan restu hutan alami", manaCost: 16, damage: -30 }
    ],
    spritePath: "player_druid",
    accentClass: "border-green-600/40 text-green-300 bg-green-950/10",
    emoji: "🍃"
  },
  {
    id: "summoner",
    name: "Summoner",
    description: "Pemanggil makhluk mistis dari dimensi astral penghancur penghalang fisik.",
    hp: 91,
    mana: 130,
    attack: 17,
    defense: 6,
    speed: 3.0,
    skills: [
      { name: "Summon Pixie", description: "Pixie menembakkan percikan lasering sihir beruntun", manaCost: 15, damage: 23 },
      { name: "Astral Portal", description: "Ledakan portal planar melukai musuh di garis lurus", manaCost: 16, damage: 29 }
    ],
    spritePath: "player_summoner",
    accentClass: "border-indigo-500/40 text-indigo-300 bg-indigo-950/10",
    emoji: "🦄"
  },

  // --- STEALTH ---
  {
    id: "rogue",
    name: "Rogue",
    description: "Pencuri licik yang andal bermanuver cepat mengeksploitasi kelalaian target.",
    hp: 100,
    mana: 70,
    attack: 17,
    defense: 7,
    speed: 3.9,
    skills: [
      { name: "Sneak Attack", description: "Serangan tusukan berdaya rusak murni dari kegelapan", manaCost: 10, damage: 29 },
      { name: "Blade Dance", description: "Putaran belati tajam menebas sekeliling area tubuh", manaCost: 12, damage: 22 }
    ],
    spritePath: "player_rogue",
    accentClass: "border-teal-500/40 text-teal-300 bg-teal-950/10",
    emoji: "🗡️"
  },
  {
    id: "assassin",
    name: "Assassin",
    description: "Seniman pembunuhan senyap bersenjata belati beracun, melikuidasi musuh tanpa jejak.",
    hp: 95,
    mana: 75,
    attack: 22,
    defense: 6,
    speed: 4.1,
    skills: [
      { name: "Execution Strike", description: "Tusukan menusuk titik fatal, damage berlipat jika HP rendah", manaCost: 14, damage: 37 },
      { name: "Shadow Meld", description: "Kabut asap instan mematikan tolak pantat deteksi", manaCost: 10, damage: 0 }
    ],
    spritePath: "player_assassin",
    accentClass: "border-red-650/40 text-red-400 bg-slate-950/10",
    emoji: "🥷"
  },
  {
    id: "ninja",
    name: "Ninja",
    description: "Agen rahasia bayangan, menguasai ilmu Shuriken besi dan jurus bayangan ilusi.",
    hp: 98,
    mana: 80,
    attack: 19,
    defense: 7,
    speed: 4.0,
    skills: [
      { name: "Shuriken Toss", description: "Melemparkan bintang Shuriken memotong rintangan", manaCost: 8, damage: 23 },
      { name: "Katon Justu", description: "Membakar area tapak kaki dengan api gulungan ninja", manaCost: 12, damage: 28 }
    ],
    spritePath: "player_ninja",
    accentClass: "border-slate-800/80 text-gray-300 bg-[#070d14]",
    emoji: "🗻"
  },
  {
    id: "shadowwalker",
    name: "Shadow Walker",
    description: "Pengembara bayangan misterius berpijak di antara dimensi materi dan dimensi hantu.",
    hp: 102,
    mana: 85,
    attack: 18,
    defense: 8,
    speed: 3.9,
    skills: [
      { name: "Umbral Shift", description: "Melompat instan menebas musuh di depannya", manaCost: 15, damage: 27 },
      { name: "Darkness Absorption", description: "Memulihkan mana dari goresan bayangan lawan", manaCost: 8, damage: 10 }
    ],
    spritePath: "player_shadowwalker",
    accentClass: "border-purple-900/60 text-purple-300 bg-purple-980/10",
    emoji: "🌌"
  },
  {
    id: "thief",
    name: "Thief",
    description: "Pakar pencuri barang perbekalan mengutamakan perolehan pundi koin emas.",
    hp: 104,
    mana: 65,
    attack: 15,
    defense: 7,
    speed: 3.8,
    skills: [
      { name: "Mug Strike", description: "Merampas koin emas musuh sambil memberi tusukan kecil", manaCost: 10, damage: 20 },
      { name: "Agile Feet", description: "Kecepatan lari meningkat tajam menyelamatkan raga", manaCost: 10, damage: 0 }
    ],
    spritePath: "player_thief",
    accentClass: "border-cyan-600/40 text-cyan-300 bg-cyan-950/10",
    emoji: "💰"
  },

  // --- SUPPORT ---
  {
    id: "priest",
    name: "Priest",
    description: "Pendeta suci berbekal restu dewi cahaya, andal memulihkan kesehatan parah.",
    hp: 100,
    mana: 110,
    attack: 11,
    defense: 8,
    speed: 3.2,
    skills: [
      { name: "Divine Light", description: "Sinar penyembuh memulihkan lukaku sepenuhnya", manaCost: 14, damage: -28 },
      { name: "Purify", description: "Menghapus getaran gaib racun rintangan musuh", manaCost: 10, damage: 10 }
    ],
    spritePath: "player_priest",
    accentClass: "border-cyan-300/40 text-cyan-200 bg-slate-950/20",
    emoji: "⛪"
  },
  {
    id: "cleric",
    name: "Cleric",
    description: "Pendeta bersenjata gada besi pelindung barisan depan, menyelaraskan bantuan dan perlindungan fisik.",
    hp: 118,
    mana: 90,
    attack: 14,
    defense: 12,
    speed: 3.1,
    skills: [
      { name: "Mace Smash", description: "Gempuran gada dibasuh kebenaran melampar target", manaCost: 12, damage: 22 },
      { name: "Divine Barrier", description: "Perisai kokoh menahan 50% damage masuk", manaCost: 15, damage: 0 }
    ],
    spritePath: "player_cleric",
    accentClass: "border-sky-350/50 text-sky-200 bg-sky-950/10",
    emoji: "🛐"
  },
  {
    id: "monk",
    name: "Monk",
    description: "Pertapa suci penyempurna seni pukulan tangan kosong dialiri energi Qi spiritual.",
    hp: 122,
    mana: 80,
    attack: 18,
    defense: 10,
    speed: 3.5,
    skills: [
      { name: "Qi Wave Flush", description: "Ledakan pukulan hawa murni mementalkan sasaran", manaCost: 10, damage: 26 },
      { name: "Meditation Focus", description: "Menghirup napas spiritual memulihkan HP dan MP sekaligus", manaCost: 15, damage: -15 }
    ],
    spritePath: "player_monk",
    accentClass: "border-orange-450/40 text-orange-350 bg-amber-950/10",
    emoji: "🎋"
  },
  {
    id: "bard",
    name: "Bard",
    description: "Sastrawan bersenjatakan kecapi musik suci memanipulasi takdir bertarung lewat lagu.",
    hp: 102,
    mana: 100,
    attack: 13,
    defense: 8,
    speed: 3.4,
    skills: [
      { name: "Requiem Chord", description: "Melodi getaran menyayat pikiran melukai secara masal", manaCost: 12, damage: 22 },
      { name: "Symphony of Grace", description: "Melodi syahdu memulihkan stamina langkah", manaCost: 10, damage: -12 }
    ],
    spritePath: "player_bard",
    accentClass: "border-pink-500/40 text-pink-300 bg-pink-950/10",
    emoji: "🎵"
  },
  {
    id: "shaman",
    name: "Shaman",
    description: "Pendeta kuno suku pedalaman pemanggil totem gaib penyembur elemen alam.",
    hp: 108,
    mana: 105,
    attack: 15,
    defense: 9,
    speed: 3.2,
    skills: [
      { name: "Lightning Totem", description: "Menancapkan pemancar petir menyambar kawan busuk", manaCost: 16, damage: 27 },
      { name: "Spirit Mend", description: "Penyembuhan didampingi roh leluhur mulia", manaCost: 12, damage: -20 }
    ],
    spritePath: "player_shaman",
    accentClass: "border-purple-500/40 text-purple-300 bg-purple-950/10",
    emoji: "👹"
  },
  {
    id: "healer",
    name: "Healer",
    description: "Ahli medis murni berkantong herba murni, mencurahkan segenap jiwa raganya untuk pemulihan.",
    hp: 95,
    mana: 115,
    attack: 10,
    defense: 7,
    speed: 3.3,
    skills: [
      { name: "Rejuvenation Spray", description: "Metode herba cair membasuh seluruh luka raga", manaCost: 12, damage: -32 },
      { name: "Antidote Touch", description: "Sentuhan herba penetral racun berbahaya", manaCost: 8, damage: -10 }
    ],
    spritePath: "player_healer",
    accentClass: "border-teal-400/40 text-teal-300 bg-teal-950/10",
    emoji: "🩹"
  },

  // --- HYBRID ---
  {
    id: "spellblade",
    name: "Spellblade",
    description: "Pendekar pedang berselimut elemen api es, menyelaraskan tebasan tajam dengan sihir proyektil.",
    hp: 112,
    mana: 85,
    attack: 18,
    defense: 10,
    speed: 3.4,
    skills: [
      { name: "Flame Slasher", description: "Pedang berkobar menebarkan percikan api ke depan", manaCost: 12, damage: 29 },
      { name: "Frost Brand", description: "Pedang berlapis es membekukan laju gerak korban", manaCost: 12, damage: 22 }
    ],
    spritePath: "player_spellblade",
    accentClass: "border-cyan-400/50 text-pink-400 bg-indigo-950/10",
    emoji: "⚔️"
  },
  {
    id: "battlemage",
    name: "Battlemage",
    description: "Penyihir berjaket baja pembasmi garis pertahanan depan musuh dengan merapal ledakan masal jarak dekat.",
    hp: 120,
    mana: 95,
    attack: 16,
    defense: 12,
    speed: 3.1,
    skills: [
      { name: "Nova shock", description: "Rilisan cincin listrik berkekuatan masal sekeliling tubuh", manaCost: 15, damage: 28 },
      { name: "Fortify Mana", description: "Mempertebal ketahanan armor didukung cadangan mana", manaCost: 12, damage: 0 }
    ],
    spritePath: "player_battlemage",
    accentClass: "border-indigo-500/40 text-pink-300 bg-indigo-950/10",
    emoji: "🛡️"
  },
  {
    id: "templar",
    name: "Templar",
    description: "Penjaga setia gerbang altar yang membelah kegelapan dengan tombak bercahaya malaikat.",
    hp: 132,
    mana: 75,
    attack: 15,
    defense: 14,
    speed: 3.1,
    skills: [
      { name: "Radiant Lance", description: "Tusukan garis lurus berlapis api suci pembasmi dosa", manaCost: 14, damage: 26 },
      { name: "Guardian Seal", description: "Segel suci memulihkan ketahanan tubuh 20% seketika", manaCost: 12, damage: -15 }
    ],
    spritePath: "player_templar",
    accentClass: "border-amber-400/50 text-amber-200 bg-[#161203]",
    emoji: "⚜️"
  },
  {
    id: "dragonknight",
    name: "Dragon Knight",
    description: "Ksatria perkasa dialiri darah naga merah berkemampuan memancarkan semburan naga.",
    hp: 128,
    mana: 70,
    attack: 21,
    defense: 11,
    speed: 3.3,
    skills: [
      { name: "Dragon Breath", description: "Semburan api naga masif membakar musuh dlm baris luas", manaCost: 15, damage: 32 },
      { name: "Scale Hardening", description: "Mengeraskan kulit naga mengabaikan 8 poin damage lawan", manaCost: 12, damage: 0 }
    ],
    spritePath: "player_dragonknight",
    accentClass: "border-red-650/40 text-orange-400 bg-[#160404]",
    emoji: "🐉"
  },
  {
    id: "arcanewarrior",
    name: "Arcane Warrior",
    description: "Prajurit elitis penari dimensi yang mampumenembus perlindungan fisik menggunakan sabetan berselimut kosmis.",
    hp: 115,
    mana: 90,
    attack: 19,
    defense: 11,
    speed: 3.3,
    skills: [
      { name: "Infinity Slash", description: "Rentetan sabetan kosmis menembus barisan pertahanan", manaCost: 14, damage: 30 },
      { name: "Phase Blink", description: "Menembus ruang untuk menghindari bidikan musuh sekitar", manaCost: 10, damage: 0 }
    ],
    spritePath: "player_arcanewarrior",
    accentClass: "border-purple-550/40 text-cyan-300 bg-teal-980/10",
    emoji: "🌌"
  }
];

// Dialogue Trees for various NPC Roles
export const DIALOGUE_TREES: Record<string, DialogueNode[]> = {
  // Town Mayor
  mayor_town: [
    {
      id: "mayor_init",
      text: "Selamat datang petualang mulia di Rimba Aether! Saya Walikota Roland. Senang melihat pahlawan perkasa hadir di tengah kegentingan.",
      speaker: "Walikota Roland",
      options: [
        { text: "Siapa Anda sebenarnya?", nextNodeId: "mayor_who" },
        { text: "Bagaimana keadaan kota saat ini?", nextNodeId: "mayor_state" },
        { text: "Saya harus melangkah mencari kristal. Sampai jumpa!", nextNodeId: null }
      ]
    },
    {
      id: "mayor_who",
      text: "Saya Roland, pelayan masyarakat desa pelindung hutan ini selama empat puluh tahun. Seluruh warga dan pangeran mempercayakan kesejahteraan padaku.",
      speaker: "Walikota Roland",
      options: [
        { text: "Bagaimana keadaan desa?", nextNodeId: "mayor_state" },
        { text: "Mengerti, walikota. Terima kasih bimbingannya.", nextNodeId: null }
      ]
    },
    {
      id: "mayor_state",
      text: "Tanah berguncang sejak segel Dungeon Lembah Hitam mulai menipis akibat pengaruh Raja Iblis. Kami membutuhkan ksatria bersenjata suci untuk menyelamatkan kita semua!",
      speaker: "Walikota Roland",
      options: [
        { text: "Siapa yang bisa memberi petunjuk dungeon?", nextNodeId: "mayor_clue" },
        { text: "Saya siap bertarung!", nextNodeId: null }
      ]
    },
    {
      id: "mayor_clue",
      text: "Temui Kakek Elrick di sebelah utara jalan setapak, beliau adalah Sage agung yang mengetahui rahasia aktivasi gerbang dimensi suci.",
      speaker: "Walikota Roland",
      options: [
        { text: "Baik Walikota, saya akan segera menemuinya.", nextNodeId: null }
      ]
    }
  ],

  // Blacksmith
  blacksmith_forge: [
    {
      id: "blacksmith_init",
      text: "Wushhh! Hawa perapian membakar baja! Aku Master Barnaby. Butuh senjata berkualitas, ramuan penunjang, atau peningkatan kemampuan barumu?",
      speaker: "Master Barnaby (Blacksmith/Trainer)",
      options: [
        { text: "Buka Toko Jual/Beli Persediaan", nextNodeId: null, action: "open_shop" },
        { text: "Ajari aku skill-skill andalan kelas hero!", nextNodeId: null, action: "open_trainer" },
        { text: "Siapa kamu?", nextNodeId: "blacksmith_who" },
        { text: "Sampai jumpa, Barnaby!", nextNodeId: null }
      ]
    },
    {
      id: "blacksmith_who",
      text: "Aku Barnaby, menempa besi meteorit selama puluhan tahun. Senjata Aether Blade legendaris adalah buatan kakek buyutku sebelum disembunyikan di kuil timur agar tidak terjamah iblis jahat.",
      speaker: "Master Barnaby (Blacksmith/Trainer)",
      options: [
        { text: "Lihat barang daganganmu", nextNodeId: null, action: "open_shop" },
        { text: "Hebat sekali! Sampai jumpa.", nextNodeId: null }
      ]
    }
  ],

  // Trainer
  trainer_monk: [
    {
      id: "trainer_init",
      text: "Pikiran terpadu dengan semesta. Aku Guru Xian, menuntun aliran energi Qi melampaui batas dirimu. Apakah engkau siap melatih skill barumu?",
      speaker: "Master Xian (Suhu Spiritual)",
      options: [
        { text: "Buka Akademi Pelatihan Skill", nextNodeId: null, action: "open_trainer" },
        { text: "Bagaimana cara merilis gelombang sihir?", nextNodeId: "trainer_guide" },
        { text: "Permisi, dewa pertapa.", nextNodeId: null }
      ]
    },
    {
      id: "trainer_guide",
      text: "Kosongkan pikiran, kumpulkan mana sihir dalam rongga tubuhmu, lalu tekan [SPACEBAR] saat pertempuran aktif untuk memicu serangan skill terpilih berdaya hancur dahsyat!",
      speaker: "Master Xian (Suhu Spiritual)",
      options: [
        { text: "Mari latih skill saya!", nextNodeId: null, action: "open_trainer" },
        { text: "Ajaran yang agung. Terima kasih!", nextNodeId: null }
      ]
    }
  ],

  // Guard NPC in Town/Dungeon
  guard_post: [
    {
      id: "guard_init",
      text: "Halt! Daerah di depan dibasahi air raksa dan dikepung monster humanoid lapar. Siapa gerangan dirimu melangkah ke sini?",
      speaker: "Sersan Ken",
      options: [
        { text: "Saya pahlawan terpilih pelindung kerajaan!", nextNodeId: "guard_hero" },
        { text: "Ada ancaman apa saja di luar desa?", nextNodeId: "guard_threats" },
        { text: "Tutup pembicaraan. Sampai jumpa!", nextNodeId: null }
      ]
    },
    {
      id: "guard_hero",
      text: "Pahlawan? Gagah nian jiwamu! Kapten Austin terluka parah di dalam Dungeon Lembah Hitam karena disergap Demon. Ambil Potion andalan ini dngan hati-hati!",
      speaker: "Sersan Ken",
      options: [
        { text: "Tanya tentang ancaman monster", nextNodeId: "guard_threats" },
        { text: "Terima kasih sersan, saya melaju!", nextNodeId: null }
      ]
    },
    {
      id: "guard_threats",
      text: "Di wilayah hutan berkeliaran Bandit, Raider kelaparan, dan Orc pembongkar makam. Di kedalaman dungeon berkeliaran Goblin penjarah, Skeleton busuk, Zombie, hingga iblis Demon Archer penjaga gerbang altar utama!",
      speaker: "Sersan Ken",
      options: [
        { text: "Saya akan melenyapkan mereka semua!", nextNodeId: null }
      ]
    }
  ]
};

// Procedural Sprite colors definition for different character classes ensuring visual distinction
export function getPaletteForClass(classId: string): Record<string, string> {
  const overrides: Record<string, string> = {};
  
  // Custom outfits according to core classes or categories
  switch (classId) {
    case "warrior":
      overrides["b"] = "#b91c1c"; // Red plate armor
      overrides["B"] = "#7f1d1d"; // Dark red highlights
      break;
    case "knight":
      overrides["b"] = "#64748b"; // Steel silver
      overrides["B"] = "#475569"; // Slate gray highlights
      overrides["y"] = "#f1f5f9"; // Platinum crest
      break;
    case "paladin":
      overrides["b"] = "#eab308"; // Golden plate armour
      overrides["B"] = "#ca8a04"; // Rich gold shadow
      overrides["w"] = "#fef08a"; // Sacred yellow hair
      break;
    case "berserker":
      overrides["b"] = "#d97706"; // Bronze leather
      overrides["B"] = "#92400e"; // Dark copper
      overrides["s"] = "#fca5a5"; // Sunburnt reddish skin
      break;
    case "gladiator":
      overrides["b"] = "#854d0e"; // Gladiator bronze plates
      overrides["B"] = "#451a03"; // Dark leather loincloth
      break;
    case "barbarian":
      overrides["b"] = "#7c2d12"; // Fur cloak brown
      overrides["B"] = "#451a03"; // Heavy leather
      break;
    case "spearman":
      overrides["b"] = "#0284c7"; // Aqua guards
      overrides["B"] = "#0369a1"; // Deep ocean highlights
      break;
    case "duelist":
      overrides["b"] = "#be185d"; // Velvet violet rapier outfit
      overrides["B"] = "#831843"; // Deep maroon highlights
      break;
    case "samurai":
      overrides["b"] = "#dc2626"; // Crimson shogun robes
      overrides["B"] = "#111827"; // Midnight black sash
      overrides["y"] = "#fbbf24"; // Brass crest
      break;
    case "darkknight":
      overrides["b"] = "#3b0764"; // Abyssal purple skull plate
      overrides["B"] = "#0f172a"; // Shadow black outline
      overrides["s"] = "#94a3b8"; // Pale ghastly skin
      break;

    // Ranged
    case "archer":
      overrides["b"] = "#65a30d"; // Forest green tunic
      overrides["B"] = "#3f6212"; // Deep moss green shadow
      break;
    case "hunter":
      overrides["b"] = "#15803d"; // Hunter camouflage green
      overrides["B"] = "#14532d"; // Dense leaves shadow
      break;
    case "ranger":
      overrides["b"] = "#0d9488"; // Teal woodranger garb
      overrides["B"] = "#115e59"; // Dark teal shadow
      break;
    case "sniper":
      overrides["b"] = "#0284c7"; // Sky sniper hood
      overrides["B"] = "#0f172a"; // Night goggle grey
      break;
    case "crossbowman":
      overrides["b"] = "#475569"; // Heavy iron gears
      overrides["B"] = "#1e293b"; // Coal shadow
      break;
    case "gunslinger":
      overrides["b"] = "#b45309"; // Sheriff leather brown
      overrides["B"] = "#78350f"; // Dark wooden holster
      break;

    // Magic
    case "mage":
      overrides["b"] = "#2563eb"; // Astral blue wizard robes
      overrides["B"] = "#1e3a8a"; // Ultramarine folds
      break;
    case "wizard":
      overrides["b"] = "#7c3aed"; // Archmage violet robes
      overrides["B"] = "#581c87"; // Royal purple shadow
      break;
    case "sorcerer":
      overrides["b"] = "#ea580c"; // Dragonfire orange robes
      overrides["B"] = "#9a3412"; // Molten crimson shadow
      overrides["y"] = "#fde047"; // Sparking mana yellow
      break;
    case "warlock":
      overrides["b"] = "#ec4899"; // Hellhound hot magenta cloak
      overrides["B"] = "#500730"; // Doom purple shadow
      break;
    case "necromancer":
      overrides["b"] = "#059669"; // Poison shroud jade green
      overrides["B"] = "#064e3b"; // Forest rot dark green
      overrides["s"] = "#cbd5e1"; // Slate undead pale skin
      break;
    case "elementalist":
      overrides["b"] = "#0ea5e9"; // Tempest cyan robe
      overrides["B"] = "#ca8a04"; // Terran yellow sash
      overrides["y"] = "#ef4444"; // Fire red gem
      break;
    case "druid":
      overrides["b"] = "#16a34a"; // Organic forest leaf robe
      overrides["B"] = "#14532d"; // Bark brown shadow
      break;
    case "summoner":
      overrides["b"] = "#6366f1"; // Portal indigo cloak
      overrides["B"] = "#312e81"; // Deep void shroud
      break;

    // Stealth
    case "rogue":
      overrides["b"] = "#0d9488"; // Stealthy teal leather
      overrides["B"] = "#115e59"; // Shadow teal shadow
      break;
    case "assassin":
      overrides["b"] = "#be123c"; // Crimson blood contract jacket
      overrides["B"] = "#1e1b4b"; // Midnight dark indigo slacks
      break;
    case "ninja":
      overrides["b"] = "#1e293b"; // Shinobi dark coal outfit
      overrides["B"] = "#0f172a"; // Invisible shadow cowl
      overrides["s"] = "#fca5a5"; // Masked face flesh
      break;
    case "shadowwalker":
      overrides["b"] = "#4a044e"; // Ethereal dark magenta suit
      overrides["B"] = "#120015"; // Pitch void shadow
      break;
    case "thief":
      overrides["b"] = "#06b6d4"; // Cyan robber scarf
      overrides["B"] = "#0891b2"; // Riverbed stone grey cloak
      break;

    // Support
    case "priest":
      overrides["b"] = "#38bdf8"; // Angel sky blue vestments
      overrides["B"] = "#0284c7"; // Holy cyan border
      overrides["w"] = "#ffffff"; // Altar lace white
      break;
    case "cleric":
      overrides["b"] = "#0284c7"; // Templar blue tunic
      overrides["B"] = "#1e293b"; // Steel scale armor
      break;
    case "monk":
      overrides["b"] = "#ea580c"; // Shaolin saffron dye
      overrides["B"] = "#b45309"; // Muddy orange wraps
      break;
    case "bard":
      overrides["b"] = "#db2777"; // Poet pink tunic
      overrides["B"] = "#9d174d"; // Crimson chord folds
      break;
    case "shaman":
      overrides["b"] = "#4f46e5"; // Witchdoctor indigo drape
      overrides["B"] = "#311042"; // Dark bone shadow
      break;
    case "healer":
      overrides["b"] = "#0d9488"; // Herbal apothecary medical teal
      overrides["B"] = "#134e4a"; // Deep herbal extract shadow
      break;

    // Hybrid
    case "spellblade":
      overrides["b"] = "#2563eb"; // Runecarved sapphire plate
      overrides["B"] = "#db2777"; // Burning ruby gauntlets
      break;
    case "battlemage":
      overrides["b"] = "#6d28d9"; // Heavy amethyst armored mage coat
      overrides["B"] = "#312e81"; // Heavy navy scale underneath
      break;
    case "templar":
      overrides["b"] = "#fbbf24"; // Luminous brass plate
      overrides["B"] = "#1e293b"; // Silver mail rivets
      break;
    case "dragonknight":
      overrides["b"] = "#991b1b"; // Dragon scale plates
      overrides["B"] = "#3c0707"; // Scorched obsidian plate rivets
      overrides["s"] = "#f87171"; // Dragonfire scale skin
      break;
    case "arcanewarrior":
      overrides["b"] = "#1e1b4b"; // Cosmic stellar deep dark plates
      overrides["B"] = "#ec4899"; // Nebular pink glowing seams
      break;
  }
  return overrides;
}

// Hostile NPC and Enemy Presets representing various folders
export const ENEMY_PRESETS = {
  BANDIT: {
    name: "Bandit Perompak",
    role: "enemy" as const,
    spriteType: "bandit",
    hp: 45,
    maxHp: 45,
    attack: 8,
    defense: 4,
    speed: 1.5,
    expReward: 15,
    goldReward: 10,
    interactionRadius: 40,
    chaseRadius: 150,
    dialogues: ["Serahkan koin emasmu, atau hadapi belatiku!"],
    currentDialogueIndex: 0
  },
  RAIDER: {
    name: "Raider Hutan",
    role: "enemy" as const,
    spriteType: "raider",
    hp: 55,
    maxHp: 55,
    attack: 10,
    defense: 3,
    speed: 1.7,
    expReward: 18,
    goldReward: 12,
    interactionRadius: 40,
    chaseRadius: 160,
    dialogues: ["Hutan ini milik Guild Raider! Keluar dari sini!"],
    currentDialogueIndex: 0
  },
  GOBLIN: {
    name: "Goblin Penjarah",
    role: "enemy" as const,
    spriteType: "goblin",
    hp: 35,
    maxHp: 35,
    attack: 7,
    defense: 2,
    speed: 2.2,
    expReward: 12,
    goldReward: 15,
    interactionRadius: 40,
    chaseRadius: 180,
    dialogues: ["Hehehe koin berkilau! Berikan padaku!"],
    currentDialogueIndex: 0
  },
  ORC: {
    name: "Orc Penghancur",
    role: "enemy" as const,
    spriteType: "orc",
    hp: 80,
    maxHp: 80,
    attack: 14,
    defense: 6,
    speed: 1.1,
    expReward: 25,
    goldReward: 18,
    interactionRadius: 45,
    chaseRadius: 130,
    dialogues: ["GRRRAAAHHH! Manusia lemah akan kuhancurkan!"],
    currentDialogueIndex: 0
  },
  SKELETON: {
    name: "Skeleton Archer",
    role: "enemy" as const,
    spriteType: "skeleton",
    hp: 40,
    maxHp: 40,
    attack: 9,
    defense: 5,
    speed: 1.4,
    expReward: 14,
    goldReward: 8,
    interactionRadius: 40,
    chaseRadius: 200,
    dialogues: ["*Sreeek*... Tulang belulang lama bangun berdenting..."],
    currentDialogueIndex: 0
  },
  ZOMBIE: {
    name: "Zombie Pembusuk",
    role: "enemy" as const,
    spriteType: "zombie",
    hp: 65,
    maxHp: 65,
    attack: 11,
    defense: 2,
    speed: 0.8,
    expReward: 16,
    goldReward: 5,
    interactionRadius: 40,
    chaseRadius: 120,
    dialogues: ["Uuuggghhh... Daaaraaahhh segar..."],
    currentDialogueIndex: 0
  },
  DEMON_SOLDIER: {
    name: "Demon Soldier Altar",
    role: "enemy" as const,
    spriteType: "demonsoldier",
    hp: 90,
    maxHp: 90,
    attack: 15,
    defense: 8,
    speed: 1.3,
    expReward: 35,
    goldReward: 25,
    interactionRadius: 40,
    chaseRadius: 160,
    dialogues: ["Semuanya untuk Raja Iblis! Lenyaplah penyusup!"],
    currentDialogueIndex: 0
  }
};

// Generates NPC presets based on current active episode dynamically so players can fight and interact!
export function createEpisodeNPCs(episode: number): NPC[] {
  const list: NPC[] = [];

  if (episode === 1) {
    // Saga NPC with branched dialogues
    list.push({
      id: "sage_1",
      name: "Kakek Elrick",
      x: 8 * 48,
      y: 4 * 48,
      width: 38,
      height: 44,
      direction: "down",
      dialogues: [],
      currentDialogueIndex: 0,
      spriteType: "sage",
      role: "quest",
      questIdTrigger: "q1",
      interactionRadius: 60,
      dialogueTree: [
        {
          id: "sage_init",
          text: "Halo petualang muda! Bahaya besar mengepung Rimba Aether. Raja Iblis di Dungeon bawah tanah sedang bangkit memecah segel kuno peninggalan leluhur.",
          speaker: "Kakek Elrick (Sage Agung)",
          options: [
            { text: "Apa yang harus saya lakukan, Kek?", nextNodeId: "sage_task" },
            { text: "Siapa sebenarnya Raja Iblis itu?", nextNodeId: "sage_lore" },
            { text: "Saya pamit bersiap-siap.", nextNodeId: null }
          ]
        },
        {
          id: "sage_lore",
          text: "Dia adalah Diabolos, kaisar jurang maut yang disegel 500 tahun lalu memakai tiga Kristal Aether suci. Pengaruh kegelapannya mulai mengerogoti ingatan marga hutan dan membangkitkan mayat hidup.",
          speaker: "Kakek Elrick (Sage Agung)",
          options: [
            { text: "Lalu apa tugas saya?", nextNodeId: "sage_task" }
          ]
        },
        {
          id: "sage_task",
          text: "Pergilah melangkah to arah tenggara lembah, temukan dan amankan Kristal Aether suci yang berpendar biru terang! Tanpa energi sucinya, portal dimensi menuju dungeon tidak akan bisa teraliri daya.",
          speaker: "Kakek Elrick (Sage Agung)",
          options: [
            { text: "Baik Kek, saya terima misi ini!", nextNodeId: null, action: "start_quest", actionArg: "q1" }
          ]
        },
        {
          id: "sage_success",
          text: "Luar biasa! Kamu berhasil membawa kembali Kristal Aether suci! Portal dimensi kuno di ujung tenggara kini telah aktif sempurna. Lompatlah ke dalamnya untuk memasuki Dungeon Lembah Hitam!",
          speaker: "Kakek Elrick (Sage Agung)",
          options: [
            { text: "Siap, Kek! Saya melangkah!", nextNodeId: null, action: "complete_quest", actionArg: "q1" }
          ]
        }
      ],
      currentDialogueNodeId: "sage_init"
    });

    // Custom Merchant & Trainer
    list.push({
      id: "blacksmith_1",
      name: "Master Barnaby",
      x: 18 * 48,
      y: 8 * 48,
      width: 38,
      height: 44,
      direction: "left",
      dialogues: [],
      currentDialogueIndex: 0,
      spriteType: "blacksmith",
      role: "merchant",
      interactionRadius: 60,
      dialogueTree: DIALOGUE_TREES.blacksmith_forge,
      currentDialogueNodeId: "blacksmith_init"
    });

    // High Priest Trainer
    list.push({
      id: "trainer_1",
      name: "Suhu Xian",
      x: 12 * 48,
      y: 14 * 48,
      width: 38,
      height: 44,
      direction: "right",
      dialogues: [],
      currentDialogueIndex: 0,
      spriteType: "trainer",
      role: "trainer",
      interactionRadius: 60,
      dialogueTree: DIALOGUE_TREES.trainer_monk,
      currentDialogueNodeId: "trainer_init"
    });

    // Guard Post
    list.push({
      id: "guard_town",
      name: "Sersan Ken",
      x: 34 * 48,
      y: 12 * 48,
      width: 38,
      height: 44,
      direction: "down",
      dialogues: [],
      currentDialogueIndex: 0,
      spriteType: "guard",
      role: "guard",
      interactionRadius: 60,
      dialogueTree: DIALOGUE_TREES.guard_post,
      currentDialogueNodeId: "guard_init"
    });

    // Town Spoke NPC
    list.push({
      id: "mayor_p",
      name: "Walikota Roland",
      x: 42 * 48,
      y: 4 * 48,
      width: 38,
      height: 44,
      direction: "left",
      dialogues: [],
      currentDialogueIndex: 0,
      spriteType: "mayor",
      role: "friendly",
      interactionRadius: 50,
      dialogueTree: DIALOGUE_TREES.mayor_town,
      currentDialogueNodeId: "mayor_init"
    });

    // Spawn 3 Hostile Patrol Enemies in Episode 1 Wilderness to spice things up!
    list.push({
      id: "wild_bandit",
      name: "Bandit Hutan",
      x: 48 * 48,
      y: 6 * 48,
      width: 38,
      height: 44,
      direction: "down",
      dialogues: ["Serahkan koin emasmu, pahlawan amatir!"],
      currentDialogueIndex: 0,
      spriteType: "bandit",
      role: "enemy",
      interactionRadius: 36,
      chaseRadius: 150,
      hp: 45,
      maxHp: 45,
      attack: 10,
      defense: 4,
      speed: 1.4,
      expReward: 15,
      goldReward: 20,
      patrolPoints: [
        { x: 48 * 48, y: 6 * 48 },
        { x: 40 * 48, y: 6 * 48 },
        { x: 40 * 48, y: 10 * 48 },
        { x: 48 * 48, y: 6 * 48 }
      ],
      patrolIndex: 0,
      patrolTimer: 0,
      isDead: false
    });

    list.push({
      id: "wild_goblin",
      name: "Goblin Belantara",
      x: 10 * 48,
      y: 20 * 48,
      width: 36,
      height: 38,
      direction: "right",
      dialogues: ["Keek keek! Ada mangsa gemuk!"],
      currentDialogueIndex: 0,
      spriteType: "goblin",
      role: "enemy",
      interactionRadius: 36,
      chaseRadius: 160,
      hp: 35,
      maxHp: 35,
      attack: 8,
      defense: 2,
      speed: 2.0,
      expReward: 12,
      goldReward: 15,
      patrolPoints: [
        { x: 10 * 48, y: 20 * 48 },
        { x: 22 * 48, y: 20 * 48 },
        { x: 10 * 48, y: 20 * 48 }
      ],
      patrolIndex: 0,
      patrolTimer: 0,
      isDead: false
    });

    list.push({
      id: "wild_orc",
      name: "Raider Orc Besar",
      x: 32 * 48,
      y: 22 * 48,
      width: 44,
      height: 48,
      direction: "left",
      dialogues: ["GRRRAAH! Lenyap dari hadapanku!"],
      currentDialogueIndex: 0,
      spriteType: "orc",
      role: "enemy",
      interactionRadius: 44,
      chaseRadius: 140,
      hp: 75,
      maxHp: 75,
      attack: 13,
      defense: 5,
      speed: 1.0,
      expReward: 25,
      goldReward: 25,
      patrolPoints: [
        { x: 32 * 48, y: 22 * 48 },
        { x: 48 * 48, y: 22 * 48 },
        { x: 32 * 48, y: 22 * 48 }
      ],
      patrolIndex: 0,
      patrolTimer: 0,
      isDead: false
    });
  }

  if (episode === 2) {
    // Guard NPC Capit Austin in Dungeon
    list.push({
      id: "guard_1",
      name: "Kapten Austin",
      x: 28 * 48,
      y: 21 * 48,
      width: 38,
      height: 44,
      direction: "up",
      dialogues: [],
      currentDialogueIndex: 0,
      spriteType: "guard",
      role: "quest",
      questIdTrigger: "q2",
      interactionRadius: 60,
      dialogueTree: [
        {
          id: "guard_init",
          text: "Uhukk... Hati-hati, anak muda! Altar dungeon ini dipenuhi mayat hidup berkelindan merubung jalan masuk.",
          speaker: "Kapten Austin",
          options: [
            { text: "Apa yang membuat Anda terluka parah seperti ini?", nextNodeId: "guard_story" },
            { text: "Bagaimana cara membuka Gerbang Altar di tengah?", nextNodeId: "guard_clue" },
            { text: "Saya permisi melangkah berkeliling sir.", nextNodeId: null }
          ]
        },
        {
          id: "guard_story",
          text: "Kami dikepung oleh Zombie Pemakan Roh dan Skeleton Archer penembak jitu. Mereka melucuti kunciku dan mengunci ketat Gerbang Besi raksasa agar tidak ada pahlawan mendarat menghadang Raja Iblis.",
          speaker: "Kapten Austin",
          options: [
            { text: "Bagaimana cara membuka gerbang besi rintangan?", nextNodeId: "guard_clue" }
          ]
        },
        {
          id: "guard_clue",
          text: "Temukan Kunci Emas di altar utara dungeon, DAN amankan pula senjata legendaris 'Aether Blade' di altar suci sebelah timur (sebelah kananmu dari lorong tengah). Keduanya harus terkumpul demi menyobek perisai iblis!",
          speaker: "Kapten Austin",
          options: [
            { text: "Baik kapten, serahkan segalanya padaku!", nextNodeId: null }
          ]
        }
      ],
      currentDialogueNodeId: "guard_init"
    });

    // Spawn 4 high tier monsters in Episode 2 Dungeon
    list.push({
      id: "dung_skeleton1",
      name: "Mayat Belulang Purba",
      x: 5 * 48,
      y: 5 * 48,
      width: 38,
      height: 44,
      direction: "down",
      dialogues: ["*Klatak klatak*... Penyusup terdeteksi..."],
      currentDialogueIndex: 0,
      spriteType: "skeleton",
      role: "enemy",
      interactionRadius: 36,
      chaseRadius: 180,
      hp: 55,
      maxHp: 55,
      attack: 11,
      defense: 6,
      speed: 1.5,
      expReward: 20,
      goldReward: 15,
      patrolPoints: [
        { x: 5 * 48, y: 5 * 48 },
        { x: 20 * 48, y: 5 * 48 },
        { x: 5 * 48, y: 5 * 48 }
      ],
      patrolIndex: 0,
      isDead: false
    });

    list.push({
      id: "dung_zombie1",
      name: "Zombie Penjaga Kastil",
      x: 45 * 48,
      y: 8 * 48,
      width: 38,
      height: 44,
      direction: "left",
      dialogues: ["Uuuuhhh... Bau manusia... Membakar lapar..."],
      currentDialogueIndex: 0,
      spriteType: "zombie",
      role: "enemy",
      interactionRadius: 36,
      chaseRadius: 150,
      hp: 70,
      maxHp: 70,
      attack: 12,
      defense: 3,
      speed: 1.0,
      expReward: 22,
      goldReward: 10,
      patrolPoints: [
        { x: 45 * 48, y: 8 * 48 },
        { x: 54 * 48, y: 8 * 48 },
        { x: 45 * 48, y: 15 * 48 },
        { x: 45 * 48, y: 8 * 48 }
      ],
      patrolIndex: 0,
      isDead: false
    });

    list.push({
      id: "dung_demon_soldier",
      name: "Tentara Iblis Altar",
      x: 30 * 48,
      y: 5 * 48,
      width: 40,
      height: 46,
      direction: "right",
      dialogues: ["Mati di altar suci ini, pahlawan lemah!"],
      currentDialogueIndex: 0,
      spriteType: "demonsoldier",
      role: "enemy",
      interactionRadius: 40,
      chaseRadius: 170,
      hp: 85,
      maxHp: 85,
      attack: 15,
      defense: 7,
      speed: 1.6,
      expReward: 30,
      goldReward: 25,
      patrolPoints: [
        { x: 30 * 48, y: 5 * 48 },
        { x: 30 * 48, y: 13 * 48 },
        { x: 30 * 48, y: 5 * 48 }
      ],
      patrolIndex: 0,
      isDead: false
    });
  }

  if (episode === 3) {
    // Magic Wizard backup near arena bottom left
    list.push({
      id: "wizard_1",
      name: "Penyihir Jeral",
      x: 8 * 48,
      y: 22 * 48,
      width: 38,
      height: 44,
      direction: "right",
      dialogues: [],
      currentDialogueIndex: 0,
      spriteType: "sage",
      role: "guard",
      interactionRadius: 60,
      dialogueTree: [
        {
          id: "wiz_init",
          text: "Petualang pilihan takdir! Gerbang segel perisai Raja Iblis berdenyut sangat kencang. Aku merapalkan mantra kosmis terakhir untuk mendukung seranganmu!",
          speaker: "Penyihir Jeral",
          options: [
            { text: "Bagaimana cara menghancurkan perisainya, Guru?", nextNodeId: "wiz_tip" },
            { text: "Saya butuh persiapan dagangan terakhir!", nextNodeId: null, action: "open_shop" },
            { text: "Demi kesembuhan seluruh negeri, mari serbu!", nextNodeId: null }
          ]
        },
        {
          id: "wiz_tip",
          text: "Tekan [SPACEBAR] pada papan tombolmu untuk menembakkan BOLA BLASTER CAHAYA AETHER! Energi itu dibasahi roh pedang pusakamu dan menjadi satu-satunya pelumpuh tameng kegelapan miliknya! Bergeraklah berkeliling untuk mengelak bola api neraka masal Diabolos!",
          speaker: "Penyihir Jeral",
          options: [
            { text: "Saya bersiap menyergapnya sekarang!", nextNodeId: null }
          ]
        }
      ],
      currentDialogueNodeId: "wiz_init"
    });
  }

  return list;
}
