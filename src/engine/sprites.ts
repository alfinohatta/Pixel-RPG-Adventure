/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Palette defining colors used in Pixel RPG Art
export const PALETTE: Record<string, string> = {
  ".": "transparent",
  "k": "#0d080d", // Dark outline / shadows
  "w": "#ffffff", // Pure white
  "s": "#e0dbcd", // Silver / skin light
  "f": "#f1b29a", // Skin tone
  "b": "#3273c5", // Player primary blue
  "B": "#123071", // Player dark blue shadow / pants
  "y": "#fccf3a", // Rich gold / yellow
  "o": "#e66827", // Orange (potion glowing, lava, hair)
  "r": "#c11b1b", // Red (potion, boss, guard crest)
  "R": "#7c111c", // Dark red / blood shadow
  "g": "#3ea643", // Grass / merchant tunic green
  "G": "#1e5e22", // Forest dark green
  "p": "#d25de2", // Purple
  "P": "#741d8e", // Dark purple shadow
  "c": "#2ee1ff", // Cyan (Aether crystal, water portal)
  "C": "#007ea4", // Dark cyan shadow
  "z": "#8d9ca4", // Stone gray
  "Z": "#3b4d57", // Charcoal outline / stone shadow
  "t": "#a85d38", // Trunk brown
  "T": "#5c2a18", // Dark brown shadow
};

// 16x16 Pixel grids for different sprites
// . = transparent, others map to PALETTE keys

