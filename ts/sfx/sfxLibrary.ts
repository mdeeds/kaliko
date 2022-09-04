import { Automation } from "./automation";
import { MultiTrigger } from "./multiTrigger";
import { Sfx } from "./sfx";
import { TriggerInterface } from "./triggerInterface";

export class SfxLibrary {
  constructor(private sfx: Sfx) {

  }

  makeBoop(): TriggerInterface {
    const o = this.sfx.makeOscillator(80, 'sawtooth');
    const f = this.sfx.makeLPF(160);
    const openClose = Automation.makeRamps("0a0", 2);
    openClose.connect(f.frequency);
    const vca = this.sfx.makeGain();
    const gate = Automation.makeGate(1);
    gate.connect(vca.gain);

    o.connect(f);
    f.connect(vca);
    f.connect(this.sfx.output());

    return new MultiTrigger([openClose, gate]);
  }

  makeBeep(): TriggerInterface {
    const o = this.sfx.makeOscillator(80, 'square');
    const gain = this.sfx.makeGain();
    const gate = Automation.makeGate(2);
    o.connect(gain);
    gate.connect(gain.gain);
    gain.connect(this.sfx.output());
    return gate;
  }
}