import { ParamSink, ParamSinkInterface } from "./paramSink";
import { Sfx } from "./sfx";


export interface TriggerInterface {
  // Plays the sound at the specified time and rate.
  trigger(triggerTime: number, secondsPerMeasure: number): void;
}