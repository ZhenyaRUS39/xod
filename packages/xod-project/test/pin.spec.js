import { assert } from 'chai';

import * as Pin from '../src/pin';
import * as CONST from '../src/constants';

import * as Helper from './helpers';

describe('Pin', () => {
  // props required
  describe('getPinType', () => {
    it('should return pin type', () => {
      const pin = Helper.defaultizePin({ type: CONST.PIN_TYPE.NUMBER });
      assert.equal(Pin.getPinType(pin), CONST.PIN_TYPE.NUMBER);
    });
  });
  describe('getPinKey', () => {
    it('should return pin key for pin object', () => {
      const pin = Helper.defaultizePin({ key: 'a' });
      assert.equal(Pin.getPinKey(pin), 'a');
    });
    it('should return string for string', () => {
      const pin = 'a';
      assert.equal(Pin.getPinKey(pin), 'a');
    });
  });

  describe('getPinLabel', () => {
    it('should return pin label', () => {
      const pin = Helper.defaultizePin({ label: 'LED1' });
      assert.equal(Pin.getPinLabel(pin), 'LED1');
    });
  });

  describe('getPinDescription', () => {
    it('should return pin description', () => {
      const pin = Helper.defaultizePin({ description: 'my awesome pin' });
      assert.equal(Pin.getPinDescription(pin), 'my awesome pin');
    });
  });

  describe('getPinOrder', () => {
    it('should return pin order', () => {
      const pin = Helper.defaultizePin({ order: 66 });
      assert.equal(Pin.getPinOrder(pin), 66);
    });
  });

  // is input / output
  describe('isInputPin / isOutputPin', () => {
    it('should honor output direction', () => {
      const pin = Helper.defaultizePin({
        direction: CONST.PIN_DIRECTION.OUTPUT,
      });
      assert.isFalse(Pin.isInputPin(pin));
      assert.isTrue(Pin.isOutputPin(pin));
    });
    it('should honor input direction', () => {
      const pin = Helper.defaultizePin({
        direction: CONST.PIN_DIRECTION.INPUT,
      });
      assert.isTrue(Pin.isInputPin(pin));
      assert.isFalse(Pin.isOutputPin(pin));
    });
  });
  describe('isTerminalPin', () => {
    it('should return false for non-terminal pin', () => {
      const pin = Helper.defaultizePin({ key: 'a' });
      assert.isFalse(Pin.isTerminalPin(pin));
    });
    it('should return true for terminal input', () => {
      const pin = Helper.defaultizePin({
        key: CONST.TERMINAL_PIN_KEYS[CONST.PIN_DIRECTION.INPUT],
      });
      assert.isTrue(Pin.isTerminalPin(pin));
    });
    it('should return true for terminal output', () => {
      const pin = Helper.defaultizePin({
        key: CONST.TERMINAL_PIN_KEYS[CONST.PIN_DIRECTION.OUTPUT],
      });
      assert.isTrue(Pin.isTerminalPin(pin));
    });
  });
  describe('isPulsePin', () => {
    it('should return false for non-pulse pin', () => {
      const pin = Helper.defaultizePin({ type: CONST.PIN_TYPE.STRING });
      assert.isFalse(Pin.isPulsePin(pin));
    });
    it('should return true for pulse pin', () => {
      const pin = Helper.defaultizePin({ type: CONST.PIN_TYPE.PULSE });
      assert.isTrue(Pin.isPulsePin(pin));
    });
  });
  describe('normalizeEmptyPinLabels', () => {
    const { INPUT, OUTPUT } = CONST.PIN_DIRECTION;

    it('should leave pins with labels untouched', () => {
      const pins = [
        { label: 'A', direction: INPUT },
        { label: 'A', direction: INPUT },
        { label: 'A', direction: OUTPUT },
      ].map(Helper.defaultizePin);

      assert.deepEqual(Pin.normalizeEmptyPinLabels(pins), pins);
    });

    it('should generate unique labels for pins with empty labels', () => {
      const pins = [
        { label: '', direction: INPUT },
        { label: '', direction: INPUT },
        { label: '', direction: OUTPUT },
      ].map(Helper.defaultizePin);
      const pinsExpected = [
        { label: 'IN1', direction: INPUT },
        { label: 'IN2', direction: INPUT },
        { label: 'OUT', direction: OUTPUT },
      ].map(Helper.defaultizePin);

      assert.deepEqual(Pin.normalizeEmptyPinLabels(pins), pinsExpected);
    });

    it('should allow clashes of generated labels with existing labels', () => {
      const pins = [
        { label: '', direction: INPUT },
        { label: '', direction: OUTPUT },
        { label: '', direction: OUTPUT },
        { label: 'IN', direction: OUTPUT },
      ].map(Helper.defaultizePin);
      const pinsExpected = [
        { label: 'IN', direction: INPUT },
        { label: 'OUT1', direction: OUTPUT },
        { label: 'OUT2', direction: OUTPUT },
        { label: 'IN', direction: OUTPUT },
      ].map(Helper.defaultizePin);

      assert.deepEqual(Pin.normalizeEmptyPinLabels(pins), pinsExpected);
    });
  });

  describe('induceVariadicPinLabel', () => {
    it('Empty label -> Empty label', () => {
      assert.strictEqual(Pin.induceVariadicPinLabel(0, ''), '');
      assert.strictEqual(Pin.induceVariadicPinLabel(1, ''), '');
    });
    it('FOO -> FOO2, FOO -> FOO3', () => {
      assert.strictEqual(Pin.induceVariadicPinLabel(0, 'FOO'), 'FOO2');
      assert.strictEqual(Pin.induceVariadicPinLabel(1, 'FOO'), 'FOO3');
    });
    it('X3 -> X4, X3 -> X5', () => {
      assert.strictEqual(Pin.induceVariadicPinLabel(0, 'X3'), 'X4');
      assert.strictEqual(Pin.induceVariadicPinLabel(1, 'X3'), 'X5');
    });
  });
});
