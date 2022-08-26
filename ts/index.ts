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
  private keyboard: K;
  private p = new Palette(new THREE.Color(S.float('pr'), S.float('pg'), S.float('pb')));
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

    const m = new WorldMap(this.p);
    this.universe.add(m);

    this.camera.position.set(0, 1.7, 2.0);
    this.camera.lookAt(0, 1.7, 0);
    this.scene.add(this.camera);
  }

  private forward = new THREE.Vector3(0, 0, -1);
  private tmp = new THREE.Vector3();

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

      //2
      if (this.keyboard.down('ArrowUp')) {
        this.tmp.copy(this.forward);
        this.camera.normalMatrix.getNormalMatrix(this.camera.matrixWorld);
        this.tmp.applyMatrix3(this.camera.normalMatrix);
        this.tmp.y = 0;
        this.tmp.normalize();
        this.tmp.multiplyScalar(10 * deltaS);
        this.universe.position.sub(this.tmp);
      }
      if (this.keyboard.down('ArrowDown')) {
        this.tmp.copy(this.forward);
        this.camera.normalMatrix.getNormalMatrix(this.camera.matrixWorld);
        this.tmp.applyMatrix3(this.camera.normalMatrix);
        this.tmp.y = 0;
        this.tmp.normalize();
        this.tmp.multiplyScalar(-2 * deltaS);
        this.universe.position.sub(this.tmp);
      }
      if (this.keyboard.down('ArrowRight')) {
        this.camera.rotateY(-Math.PI * deltaS);
      }
      if (this.keyboard.down('ArrowLeft')) {
        this.camera.rotateY(Math.PI * deltaS);
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