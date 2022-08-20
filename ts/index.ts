import * as THREE from "three";
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

export class Index {
  private scene = new THREE.Scene();
  private renderer = new THREE.WebGLRenderer()
  private camera = new THREE.PerspectiveCamera(75, 1.0, 0.01, 400);
  constructor() {
    this.makeScene();
    this.setUpRenderer();
    this.setUpPage();
  }

  private makeScene() {
    const ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(400, 400),
      new THREE.MeshPhongMaterial({ color: 'SlateGray' }));
    ground.rotateX(-Math.PI / 2);
    this.scene.add(ground);

    const sky = new THREE.Mesh(
      new THREE.BoxBufferGeometry(200, 200, 200),
      new THREE.MeshPhongMaterial({ color: 'black', side: THREE.BackSide })
    );
    this.scene.add(sky);

    const light = new THREE.HemisphereLight('White', 'SlateGray', 1.0);
    this.scene.add(light);

    this.scene.fog = new THREE.Fog('DeepSkyBlue', 50, 100);

    this.camera.position.set(0, 1.7, 0);
    this.camera.lookAt(0, 1.7, -1.5);
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
      // composer.render();
    });
  }

  private setUpPage() {
    document.body.innerHTML = '';
    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(VRButton.createButton(this.renderer));
  }

}

new Index();