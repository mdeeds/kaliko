import * as THREE from "three";
import { BoxBufferGeometry, IcosahedronBufferGeometry, MeshPhongMaterial } from "three";
import { Assets } from "./assets";
import { Palette } from "./palette";
import { TextMap } from "./textMap";

export class WorldMap extends THREE.Object3D {
  private map = new TextMap();

  private box(height: number): THREE.Object3D {
    const boxHeight = height * 5 + 0.5;
    const b = new THREE.Mesh(
      new BoxBufferGeometry(5, boxHeight, 5),
      new MeshPhongMaterial({ color: this.p.in(new THREE.Color('#ef4')) })
    );
    b.position.y = boxHeight / 2;
    return b;
  }
  private ground(color: string): THREE.Object3D {
    const boxHeight = 0.01;
    const b = new THREE.Mesh(
      new BoxBufferGeometry(5, boxHeight, 5),
      new MeshPhongMaterial({ color: this.p.in(new THREE.Color(color)) })
    );
    b.position.y = boxHeight / 2;
    return b;
  }

  private house(): THREE.Object3D {
    const house = Assets.models.get('cat house').clone();
    Assets.setMaterials(house, Assets.randomColor(this.p));
    // if (x < 0) {
    //   house.rotateY(-Math.PI / 2);
    // } else {
    //   house.rotateY(Math.PI / 2);
    // }
    return house;
  }
  private tree(): THREE.Object3D {
    const tree = Assets.models.get('cat tree').clone();
    Assets.setMaterials(tree, this.p.in(new THREE.Color('Green')));
    return tree;
  }

  constructor(private p: Palette) {
    super();
    let z = -5 * 15;
    for (const l of this.map.map) {
      let x = -5 * 15;
      for (const c of l) {
        let o: THREE.Object3D = null;
        switch (c) {
          case '.':
            o = new THREE.Mesh(
              new IcosahedronBufferGeometry(0.5, 2),
              new MeshPhongMaterial({ color: p.in(new THREE.Color('#888')) })
            );
            o.position.y = 0.25;
            break;
          case '0': o = this.box(0); break;
          case '1': o = this.box(1); break;
          case '2': o = this.box(2); break;
          case '3': o = this.box(3); break;
          case '4': o = this.box(4); break;
          case '5': o = this.box(5); break;
          case 'o': case '6': o = this.box(6); break;
          case '7': o = this.box(7); break;
          case '8': o = this.box(8); break;
          case '9': o = this.box(9); break;
          case 'h': o = this.house(); break;
          case 't': o = this.tree(); break;
          case 'p': o = this.ground('Green'); break;
          case 'g': o = this.ground('Green'); break;
        }
        if (o) {
          o.position.x = x;
          o.position.z = z;
          this.add(o);
        }
        x += 5;
      }
      z += 5;
    }
  }

  // Returns true if there is a collision and sets `undo` with a
  // vector sufficient to back the position out of one of the objects.
  collision(pos: THREE.Vector3, diameter: number, undo: THREE.Vector3): boolean {
    return this.map.collision(pos, diameter, undo);
  }
}