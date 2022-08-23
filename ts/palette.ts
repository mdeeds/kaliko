import * as THREE from "three";

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

  private tmp = new THREE.Vector3();
  private tmp2 = new THREE.Vector3();
  in(color: THREE.Color, outColor: THREE.Color): number {
    this.tmp.set(color.r, color.g, color.b);
    this.tmp.sub(this.from);
    const distance = this.tmp.dot(this.dir);
    this.tmp2.copy(this.dir);
    this.tmp2.multiplyScalar(distance);
    this.tmp.add(this.tmp2);
    outColor.setRGB(this.tmp.x, this.tmp.y, this.tmp.z);
    this.tmp2.set(color.r, color.g, color.b);
    this.tmp2.sub(this.tmp);
    // console.log(`AAAAA: ${this.tmp2.length()} ${[outColor.r, outColor.g, outColor.b]}`);
    return this.tmp2.length();
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
    this.complementS1.setHSL((hsl.h + 0.01) % 1, hsl.s, hsl.l);
    this.complementS2.setHSL((hsl.h - 0.01) % 1, hsl.s, hsl.l);

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

  private tmp = new THREE.Color();
  in(color: THREE.Color): THREE.Color {
    const result = new THREE.Color();
    let shortest = Infinity;
    for (const cl of this.lines) {
      const d = cl.in(color, this.tmp);
      if (d < shortest) {
        shortest = d;
        result.copy(this.tmp);
        // console.log(`Better: ${d} ${[this.tmp.r, this.tmp.g, this.tmp.b]}`);
      }
    }
    return result;
  }
}