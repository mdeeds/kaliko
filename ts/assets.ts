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

  public static async load() {
    for (const name of ['cat house']) {
      this.models.set(name, await this.loadOne(`models/${name}.glb`));
    }
    return;
  }
}