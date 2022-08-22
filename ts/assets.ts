import * as THREE from "three";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Assets {
  private static async loadOne(filename: string): Promise<THREE.Object3D> {
    const loader = new GLTFLoader();
    return new Promise<THREE.Object3D>((resolve, reject) => {
      loader.load(filename, (gltf) => {
        console.log(`Loaded ${filename}`);
        resolve(gltf.scene);
      });
    });
  }

  public static models = new Map<string, THREE.Object3D>();
  public static logModel(o: THREE.Object3D, indent: string) {
    console.log(`${indent}${o.type}: ${o.name}`);
    if (o.type === 'Mesh') {
      const m = o as any as THREE.Mesh;
      console.log(`${indent} geometry: ${m.geometry.name}`);
      console.log(`${indent} material: ${(m.material as THREE.Material).name}`);
    }
    for ( const c of o.children) {
      this.logModel(c, ' ' + indent);
    }
  }


  private static goodColors = ['Lime', 'Teal', 'OrangeRed', 'Blue'];
  public static randomColor() {
    return this.goodColors[Math.floor(Math.random() * this.goodColors.length)];
  }

  public static setMaterials(o: THREE.Object3D, color: THREE.Color) {
    if (o.type === 'Mesh') {
      const m = o as any as THREE.Mesh;
      m.material = new THREE.MeshPhongMaterial({color: color});
      m.material.name = 'Phong';
    }
    for ( const c of o.children) {
      this.setMaterials(c, color);
    }
  }

  public static async load() {
    for (const name of ['cat house', 'cat tree']) {
      const o =  await this.loadOne(`models/${name}.glb`);
      this.models.set(name, o);
      this.logModel(o, '');
    }
    return;
  }
}