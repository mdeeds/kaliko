/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 151:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Log = void 0;
class Log {
    static info(message) {
        const div = document.createElement('div');
        div.innerText = message;
        document.body.appendChild(div);
        return div;
    }
}
exports.Log = Log;
//# sourceMappingURL=log.js.map

/***/ }),

/***/ 241:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Automation = void 0;
const log_1 = __webpack_require__(151);
class Automation {
    subdivisions;
    // Time offsets for values in series. These are measured in subdivisions.
    offset = [];
    series = [];
    // `subdivisions`: 8 = eigth notes.
    constructor(subdivisions) {
        this.subdivisions = subdivisions;
    }
    static makeRamps(series, subdivisions) {
        const result = new Automation(subdivisions);
        let offset = 0;
        for (let i = 0; i < series.length; ++i) {
            let hasValue = true;
            switch (series[i]) {
                case '0':
                    result.series.push(-5);
                    break;
                case '1':
                    result.series.push(-4);
                    break;
                case '2':
                    result.series.push(-3);
                    break;
                case '3':
                    result.series.push(-2);
                    break;
                case '4':
                    result.series.push(-1);
                    break;
                case '5':
                    result.series.push(0);
                    break;
                case '6':
                    result.series.push(1);
                    break;
                case '7':
                    result.series.push(2);
                    break;
                case '8':
                    result.series.push(3);
                    break;
                case '9':
                    result.series.push(4);
                    break;
                case 'a':
                    result.series.push(5);
                    break;
                default:
                    hasValue = false;
                    break;
            }
            if (hasValue) {
                result.offset.push(offset);
            }
            offset += 1 / result.subdivisions;
        }
        return result;
    }
    static makeGate(subdivisions) {
        const result = new Automation(subdivisions);
        result.series.push(0, 1, 1, 0);
        result.offset.push(0, 0.01, 0.99, 1);
        return result;
    }
    sinks = [];
    connect(sink) {
        this.sinks.push(sink);
    }
    trigger(triggerTime, secondsPerMeasure) {
        log_1.Log.info(`trigger @ ${triggerTime.toFixed(3)}`);
        for (const param of this.sinks) {
            const delta = secondsPerMeasure / this.subdivisions;
            param.cancelScheduledValues(triggerTime);
            log_1.Log.info(`set to ${this.series[0]} @ ${triggerTime}`);
            param.setValueAtTime(this.series[0], triggerTime);
            for (let i = 1; i < this.series.length; ++i) {
                if (this.series[i] != undefined) {
                    const eventTime = triggerTime + delta * this.offset[i];
                    log_1.Log.info(`ramp to ${this.series[i]} @ ${eventTime.toFixed(3)}`);
                    param.linearRampToValueAtTime(this.series[i], eventTime);
                }
            }
        }
    }
}
exports.Automation = Automation;
//# sourceMappingURL=automation.js.map

/***/ }),

/***/ 160:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MultiTrigger = void 0;
class MultiTrigger {
    triggers;
    constructor(triggers) {
        this.triggers = triggers;
    }
    trigger(triggerTime, secondsPerMeasure) {
        for (const t of this.triggers) {
            t.trigger(triggerTime, secondsPerMeasure);
        }
    }
}
exports.MultiTrigger = MultiTrigger;
//# sourceMappingURL=multiTrigger.js.map

/***/ }),

/***/ 939:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Sfx = void 0;
class Sfx {
    ctx;
    afterEffects;
    constructor(ctx) {
        this.ctx = ctx;
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
    makeOscillator(freq, shape) {
        const o = this.ctx.createOscillator();
        o.type = shape;
        o.frequency.setValueAtTime(freq, this.ctx.currentTime);
        o.start();
        return o;
    }
    makeLPF(freq) {
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
    static async make() {
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
exports.Sfx = Sfx;
//# sourceMappingURL=sfx.js.map

/***/ }),

/***/ 541:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SfxLibrary = void 0;
const automation_1 = __webpack_require__(241);
const multiTrigger_1 = __webpack_require__(160);
class SfxLibrary {
    sfx;
    constructor(sfx) {
        this.sfx = sfx;
    }
    makeBoop() {
        const o = this.sfx.makeOscillator(80, 'sawtooth');
        const f = this.sfx.makeLPF(160);
        const openClose = automation_1.Automation.makeRamps("0a0", 2);
        openClose.connect(f.frequency);
        const vca = this.sfx.makeGain();
        const gate = automation_1.Automation.makeGate(1);
        gate.connect(vca.gain);
        o.connect(f);
        f.connect(vca);
        f.connect(this.sfx.output());
        return new multiTrigger_1.MultiTrigger([openClose, gate]);
    }
    makeBeep() {
        const o = this.sfx.makeOscillator(80, 'square');
        const gain = this.sfx.makeGain();
        const gate = automation_1.Automation.makeGate(2);
        o.connect(gain);
        gate.connect(gain.gain);
        gain.connect(this.sfx.output());
        return gate;
    }
}
exports.SfxLibrary = SfxLibrary;
//# sourceMappingURL=sfxLibrary.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
const log_1 = __webpack_require__(151);
const sfx_1 = __webpack_require__(939);
const sfxLibrary_1 = __webpack_require__(541);
async function go() {
    log_1.Log.info('Click on the page.');
    const sfx = await sfx_1.Sfx.make();
    log_1.Log.info('Got SFX.');
    const lib = new sfxLibrary_1.SfxLibrary(sfx);
    const boop = lib.makeBeep();
    boop.trigger(sfx.ctx.currentTime, 2);
    log_1.Log.info('Triggered');
    const button = log_1.Log.info('boop');
    button.style.border = 'outset 2px';
    button.addEventListener('click', () => {
        boop.trigger(sfx.ctx.currentTime, 2);
    });
}
go();
//# sourceMappingURL=demo.js.map
})();

/******/ })()
;
//# sourceMappingURL=sfxDemo.js.map