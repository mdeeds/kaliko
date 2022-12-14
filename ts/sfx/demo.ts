import { Log } from "../log";
import { Sfx } from "./sfx";
import { SfxLibrary } from "./sfxLibrary";

async function go() {
  Log.info('Click on the page.');
  const sfx = await Sfx.make();
  Log.info('Got SFX.');
  const lib = new SfxLibrary(sfx);

  const boop = lib.make808();

  boop.trigger(sfx.ctx.currentTime, 2);
  const button = Log.info('boop');
  button.style.border = 'outset 2px';
  button.addEventListener('click', () => {
    boop.trigger(sfx.ctx.currentTime, 2);
  })
}

go();