const SPRITES = {
  // PLAYER - FRONT IDLE
  player_down_idle: [
    "....kkkkkkk.....",
    "...kbbbbbbbk....",
    "..kbbwbbbwbk....",
    "..kbffbbffbk....",
    "..kbfffffffbk...",
    "..kfffffffffk...",
    "..kffkfffkffk...",
    "...kkfffffkk....",
    "....kTTTTTk.....",
    "...kbbbbbbbk....",
    "...kbbbbbbbk....",
    "..kBbbbbbbbBk...",
    "..kBbbbbbbbBk...",
    "..kKKKKKKKKKk...",
    "...kZk...kZk....",
    "....k.....k....."
  ],
  // PLAYER - FRONT WALK FRAME 1
  player_down_walk_1: [
    "....kkkkkkk.....",
    "...kbbbbbbbk....",
    "..kbbwbbbwbk....",
    "..kbffbbffbk....",
    "..kbfffffffbk...",
    "..kfffffffffk...",
    "..kffkfffkffk...",
    "...kkfffffkk....",
    "....kTTTTTk.....",
    "...kbbbbbbbk....",
    "..kbbbbbbbbk....",
    "..kBbbbbbbbBk...",
    "..kBbbbbbbbBk...",
    "..kkkkKKKKKKk...",
    "....kZk...kZk...",
    ".....k.....k...."
  ],
  // PLAYER - FRONT WALK FRAME 2
  player_down_walk_2: [
    "....kkkkkkk.....",
    "...kbbbbbbbk....",
    "..kbbwbbbwbk....",
    "..kbffbbffbk....",
    "..kbfffffffbk...",
    "..kfffffffffk...",
    "..kffkfffkffk...",
    "...kkfffffkk....",
    "....kTTTTTk.....",
    "...kbbbbbbbk....",
    "...kbbbbbbbbk...",
    "..kBbbbbbbbBk...",
    "..kBbbbbbbbBk...",
    "..kKKKKKKkkkk...",
    "...kZk...kZk....",
    "....k.....k....."
  ],

  // PLAYER - BACK IDLE
  player_up_idle: [
    "....kkkkkkk.....",
    "...kbbbbbbbk....",
    "..kbbbbbbbbbk...",
    "..kbbbbbbbbbk...",
    "..kbbbbbbbbbk...",
    "..kbbbbbbbbbk...",
    "..kbbbbbbbbbk...",
    "...kkbbbbbk.....",
    "....kKKKKKk.....",
    "...kTTTTTTTk....",
    "...kTTTTTTTk....",
    "..kBbbbbbbbBk...",
    "..kBbbbbbbbBk...",
    "..kKKKKKKKKKk...",
    "...kZk...kZk....",
    "....k.....k....."
  ],
  
  // PLAYER - LEFT IDLE
  player_left_idle: [
    ".....kkkkkk.....",
    "....kbbbbbbk....",
    "...kbbbwbbbk....",
    "...kbbfffbbk....",
    "...kbffffffbk...",
    "...kbffffffbk...",
    "...kbffkfffk....",
    "....kkfffkk.....",
    ".....kTTk.......",
    "....kbbbbk......",
    "....kbbbbk......",
    "...kBbbbBk......",
    "...kBbbbBk......",
    "...kKKKKKk......",
    "....kZk.kZk.....",
    ".....k...k......"
  ],

  // SAGE NPC (Old Wise Man with white beard and grey cloak)
  sage_down: [
    "....kkkkkk......",
    "...kzzzzzzk.....",
    "..kzzzfzzzzk....",
    "..kzzfffzzzk....",
    "..kzffffffbkk...",
    "..kzffkkffbkyk..",
    "..kzwwwkwwkyk...",
    "...kwwwwwkkyk...",
    "....kwwwwwwky...",
    "...kzzzzzzzk....",
    "..kzzzzzzzzzk...",
    "..kzzzzzzzzzk...",
    ".kZzzzzzzzzzZk..",
    ".kZKKKKKKKKKZk..",
    "..kZk.....kZk...",
    "...k.......k...."
  ],

  // MERCHANT NPC (Green vest, yellow hat)
  merchant_down: [
    "....kkkkkkk.....",
    "...kyyyyyyyk....",
    "..kyywyywywk....",
    "..kyffffffyk....",
    "..kyfffffffk....",
    "..kfffffffffk...",
    "..kffkfffkffk...",
    "...kkfffffkk....",
    "....kTTTTTk.....",
    "...kgggggggk....",
    "..kgggggggggk...",
    "..kGgggggggGk...",
    "..kGgggggggGk...",
    "..kKKKKKKKKKk...",
    "...kTk...kTk....",
    "....k.....k....."
  ],

  // GUARD NPC (Steel Plate Mail Armour with Red Crest helmet)
  guard_down: [
    "....kkrrrrk.....",
    "...kkkrrrrkk....",
    "...kzzzzzzzk....",
    "..kzzzzzzzzzk...",
    "..kzzwzzzwzzk...",
    "..kzffffffzzk...",
    "..kzffkkffzzk...",
    "...kkfffffkk....",
    "....kzzzzzk.....",
    "...kzzzzzzzk....",
    "..kzzzzzzzzzk...",
    "..kZzzzzzzzZk...",
    "..kZzzzzzzzZk...",
    "..kKKKKKKKKKk...",
    "...kZk...kZk....",
    "....k.....k....."
  ],

  // ITEMS
  crystal: [
    "......kk......",
    ".....kcck.....",
    "....kccwwk....",
    "....kcccwk....",
    "...kcccccwk...",
    "...kcccccck...",
    "...kcccccck...",
    "....kcccck....",
    "....kcccZk....",
    ".....kcZk.....",
    "......kk......",
    "..............",
    "..............",
    "..............",
    "..............",
    ".............."
  ],

  potion: [
    "......kk......",
    ".....kywk.....",
    ".....ktak.....",
    "....kkkkkk....",
    "...krowwwrk...",
    "..kroooowwwrk.",
    "..krooooowwrk.",
    "..kroooooorrk.",
    "..kRrooooorrk.",
    "...kRrrrrrkk..",
    "....kkkkkk....",
    "..............",
    "..............",
    "..............",
    "..............",
    ".............."
  ],

  key: [
    ".....kkkk.....",
    "....kyyyyk....",
    "...kyywyyyk...",
    "...kyw.wwyk...",
    "...kyw.wwyk...",
    "....kyyyyk....",
    ".....kyyk.....",
    ".....kyyk.....",
    ".....kyyk.....",
    ".....kyyyk....",
    ".....kyyk.....",
    ".....kyyyk....",
    ".....kyyk.....",
    "......kk......",
    "..............",
    ".............."
  ],

  gold_pile: [
    "......kk......",
    ".....kyyk.....",
    "....kywwyk....",
    "...kywyywyk...",
    "..kywyyyywyk..",
    "..kyyyyyyyyk..",
    "..kyyyyyyyyk..",
    "...kyyyyyyk...",
    "....kyyyyk....",
    ".....kyyk.....",
    "......kk......",
    "..............",
    "..............",
    "..............",
    ".............."
  ],
  
  legendary_weapon: [
    ".......kk.......",
    "......kcck......",
    "......kccwk.....",
    ".....kccwwk.....",
    ".....kccwwk.....",
    ".....kccwwk.....",
    ".....kccwwk.....",
    ".....kccwwk.....",
    "......kccwk.....",
    ".....kyyyyk.....",
    "......ktkk......",
    "......ktkk......",
    ".......kk.......",
    "................",
    "................",
    "................"
  ],

  skill_book_fireball: [
    "....kkkkkk....",
    "...kooooowk...",
    "..kooooowwk...",
    "..kooowwwyk...",
    ".koowwyyyyk...",
    ".koooryyyyk...",
    ".koorryyyyk...",
    ".korrryyyyk...",
    "..krrryyyk....",
    "...krrrykk....",
    "....kkkkk.....",
    "..............",
    "..............",
    "..............",
    ".............."
  ],

  skill_book_heal: [
    "....kkkkkk....",
    "...kgggggwk...",
    "..kgggggwwk...",
    "..kgggwvwyk...",
    ".kggwwyyyyk...",
    ".kgggrryyyk...",
    ".kggrrryyyk...",
    ".kgrrrryyyk...",
    "..krrryyyk....",
    "...krrrykk....",
    "....kkkkk.....",
    "..............",
    "..............",
    "..............",
    ".............."
  ],

  skill_book_shield: [
    "....kkkkkk....",
    "...kbbbbbwk...",
    "..kbbbbbwwk...",
    "..kbbbwvwyk...",
    ".kbwbbyyyyk...",
    ".kbbcccyyyk...",
    ".kbccccyyyk...",
    ".kcccccyyyk...",
    "..kcccyyyk....",
    "...kcccykk....",
    "....kkkkk.....",
    "..............",
    "..............",
    "..............",
    ".............."
  ],

  // WORLD ITEMS / OBSTACLES
  tree: [
    "......kk......",
    ".....kGgGk....",
    "....kGgggGk...",
    "....kgggggk...",
    "...kGgggggGk..",
    "..kGgggggggGk.",
    "..kgggggggggk.",
    ".kGgggggggggGk",
    ".kGgggggggggGk",
    "..kkkGgGkkk...",
    ".....kttk.....",
    ".....kttk.....",
    "....kTTtTk....",
    "....kTTtTk....",
    "....kKKKKk....",
    ".............."
  ],

  stone: [
    "..............",
    "......kkkk....",
    "....kkzzzzkk..",
    "...kzzzzzzzzk.",
    "..kzzwwzzzzzzk",
    ".kzzzwzzzzzzzk",
    ".kzzzwzzzzzzZk",
    "kzzzzzzzzzzzZk",
    "kzzzzzzzzzzzZk",
    "kZzzzzzzzzzzZk",
    "kZzzzzzzzzzZZk",
    ".kZZZZZZZZZZk.",
    "..kKKKKKKKKk..",
    "..............",
    "..............",
    ".............."
  ],

  // PORTAL
  portal: [
    "....kkkkkk....",
    "..kkccccwwkk..",
    ".kccccwwwwwwk.",
    "kcccwwkkkkwwck",
    "kccwwkk..kkwck",
    "kccwkk....kkwk",
    "kcwkk......kwk",
    "kwk........kwk",
    "kwk........kwk",
    "kcwkk......kwk",
    "kccwkk....kkwk",
    "kccwwkk..kkwck",
    "kcccwwkkkkwwck",
    ".kccccwwwwwwk.",
    "..kkccccwwkk..",
    "....kkkkkk...."
  ],

  // BOSS (DEMON)
  boss_idle_1: [
    "....kkkkkkkRkkkkkkk.....",
    "...kRRorrorrooRorrrk....",
    "..kRrorrrooorrorrroRk...",
    ".kRrorrrooorrrorkrorrk..",
    ".kRrokkkrorrrorkorkorRk.",
    "kRrywwyyrrrrkkkywwyyrRk.",
    "kRrywkyyrrrkkkkywkyyrRk.",
    "kRrywwyyrrrrrrrywwyyrRk.",
    "kRrkkkkkrrrrrrrkkkkkrRk.",
    "kRrrrrrrrrrrrrrrrrrrrRk.",
    "kRrrrrrrrrkkkrrrrrrrrRk.",
    ".kRrrrrrrkkkkkrrrrrrRk..",
    ".kRRrrrrrkkkkkrrrrrRRk..",
    "..kRRrrrrkkkkkrrrrRRk...",
    "...kkkRrrrrrrrrrRkkk....",
    ".....kkkkkkRkkkkkk......",
    ".....kRRRkk.kkRRRk......",
    "....kRrrRk...kRrrRk.....",
    "....kRrRk.....kRrRk.....",
    "....kKKk.......kKKk....."
  ],
  boss_idle_2: [
    "....kkkkkkkRkkkkkkk.....",
    "...kRRorrorrooRorrrk....",
    "..kRrorrrooorrorrroRk...",
    ".kRrorrrooorrrorkrorrk..",
    ".kRrokkkrorrrorkorkorRk.",
    "kRrywwyyrrrrkkkywwyyrRk.",
    "kRrywkyyrrrkkkkywkyyrRk.",
    "kRrywwyyrrrkrrrywwyyrRk.",
    "kRrkkkkkrrrrrrrkkkkkrRk.",
    "kRrrrrrrooooorrrrrrrrRk.",
    "kRrrrrrrokkkorrrrrrrrRk.",
    ".kRrrrrrkkkkkrrrrrrrRk..",
    ".kRRrrrrkkkkkrrrrrrRRk..",
    "..kRRrrkkkkkkkrrrrRRk...",
    "...kkkRrrrrrrrrrRkkk....",
    ".....kkkkkkRkkkkkk......",
    ".....kRRRkk.kkRRRk......",
    "....kRrrRk...kRrrRk.....",
    "....kRrRk.....kRrRk.....",
    "....kKKk.......kKKk....."
  ],
  boss_hurt: [
    "....kkkkkkkRkkkkkkk.....",
    "...kwworrorrooRorwwk....",
    "..kwrorrrooorrorrrowk...",
    ".kwrorrrooorrrorkrowwk..",
    ".kwrokkkrorrrorkorkowwk.",
    "kwrywwyyrrrrkkkywwyywkk.",
    "kwrywkyyrrrkkkkywkyywkk.",
    "kwrywwyyrrrrrrrywwyywwk.",
    "kwrkkkkkrrrrrrrkkkkkwwk.",
    "kwwowowowowowowowowowwk.",
    "kwwwwwwwwkkkwwwwwwwwwwk.",
    ".kwwwwwwkkkkkwwwwwwwwk..",
    ".kWWwwwwkkkkkwwwwwwWWk..",
    "..kWWwwwwkkkkwwwwWWWk...",
    "...kkkWWwwwwwwwwWWkk....",
    ".....kkkkkkWkkkkkk......",
    ".....kWWWkk.kkWWWk......",
    "....kWWwWk...kWWwWk.....",
    "....kWwWk.....kWwWk.....",
    "....kKKk.......kKKk....."
  ],
  king: [
    "....kyyyyyk.....",
    "...kywyywywyk...",
    "..kyfffffyffyk..",
    "..kfffffffffk...",
    "..kffkfffkffk...",
    "...kkfffffkk....",
    "....kpppppkk....",
    "...kpppppppk....",
    "..kpppppppppk...",
    "..kpppppppppk...",
    "..kZk.....kZk...",
    "...k.......k...."
  ],
  queen: [
    "....ksssssk.....",
    "...kswsswswsk...",
    "..ksfffffffffk..",
    "..kfffffffffk...",
    "..kffkfffkffk...",
    "...kkfffffkk....",
    "....kccccckk....",
    "...kccwccwcck...",
    "..kccccccccck...",
    "..kccccccccck...",
    "..kZk.....kZk...",
    "...k.......k...."
  ],
  mayor: [
    "....kkkkkkk.....",
    "...ktttttttk....",
    "..ktffffffffkt..",
    "..kfffffffffk...",
    "..kffkfffkffk...",
    "...kkfffffkk....",
    "....kZZZZZk.....",
    "...kZbbbbbZk....",
    "..kZbbbbbbbZk...",
    "..kZbbbbbbbZk...",
    "..kZk.....kZk...",
    "...k.......k...."
  ],
  farmer: [
    "....kyyyyyk.....",
    "...kyyyyyyyk....",
    "..kfffffffffk...",
    "..kfffffffffk...",
    "..kffkfffkffk...",
    "...kkfffffkk....",
    "....ktttttTk....",
    "...ktGGGGGtk....",
    "..ktGGGGGGGtk...",
    "..ktGGGGGGGtk...",
    "..kTk.....kTk...",
    "...k.......k...."
  ],
  blacksmith: [
    ".....kkkkkk.....",
    "....kZZZZZZk....",
    "...kZZffffZZk...",
    "...kffffffffk...",
    "...kffkfffkfkk..",
    "....kkfffffkk...",
    ".....kTTTTTk....",
    "....kTZzzzzTkk..",
    "....kTZzzzzTkyk.",
    "...kZzzzzzzzZyk.",
    "....kTk...kTk...",
    ".....k.....k...."
  ],
  alchemy: [
    "......kk......",
    ".....kcck.....",
    "....kcccck....",
    "...kcccccck...",
    "..kccffffcck..",
    "..kfffffffffk.",
    "..kffkfffkffk.",
    "...kkfffffkk..",
    "....kPPPPPk...",
    "...kPPPPPPPk..",
    "...kPPPPPPPk..",
    "....kPk...kPk."
  ],
  bandit: [
    "....kkkkkkk.....",
    "...kZZZZZZZk....",
    "..kZZwZZZwZZk...",
    "..kZfrrrrffZk...",
    "..kzrrrrrrfzk...",
    "..kzffffffbkk...",
    "..kzffkkffbkyk..",
    "...kkfffffkky...",
    "....kZZZZZk.....",
    "...kZZZZZZZk....",
    "..kZZZZZZZZZk...",
    "..kKKKKKKKKKk..."
  ],
  goblin: [
    "....kgggggk.....",
    "...kgggggggk....",
    "..kggfgggfggk...",
    "..kgfffffffgk...",
    "..kgffkffkfgk...",
    "...kffffffk.....",
    "....kgggggk.....",
    "...kgyyyyyyk....",
    "..kgyyyyyyyyk...",
    "..kgyyyyyyyyk...",
    "...kKK...kKK...."
  ],
  orc: [
    ".....kkkkkk.....",
    "....kGGGGGGk....",
    "...kGGGGGGGGk...",
    "..kGGwGGGwGGk...",
    "..kGGGGGGGGGGk..",
    "..kGGkGGGGkGGk..",
    "...kkGGGGGkk....",
    "....kTTTTTk.....",
    "...kTTTTTTTk....",
    "..kTTTTTTTTTk...",
    "..kTTTTTTTTTk...",
    "...kKK...kKK...."
  ],
  skeleton: [
    "....ksssssk.....",
    "...ksssssssk....",
    "..ksskskskssk...",
    "..ksssssssssk...",
    "..ksskssskssk...",
    "...kkssssskk....",
    "....ksssssk.....",
    "...ksssssssk....",
    "..ksssssssssk...",
    "..ksssssssssk...",
    "...kZk...kZk...."
  ],
  zombie: [
    "....kGGGGGk.....",
    "...kGGGGGGGk....",
    "..kGGkGGkGGgk...",
    "..kGGGGGGGGgk...",
    "..kGGkGkGGkgk...",
    "...kkGGGGGkk....",
    "....kPPPPPk.....",
    "...kPPPPPPPk....",
    "..kPPPPPPPPPk...",
    "..kPPPPPPPPPk...",
    "...kZk...kZk...."
  ],
  demonsoldier: [
    "....kkrrrkk.....",
    "...kkrrrrrkk....",
    "..kkkRRRkRRkk...",
    "..kkffffffkkk...",
    "..kkffkkffkkk...",
    "...kkfffffkk....",
    "kRRZkkkkkkkZRRk.",
    "kRRkkkkkkkkkRRk.",
    ".kRRRRRRRRRRRk..",
    "..kKKKKKKKKKk...",
    "...kTk...kTk...."
  ]
};

