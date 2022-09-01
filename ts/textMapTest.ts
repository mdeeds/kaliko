import * as THREE from "three";

import { TextMap } from "./textMap";

const map = new TextMap();

const undo = new THREE.Vector3();
console.log(`${map.collision(new THREE.Vector3(0, 0, 0), 0.3, undo)} = false`);

console.log(`${map.collision(new THREE.Vector3(0, 0, 19), 0.3, undo)} = true`);
console.log(`${[undo.x, undo.z]} = [0, -3.3]`);

console.log(`${map.collision(new THREE.Vector3(0, 0, 21), 0.3, undo)} = true`);
console.log(`${[undo.x, undo.z]} = [0, 3.3]`);


console.log(`${map.collision(new THREE.Vector3(2, 0, 19), 0.3, undo)} = true`);
console.log(`${[undo.x, undo.z]} = [2.3, -3.3]`);
