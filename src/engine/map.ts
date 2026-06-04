/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TileType, Position } from "../types";
import { drawPixelSprite } from "./sprites";

export const TILE_SIZE = 48; // Each tile is 48x48 pixels

// Checks if a rectangle (player/npc) collides with blocking tiles on our grid
export function checkCollision(
  rx: number,
  ry: number,
  rWidth: number,
  rHeight: number,
  grid: TileType[][]
): { collide: boolean; hazard?: boolean } {
  // Pad bounding calculations slightly for responsive sliding beside trees and walls
  const bounds = {
    left: rx + 4,
    right: rx + rWidth - 4,
    top: ry + 12, // Character feet collision box
    bottom: ry + rHeight - 2,
  };

  const startCol = Math.floor(bounds.left / TILE_SIZE);
  const endCol = Math.floor(bounds.right / TILE_SIZE);
  const startRow = Math.floor(bounds.top / TILE_SIZE);
  const endRow = Math.floor(bounds.bottom / TILE_SIZE);

  // If going out of map edges, block player
  if (
    startCol < 0 ||
    endCol >= grid[0]?.length ||
    startRow < 0 ||
    endRow >= grid.length
  ) {
    return { collide: true };
  }

  // Iterate over overlapping tiles
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      const tile = grid[r][c];
      
      // Blocking tiles
      if (
        tile === "tree_obstacle" ||
        tile === "stone_obstacle" ||
        tile === "dungeon_wall" ||
        tile === "dungeon_door"
      ) {
        return { collide: true };
      }

      // Environmental damage/hazard (lava)
      if (tile === "lava") {
        return { collide: false, hazard: true };
      }
    }
  }

  return { collide: false };
}

// Generate procedurally pretty micro-decorations on standard grass/dirt
export function drawFloorTile(
  ctx: CanvasRenderingContext2D,
  tile: TileType,
  x: number,
  y: number,
  c: number,
  r: number
) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const px = x;
  const py = y;

  if (tile === "grass") {
    // Soft forest grass base
    ctx.fillStyle = "#5ba353";
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

    // Subtle grass blades
    ctx.fillStyle = "#4a8a43";
    if ((c + r) % 3 === 0) {
      ctx.fillRect(px + 12, py + 16, 4, 8);
      ctx.fillRect(px + 16, py + 20, 4, 4);
    }
    if ((c * r + 7) % 5 === 0) {
      ctx.fillRect(px + 32, py + 12, 4, 4);
      ctx.fillRect(px + 28, py + 16, 4, 8);
    }
  } else if (tile === "dirt_path") {
    // Golden warm dirt path
    ctx.fillStyle = "#cca26a";
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

    // Sand grains
    ctx.fillStyle = "#b58d55";
    if ((c * 4 + r) % 3 === 1) {
      ctx.fillRect(px + 8, py + 20, 4, 4);
      ctx.fillRect(px + 28, py + 36, 4, 4);
    }
  } else if (tile === "dirt_border") {
    // Blend of path and grass
    ctx.fillStyle = "#8a7551";
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  } else if (tile === "tree_obstacle") {
    // Under layer is grass, tree is drawn on top
    ctx.fillStyle = "#5ba353";
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    drawPixelSprite(ctx, "tree", px, py, TILE_SIZE, TILE_SIZE, { shadow: true });
  } else if (tile === "stone_obstacle") {
    // Under layer is dirt or grass, stone on top
    ctx.fillStyle = "#5ba353";
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    drawPixelSprite(ctx, "stone", px, py, TILE_SIZE, TILE_SIZE, { shadow: true });
  } else if (tile === "dungeon_floor") {
    // Deep gray cobblestone
    ctx.fillStyle = "#2c2f38";
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

    // Brick mortar lines
    ctx.fillStyle = "#1e2129";
    ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
    
    // Cracked block detail
    if ((c + r * 5) % 8 === 0) {
      ctx.fillStyle = "#3e424e";
      ctx.fillRect(px + 8, py + 8, 12, 4);
      ctx.fillRect(px + 16, py + 24, 16, 4);
    }
  } else if (tile === "dungeon_wall") {
    // Impregnable dungeon masonry
    ctx.fillStyle = "#181a1d";
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

    ctx.fillStyle = "#30343a";
    ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);

    ctx.fillStyle = "#111215";
    ctx.fillRect(px + 4, py + 36, TILE_SIZE - 8, 8);
    ctx.fillRect(px + 36, py + 4, 8, TILE_SIZE - 8);
  } else if (tile === "dungeon_door") {
    // Wooden door locked securely
    ctx.fillStyle = "#1e2129"; // Frame
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

    ctx.fillStyle = "#69351d"; // Wood panels
    ctx.fillRect(px + 8, py + 4, TILE_SIZE - 16, TILE_SIZE - 8);

    ctx.fillStyle = "#9c5737"; // Highlights
    ctx.fillRect(px + 12, py + 4, 4, TILE_SIZE - 8);
    ctx.fillRect(px + 28, py + 4, 4, TILE_SIZE - 8);

    // Gold padlock core in the center
    ctx.fillStyle = "#ecc326";
    ctx.fillRect(px + 20, py + 20, 8, 8);
    ctx.fillStyle = "#111";
    ctx.fillRect(px + 22, py + 24, 4, 4);
  } else if (tile === "portal") {
    // Starry/swirling space portal
    ctx.fillStyle = "#1b1130";
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    drawPixelSprite(ctx, "portal", px, py, TILE_SIZE, TILE_SIZE, { glow: true });
  } else if (tile === "lava") {
    // Flowing dangerous orange material
    const offset = Math.floor(Date.now() / 300) % 3;
    ctx.fillStyle = offset === 0 ? "#cc4412" : offset === 1 ? "#dd5f1d" : "#e6330b";
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

    // Yellow thermal bubbling
    ctx.fillStyle = "#fcbd19";
    if ((c * 2 + r + offset) % 4 === 1) {
      ctx.fillRect(px + 16, py + 8, 8, 4);
      ctx.fillRect(px + 28, py + 28, 4, 4);
    }
  }

  ctx.restore();
}
