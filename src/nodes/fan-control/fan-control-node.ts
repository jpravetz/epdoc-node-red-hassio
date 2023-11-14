/*
import { Node, NodeAPI, NodeDef, NodeMessage } from 'node-red';

module.exports = function (RED: NodeAPI) {
  function FanControlNode(config: NodeDef) {
    // @ts-ignore
    RED.nodes.createNode(this as Node, config);
    // @ts-ignore
    let node: Node = this as Node;
    // @ts-ignore
    this.on('input', function (msg: NodeMessage) {
      // @ts-ignore
      msg.payload = msg.payload.toLowerCase();
      node.send(msg);
    });
  }
  RED.nodes.registerType('fan-control', FanControlNode);
};
*/

import { NodeRedDoneFunction, NodeRedSendFunction } from 'epdoc-node-red-hautil';
import { NodeInitializer, NodeMessage } from 'node-red';
import { FanControl } from './fan-control';
import { FanControlNode, FanNodeDef, isFanControlNodeOpts } from './types';

const nodeInit: NodeInitializer = (RED): void => {
  function FanControlNodeConstructor(this: FanControlNode, config: FanNodeDef) {
    try {
      console.log('FanControlNode');
      RED.nodes.createNode(this, config);
      let node: FanControlNode = this as FanControlNode;

      if (!isFanControlNodeOpts(config)) {
        return;
      }
      // this.server = RED.nodes.getNode(config.server);
      // if (this.server) {
      // }

      // const processMsg = async (msg: NodeMessage, send: NodeRedSendFunction, done: NodeRedDoneFunction) => {
      //   console.log('process message');
      //};
      const processMsg = async (msg: NodeMessage, send: NodeRedSendFunction, done: NodeRedDoneFunction) => {
        const fanCtrl = new FanControl(node, msg, send, done);
        fanCtrl.setUiConfig(config);
        fanCtrl.setPayloadConfig(msg.payload);
        fanCtrl.run().then((resp) => {
          fanCtrl.done();
        });
      };

      const done = () => {
        console.log('done');
      };

      this.on('input', processMsg);
      this.on('close', done);
    } catch (err) {
      console.log(err);
    }
  }
  RED.nodes.registerType('fan-control', FanControlNodeConstructor);
};

module.exports = nodeInit;