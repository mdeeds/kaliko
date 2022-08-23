export class K {
  private polled = new Set<string>();
  private keysDown = new Set<string>();

  constructor() {
    document.body.addEventListener('keydown', (ev: KeyboardEvent) => {
      this.keysDown.add(ev.code);
    });
    document.body.addEventListener('keyup', (ev: KeyboardEvent) => {
      this.keysDown.delete(ev.code);
      this.polled.delete(ev.code);
    });
  }

  public down(code: string) {
    return this.keysDown.has(code);
  }

  public justPressed(code: string) {
    if (this.polled.has(code)) {
      return false;
    }
    if (this.keysDown.has(code)) {
      this.polled.add(code);
      return true;
    }
    return false;
  }
}