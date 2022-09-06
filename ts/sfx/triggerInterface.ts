export interface TriggerInterface {
  // Plays the sound at the specified time and rate.
  trigger(triggerTime: number, secondsPerMeasure: number): void;
}