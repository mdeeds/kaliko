import { ParamSinkInterface } from "./paramSink";

export class FreqSink implements ParamSinkInterface {
  constructor() {
  }

  private sinks: AudioParam[] = [];
  connect(sink: AudioParam) {
    this.sinks.push(sink);
  }

  cancelScheduledValues(time: number): void {
    for (const sink of this.sinks) {
      sink.cancelScheduledValues(time);
    }
  }

  private voltageToFreq(volts: number): number {
    return 261.63 * Math.pow(2, volts);
  }

  setValueAtTime(value: number, time: number): void {
    const outValue = this.voltageToFreq(value);
    for (const sink of this.sinks) {
      sink.setValueAtTime(outValue, time);
    }
  }

  linearRampToValueAtTime(value: number, time: number): void {
    const outValue = this.voltageToFreq(value);
    for (const sink of this.sinks) {
      sink.exponentialRampToValueAtTime(outValue, time);
    }
  }
}