// Draw a pixel grid sprite to canvas context
export function drawPixelSprite(
  ctx: CanvasRenderingContext2D,
  spriteName: keyof typeof SPRITES | string,
  px: number,
  py: number,
  width: number,
  height: number,
  options: {
    flipX?: boolean;
    shadow?: boolean;
    glow?: boolean;
    glowColor?: string;
    paletteOverride?: Record<string, string>;
  } = {}
) {
  let grid = SPRITES[spriteName as keyof typeof SPRITES];
  if (!grid) {
    // If a walking frame isn't found, try falling back to the direction's idle frame
    if (spriteName.endsWith("_walk_1") || spriteName.endsWith("_walk_2")) {
      const baseKey = spriteName.substring(0, spriteName.indexOf("_walk_")) + "_idle";
      grid = SPRITES[baseKey as keyof typeof SPRITES];
    }
  }

  // Fallback for stripped suffixes (e.g. blacksmith_down -> blacksmith, bandit_down -> bandit, etc.)
  if (!grid) {
    let cleanName = spriteName;
    const suffixes = ["_down", "_up", "_left", "_right", "_idle", "_walk_1", "_walk_2"];
    for (const suffix of suffixes) {
      if (cleanName.endsWith(suffix)) {
        cleanName = cleanName.substring(0, cleanName.length - suffix.length);
      }
    }
    
    if (cleanName === "trainer") {
      cleanName = "alchemy";
    }

    grid = SPRITES[cleanName as keyof typeof SPRITES];
  }

  if (!grid) {
    // If right direction is not found, dynamically map to left frame with horizontal flip
    if (spriteName.startsWith("player_right")) {
      const leftKey = spriteName.replace("player_right", "player_left");
      options.flipX = !options.flipX;
      grid = SPRITES[leftKey as keyof typeof SPRITES];
      if (!grid && (leftKey.endsWith("_walk_1") || leftKey.endsWith("_walk_2"))) {
        const leftBaseKey = leftKey.substring(0, leftKey.indexOf("_walk_")) + "_idle";
        grid = SPRITES[leftBaseKey as keyof typeof SPRITES];
      }
    }
  }

  if (!grid && spriteName.startsWith("player_")) {
    // Last-resort fallback for player character to always display something valid (idle facing front)
    grid = SPRITES.player_down_idle;
  }

  if (!grid) {
    // Fallback block if any other asset sprite doesn't exist
    console.warn("MISSING SPRITE:", spriteName);
    ctx.fillStyle = "#ff00ff";
    ctx.fillRect(px, py, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 9px pixel, monospace";
    ctx.fillText(spriteName.substring(0, 15), px, py + 12);
    return;
  }

  const rows = grid.length;
  const cols = grid[0].length;
  const pixelW = width / cols;
  const pixelH = height / rows;

  ctx.save();

  // Set anti-aliasing off for pixel perfect scale
  ctx.imageSmoothingEnabled = false;

  // Shadow drawing
  if (options.shadow) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(
      px + width / 2,
      py + height - pixelH,
      width * 0.45,
      pixelH * 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Action Glow effect
  if (options.glow) {
    ctx.shadowBlur = 10;
    ctx.shadowColor = options.glowColor || "rgba(0, 240, 255, 0.6)";
  }

  // Draw pixels
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const char = grid[r][c];
      const color = (options.paletteOverride && options.paletteOverride[char]) || PALETTE[char] || "transparent";

      if (color !== "transparent") {
        ctx.fillStyle = color;
        
        let drawC = c;
        if (options.flipX) {
          drawC = cols - 1 - c;
        }

        ctx.fillRect(
          Math.floor(px + drawC * pixelW),
          Math.floor(py + r * pixelH),
          Math.ceil(pixelW),
          Math.ceil(pixelH)
        );
      }
    }
  }

  ctx.restore();
}
