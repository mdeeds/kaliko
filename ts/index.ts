import * as THREE from "three";

import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { Assets } from "./assets";
import { K } from "./keyboard";

export class Index {
  private scene = new THREE.Scene();
  private renderer = new THREE.WebGLRenderer()
  private camera = new THREE.PerspectiveCamera(75, 1.0, 0.01, 400);
  private keyboard: K;
  constructor() {
    this.makeScene();
    this.setUpRenderer();
    this.setUpPage();
    this.keyboard = new K();
  }

  private makeScene() {
    const ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(400, 400),
      new THREE.MeshPhongMaterial({ color: 'YellowGreen' }));
    ground.rotateX(-Math.PI / 2);
    this.scene.add(ground);

    const sky = new THREE.Mesh(
      new THREE.BoxBufferGeometry(200, 200, 200),
      new THREE.MeshPhongMaterial({ color: 'black', side: THREE.BackSide })
    );
    this.scene.add(sky);

    const light = new THREE.HemisphereLight('White', 'SlateGray', 1.0);
    this.scene.add(light);

    this.scene.fog = new THREE.Fog('DeepSkyBlue', 0, 30);

    for (const x of [-5, 5]) {
      for(let z=-5; z>-100;z-=5){
        const house = Assets.models.get('cat house').clone();
        Assets.setMaterials(house, new THREE.Color(Assets.randomColor()));
        house.position.set(x, 0, z);
        if (x < 0) {
          house.rotateY(-Math.PI/2);
        } else { 
          house.rotateY(Math.PI/2);
        }
        this.scene.add(house);
      }  
    }
    
    this.camera.position.set(0, 1.7, 2.0);
    this.camera.lookAt(0, 1.0, 0);
    this.scene.add(this.camera);
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

      if (this.keyboard.down('ArrowUp')) {
        this.camera.position.z -=deltaS*2;
      }
      if (this.keyboard.down('ArrowDown')) {
        this.camera.position.z +=deltaS*2;
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