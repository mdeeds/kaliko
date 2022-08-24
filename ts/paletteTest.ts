import * as THREE from "three";

import { Palette } from "./palette";

const p = new Palette(new THREE.Color('purple'));

const green = new THREE.Color('green');
console.log(`${[green.r, green.g, green.b]}`);

const g = p.in(green);

console.log(`${[g.r, g.g, g.b]}`);

const blue = new THREE.Color('blue');
const b = p.in(blue);
console.log(`${[b.r, b.g, b.b]}`);

