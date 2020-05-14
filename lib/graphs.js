/* eslint guard-for-in: "off" */
/* eslint-disable camelcase */

"use strict";

class DirectedGraph {
  /**
   * Graph data structure used in Graph Transliterator.
   * @constructor
   * @param {object} edge
   *   Mapping from head to tail of edge, holding edge data
   * @param {Array} node
   *   Array of node attributes
   * @param {Array} edge_list
   *   Array of head and tail of each edge
   *
   * @class DirectedGraph
   */
  constructor(node, edge, edgeList) {
    this.node = node ? node : [];
    this.edge = edge ? edge : {};
    this.edge_list = edgeList || [];

    if (edge && !edgeList) {
      for (const headKey in edge) {
        for (const edgeKey in edge[headKey]) {
          this.edge_list.push([parseInt(headKey, 10), parseInt(edgeKey, 10)]);
        }
      }
    }
  }

  /**
   *
   * @param {object} nodeData - Attributes for node
   * @returns {Array.<number, number>} - Index of new node
   */
  addNode(nodeData) {
    if (!nodeData) {
      nodeData = [];
    }

    let nodeKey = this.node.length;
    this.node.push(nodeData);
    return [nodeKey, this.node[nodeKey]];
  }

  /**
   * Add new edge.
   *
   * @param {number} head - Index of head of edge
   * @param {number} tail - Index of tail of edge
   * @param {Object} edgeData - Attributes of edge
   * @returns {Object} - Reference to new edge
   */
  addEdge(head, tail, edgeData) {
    if (!edgeData) {
      edgeData = {};
    }

    if (!(head in this.edge)) {
      this.edge[head] = {};
    }

    this.edge[head][tail] = edgeData;
    this.edge_list.push([head, tail]);
    return this.edge[head][tail];
  }
}

module.exports = { DirectedGraph };
