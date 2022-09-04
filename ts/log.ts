export class Log {
  public static info(message: string): HTMLDivElement {
    const div = document.createElement('div');
    div.innerText = message;
    document.body.appendChild(div);
    return div;
  }
}