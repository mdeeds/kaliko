import * as THREE from "three";

export class TextMap {

  readonly map: string[] = [
    //        1         2         3
    //234567890123456789012345678901",
    "1..........oo................?p",
    "2p%......o.oo.o.o.o.........?p/",
    "3|p%...oogtggggtgggoo......?p/.",
    "4.|p%..oogggggtggggoo.....?p/..",
    "5..|p%...gtggggtggg......?p/...",
    "6...|p%..oggggtgggtgo...?p/....",
    "7....|p%..tggggggggt...?p/.....",
    "8.....|p%ogtggggtgggo.?p/......",
    "9......|p%.....g.....?p/.......",
    "10......|p%....g....?p/........",
    "11.......|p%....g..?p/.........",
    "12tttttttt.pttgtt.?pttttttttttt",
    "13.........|p%...?p/...........",
    "14..........|p%.?p/.......t....",
    "15...........|p'p/......?/.|%..",
    "16............'.'......?/...|%.",
    "17...........?p'p%.....t..h..t.",
    "18..........?p/.|p%....|%...?/.",
    "19.........?p/...|p%....|%.?/..",
    "20........?p/ththt|p%.....t....",
    "21.......?p/t.h.th.|p%.........",
    "22......?p/.........|p%........",
    "23.....?p/...........|p%.......",
    "24....?p/.............|p%......",
    "25...?p/...............|p%.....",
    "26..?p/.................|p%....",
    "27.?p/...................|p%...",
    "28?p/.....................|p%..",
    "29p/.......................|p%.",
    "30..........................|p%",
    "31...........................|p",
  ];

  constructor() {
  }

  private diameter(c: string): number {
    if ("123456789".indexOf(c) >= 0) {
      return 5;
    }
    if ("h".indexOf(c) >= 0) {
      return 4;
    }
    if ("t".indexOf(c) >= 0) {
      return 0.5;
    }
    return 0.0;
  }

  private intersect(cx: number, cz: number, cd: number,
    ox: number, oz: number, od: number, undo: THREE.Vector3): boolean {
    undo.set(0, 0, 0);
    const rSum = (cd + od) / 2;
    const dx = cx - ox;
    const dz = cz - oz;
    const overX = rSum - Math.abs(dx);
    const overZ = rSum - Math.abs(dz);
    if (overX > 0 && overZ > 0) {
      undo.x = (rSum - Math.abs(dx)) * Math.sign(dx);
      undo.z = (rSum - Math.abs(dz)) * Math.sign(dz);
      return true;
    }
    return false;
  }

  // Returns true if there is a collision and sets `undo` with a
  // vector sufficient to back the position out of one of the objects.
  collision(pos: THREE.Vector3, diameter: number, undo: THREE.Vector3): boolean {
    // The grid which the character is on.
    const ci = Math.round((pos.x + 15 * 5) / 5);
    const cj = Math.round((pos.z + 15 * 5) / 5);

    for (let j = cj - 1; j <= cj + 1; ++j) {
      if (j >= 0 && j < this.map.length) {
        const line = this.map[j];
        for (let i = ci - 1; i <= ci + 1; ++i) {
          if (i >= 0 && i < line.length) {
            const c = line[i];
            const od = this.diameter(c);
            if (od > 0) {
              const x = 5 * i - 15 * 5;
              const z = 5 * j - 15 * 5;
              if (this.intersect(pos.x, pos.z, diameter, x, z, od, undo)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }
}