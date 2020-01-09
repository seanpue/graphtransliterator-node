"use strict";

const assert = require("assert");
const graphtransliterator = require("../index.js");
const DirectedGraph = graphtransliterator.DirectedGraph;

describe("DirectedGraph", () => {
  it("can be created.", () => {
    let graph = new DirectedGraph();
    assert(graph);
    assert(graph.node.length === 0);
    assert(graph.edge);
  });
  it("can be added to", () => {
    let graph = new DirectedGraph();
    graph.addNode({ type: "test1" });
    graph.addNode({ type: "test2" });
    assert(graph.node.length === 2);
    graph.addEdge(0, 1, { type: "edge_test1" });
    assert(graph.edge[0][1].type === "edge_test1");
    graph.addNode();
    graph.addEdge(1, 2);
    assert(graph.edge_list.length === 2);
    let dg = new DirectedGraph(graph.node, graph.edge);
    assert(dg.edge_list);
  });
});
