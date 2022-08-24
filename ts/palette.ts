import * as THREE from "three";
import { S } from "./settings";

class ColorLine {
  private from = new THREE.Vector3();
  private to = new THREE.Vector3();
  private dir = new THREE.Vector3();
  constructor(from: THREE.Color, to: THREE.Color) {
    this.from.set(from.r, from.g, from.b);
    this.to.set(to.r, to.g, to.b);
    this.dir.copy(this.to);
    this.dir.sub(this.from);
    this.dir.normalize;
  }

  in(color: THREE.Color, outColor: THREE.Color): number {
    const translated = new THREE.Vector3(color.r, color.g, color.b);
    translated.sub(this.from);
    const distance = translated.dot(this.dir);
    const outV = new THREE.Vector3();
    outV.copy(this.dir);
    outV.multiplyScalar(distance);
    outV.add(this.from);
    outColor.setRGB(outV.x, outV.y, outV.z);
    translated.set(color.r, color.g, color.b);
    translated.sub(outV);
    // console.log(`AAAAA: ${this.tmp2.length()} ${[outColor.r, outColor.g, outColor.b]}`);
    return translated.length();
  }
}


export class Palette {
  private complement = new THREE.Color();
  private complementS1 = new THREE.Color();
  private complementS2 = new THREE.Color();

  private lines: ColorLine[] = [];

  constructor(private primary: THREE.Color) {
    const hsl = {} as THREE.HSL;
    this.primary.getHSL(hsl);
    hsl.h = (hsl.h + 0.5) % 1;
    this.complement.setHSL(hsl.h, hsl.s, hsl.l);
    // console.log(`AAAAA ${[this.complement.r, this.complement.g, this.complement.b]}`);
    this.complementS1.setHSL((hsl.h + S.float('ss')) % 1, hsl.s, hsl.l);
    this.complementS2.setHSL((hsl.h + 1 - S.float('ss')) % 1, hsl.s, hsl.l);

    const black = new THREE.Color('Black');
    const white = new THREE.Color('White');
    this.lines.push(new ColorLine(black, primary));
    this.lines.push(new ColorLine(white, primary));
    this.lines.push(new ColorLine(black, this.complement));
    this.lines.push(new ColorLine(white, this.complement));
    this.lines.push(new ColorLine(black, this.complementS1));
    this.lines.push(new ColorLine(white, this.complementS1));
    this.lines.push(new ColorLine(black, this.complementS2));
    this.lines.push(new ColorLine(white, this.complementS2));
    this.lines.push(new ColorLine(new THREE.Color('#eee'), white));
  }

  in(color: THREE.Color): THREE.Color {
    const result = new THREE.Color();
    const candidate = new THREE.Color();
    let shortest = Infinity;
    for (const cl of this.lines) {
      const d = cl.in(color, candidate);
      if (d < shortest) {
        shortest = d;
        result.copy(candidate);
      }
    }
    console.log(`Best: ${shortest} ${[result.r, result.g, result.b]} is not ${[color.r, color.g, color.b]}`);
    return result;
  }
}