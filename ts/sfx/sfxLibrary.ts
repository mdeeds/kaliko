import { Attenuator } from "./attenuator";
import { Automation } from "./automation";
import { FreqSink } from "./freqSink";
import { MultiTrigger } from "./multiTrigger";
import { Sfx } from "./sfx";
import { TriggerInterface } from "./triggerInterface";

export class SfxLibrary {
  constructor(private sfx: Sfx) {

  }

  makeBoop(): TriggerInterface {
    const o = this.sfx.makeOscillator(80, 'sawtooth');
    const f = this.sfx.makeLPF(160);
    const openClose = Automation.makeRamps("5a5", 16);
    const toNote = new Attenuator(0.4, FreqSink.hzToVoltage(40));
    const freqSink = new FreqSink();
    openClose.connect(toNote);
    toNote.connect(freqSink);
    freqSink.connect(f.frequency);

    const vca = this.sfx.makeGain();
    const gate = Automation.makeGate(8);
    gate.connect(vca.gain);

    o.connect(f);
    f.connect(vca);
    vca.connect(this.sfx.output());

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

  make808(): TriggerInterface {
    const o = this.sfx.makeOscillator(40, 'square');
    const f = this.sfx.makeLPF(160);
    const vca = this.sfx.makeGain();
    f.Q.setValueAtTime(1.5, this.sfx.ctx.currentTime);

    const drop = Automation.makeRamps("50", 4);
    const hold = Automation.makeRamps("566665", 8);
    const toNote = new Attenuator(0.05, FreqSink.hzToVoltage(40));
    const freqSink = new FreqSink();

    hold.connect(vca.gain);
    drop.connect(toNote);
    drop.connect(freqSink);
    freqSink.connect(f.frequency);
    freqSink.connect(o.frequency);

    o.connect(f);
    f.connect(vca);
    vca.connect(this.sfx.output());

    return new MultiTrigger([hold, drop]);
  }

  makeStep(): TriggerInterface {
    const o = this.sfx.makeOscillator(200, 'sawtooth');
    const f = this.sfx.makeHPF(200);
    const vca = this.sfx.makeGain();

    const gate = Automation.makeGate(4);
    const rise = Automation.makeRamps("05", 4);
    const toNote = new Attenuator(8.0, FreqSink.hzToVoltage(1200));
    const freqSink = new FreqSink();

    gate.connect(vca.gain);
    rise.connect(toNote);
    toNote.connect(freqSink);
    freqSink.connect(f.frequency);

    o.connect(f);
    f.connect(vca);
    vca.connect(this.sfx.output());

    return new MultiTrigger([gate, rise]);
  }
}