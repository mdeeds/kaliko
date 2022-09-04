import * as THREE from "three";

export class TextMap {

  readonly map: string[] = [
    "1234567891111111111222222222233",
    "2........0123456789012345678901",
    "3..............................",
    "4..............................",
    "5..............................",
    "6..............................",
    "7..............................",
    "8..............................",
    "9..............................",
    "10ttttttttttttttttttttttttttttt",
    "11hhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
    "12ttttttttttttttttttttttttttttt",
    "13.............................",
    "14.............................",
    "15............'''..............",
    "16............'.'..............",
    "17............'''..............",
    "18.............................",
    "19.............................",
    "20........thththt..............",
    "21........ht.h.th..............",
    "22.............................",
    "23.............................",
    "24.............................",
    "25.............................",
    "26.............................",
    "27.............................",
    "28.............................",
    "29.............................",
    "30..............................",
    "31.............................",
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