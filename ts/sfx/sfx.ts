export class Sfx {

  private afterEffects: AudioNode;

  private constructor(readonly ctx: AudioContext) {
    const delay = ctx.createDelay(1.0);
    const lpf = ctx.createBiquadFilter();
    const mix = ctx.createGain();
    const feedback = ctx.createGain();

    mix.gain.setValueAtTime(1.0, ctx.currentTime);
    lpf.frequency.setValueAtTime(200, ctx.currentTime);
    delay.delayTime.setValueAtTime(0.5, ctx.currentTime);
    feedback.gain.value = 0.4;

    mix.connect(delay);
    delay.connect(lpf);
    lpf.connect(feedback);
    feedback.connect(mix);
    mix.connect(ctx.destination);

    this.afterEffects = mix;
  }

  makeOscillator(freq: number, shape: OscillatorType): OscillatorNode {
    const o = this.ctx.createOscillator();
    o.type = shape;
    o.frequency.setValueAtTime(freq, this.ctx.currentTime);
    o.start();
    return o;
  }

  makeLPF(freq: number) {
    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(freq, this.ctx.currentTime);
    return lpf;
  }

  makeGain() {
    return this.ctx.createGain();
  }

  output() {
    return this.afterEffects;
  }

  static async make(): Promise<Sfx> {
    return new Promise((resolve, reject) => {
      const onClick = () => {
        const audioCtx = new window.AudioContext();
        resolve(new Sfx(audioCtx));
        document.body.removeEventListener('click', onClick);
      };
      document.body.addEventListener('click', onClick);
    });
  }

}