import { describe, expect, it } from 'bun:test';
import { NodeRedOptsMock } from 'epdoc-node-red-hautil';
import { isArray, isObject } from 'epdoc-util';
import { InputPayload, PingConfig, PingContext } from '../src/ping-context';

describe('ping-context', () => {
  describe('group1', () => {
    const mock: NodeRedOptsMock = new NodeRedOptsMock();
    const input: InputPayload = {
      id: 'mytest',
      name: 'My Test',
      data: [
        {
          timeout: 2000,
          hosts: ['google']
        },
        {
          timeout: 4000,
          hosts: ['apple']
        }
      ]
    };
    mock.db.flow.test = {};
    let ctx: PingContext;
    const tNow = new Date().getTime();
    it('constructor', () => {
      let rounds = [
        {
          hosts: ['google'],
          responses: 0,
          timeout: 2000
        },
        {
          hosts: ['apple'],
          responses: 0,
          timeout: 4000
        }
      ];
      ctx = new PingContext(mock.opts, input);
      expect(isObject(ctx)).toEqual(true);
      expect(ctx.short.id).toEqual(input.id);
      expect(ctx.short.name).toEqual(input.name);
      expect(ctx.short.busy).toEqual(true);
      expect(ctx.short.debug).toEqual(false);
      expect(ctx.short.busyAt)
        .toBeGreaterThan(tNow)
        .toBeLessThan(tNow + 100);
      expect(ctx.short.startDate)
        .toBeGreaterThan(tNow)
        .toBeLessThan(tNow + 100);
      expect(ctx.short.rounds).toEqual(rounds);
    });
    it('set busy', () => {
      ctx.setBusy();
      expect(ctx.busy).toEqual(true);
      expect(ctx.hasPingResponded(0)).toEqual(false);
      expect(ctx.haveAllPingsResponded(0)).toEqual(false);
      expect(ctx.isFirstRound(0)).toEqual(true);
      expect(ctx.isLastRound(0)).toEqual(false);
    });
    it('get ping payload', () => {
      const expected = [
        { host: 'google', timeout: 2000, start_date: 1698964169728, id: 'mytest', name: 'My Test', round: 0 }
      ];
      const p: PingConfig[] = ctx.getPingPayload(0);
      expect(isArray(p)).toEqual(true);
      expect(p.length).toEqual(1);
      expect(p[0].host).toEqual(input.data[0].hosts[0]);
      expect(p[0].timeout).toEqual(input.data[0].timeout);
      expect(p[0].start_date)
        .toBeGreaterThan(tNow)
        .toBeLessThan(tNow + 100);
      expect(p[0].id).toEqual(input.id);
      expect(p[0].name).toEqual(input.name);
      expect(p[0].round).toEqual(0);
    });
    it('test', () => {});
    it('test', () => {});
    it('test', () => {});
    it('test', () => {});
  });
});
``;