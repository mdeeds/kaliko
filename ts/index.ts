import * as THREE from "three";

import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { Assets } from "./assets";
import { K } from "./keyboard";
import { Palette } from "./palette";
import { S } from "./settings";
import { WorldMap } from "./worldMap";

export class Index {
  private scene = new THREE.Scene();
  private renderer = new THREE.WebGLRenderer()
  private camera = new THREE.PerspectiveCamera(75, 1.0, 0.01, 400);
  private universe = new THREE.Group();
  private playerPosition = new THREE.Vector3();
  private keyboard: K;
  private p = new Palette(new THREE.Color(S.float('pr'), S.float('pg'), S.float('pb')));
  private map: WorldMap;
  constructor() {
    this.makeScene();
    this.setUpRenderer();
    this.setUpPage();
    this.keyboard = new K();
  }

  private makeScene() {
    this.scene.add(this.universe);
    const ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(400, 400),
      new THREE.MeshPhongMaterial(
        { color: this.p.in(new THREE.Color('YellowGreen')) }));
    ground.rotateX(-Math.PI / 2);
    this.scene.add(ground);

    const sky = new THREE.Mesh(
      new THREE.BoxBufferGeometry(200, 200, 200),
      new THREE.MeshPhongMaterial({ color: 'black', side: THREE.BackSide })
    );
    this.scene.add(sky);

    const light = new THREE.HemisphereLight('White', 'SlateGray', 1.0);
    this.scene.add(light);

    this.scene.fog = new THREE.Fog(
      this.p.in(new THREE.Color('DeepSkyBlue')), 0, 100);

    // for (const x of [-5, 5]) {
    //   for (let z = -5; z > -100; z -= 5) {
    //     const house = Assets.models.get('cat house').clone();
    //     Assets.setMaterials(house, Assets.randomColor(this.p));
    //     house.position.set(x, 0, z);
    //     if (x < 0) {
    //       house.rotateY(-Math.PI / 2);
    //     } else {
    //       house.rotateY(Math.PI / 2);
    //     }
    //     this.scene.add(house);
    //   }
    // }

    this.map = new WorldMap(this.p);
    this.universe.add(this.map);

    this.camera.position.set(0, 1.7, 2.0);
    this.camera.lookAt(0, 1.7, 0);
    this.scene.add(this.camera);
  }

  private forward = new THREE.Vector3(0, 0, -1);
  private right = new THREE.Vector3(1, 0, 0);
  private up = new THREE.Vector3(0, 1, 0);
  private tmp = new THREE.Vector3();


  private cameraRelative(dir: THREE.Vector3, out: THREE.Vector3) {
    this.camera.normalMatrix.getNormalMatrix(this.camera.matrixWorld);
    out.copy(dir);
    out.applyMatrix3(this.camera.normalMatrix);
  }

  private strafe(dir: THREE.Vector3, deltaS: number, scale: number) {
    this.cameraRelative(dir, this.tmp);
    this.tmp.y = 0;
    this.tmp.normalize();
    this.tmp.multiplyScalar(scale * deltaS);  // Was 2
    this.universe.position.sub(this.tmp);
    this.playerPosition.copy(this.universe.position);
    this.playerPosition.multiplyScalar(-1);
  }

  private setUpRenderer() {
    this.renderer.setSize(512, 512);
    this.renderer.xr.enabled = true;

    const clock = new THREE.Clock();
    let elapsedS = 0;
    let frameCount = 0;
    this.renderer.setAnimationLoop(() => {
      const deltaS = Math.min(clock.getDelta(), 0.1);
      elapsedS += deltaS;
      ++frameCount;
      // const tick = new Tick(elapsedS, deltaS, frameCount);
      // this.tickEverything(this.scene, tick);
      this.renderer.render(this.scene, this.camera);

      if (this.keyboard.down('KeyW')) {
        this.strafe(this.forward, deltaS, 10);  // Was 2
      }
      if (this.keyboard.down('KeyS')) {
        this.strafe(this.forward, deltaS, -2);
      }
      if (this.keyboard.down('KeyA')) {
        this.strafe(this.right, deltaS, -7);  // Was 2
      }
      if (this.keyboard.down('KeyD')) {
        this.strafe(this.right, deltaS, 7);
      }
      if (this.keyboard.down('ArrowRight')) {
        this.camera.rotateOnAxis(this.up, -Math.PI * deltaS);
      }
      if (this.keyboard.down('ArrowLeft')) {
        this.camera.rotateOnAxis(this.up, Math.PI * deltaS);
      }
      if (this.keyboard.down('ArrowUp')) {
        this.camera.rotateOnAxis(this.right, 0.5 * Math.PI * deltaS);
      }
      if (this.keyboard.down('ArrowDown')) {
        this.camera.rotateOnAxis(this.right, -0.5 * Math.PI * deltaS);
      }

      if (this.map.collision(this.playerPosition, 0.3, this.tmp)) {
        this.playerPosition.add(this.tmp);
        this.universe.position.copy(this.playerPosition);
        this.universe.position.multiplyScalar(-1);
      }
    });
  }

  private setUpPage() {
    document.body.innerHTML = '';
    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(VRButton.createButton(this.renderer));
  }

}

const initialize = async function () {
  await Assets.load();
  new Index();
}

initialize();