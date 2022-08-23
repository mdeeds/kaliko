import * as THREE from "three";

import { Palette } from "./palette";

const p = new Palette(new THREE.Color('orange'));

const green = new THREE.Color('green');
console.log(`${[green.r, green.g, green.b]}`);

const g = p.in(green);

console.log(`${[g.r, g.g, g.b]}`);
