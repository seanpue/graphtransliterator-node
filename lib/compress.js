/* eslint-disable camelcase */

function decompressSettings(compressedSettings) {
  function decompressedCost(x) {
    // """x will be negative."""
    return Math.log2(1 + 1 / (1 - x));
  }

  function decompressNode(_node) {
    function decompressedOrderedChildren(index) {
      let x = _node[index];
      let out = {};
      for (let [k, v] of Object.entries(x)) {
        k = parseInt(k, 10);
        if (k === -1) {
          out.__rules__ = v;
        } else {
          out[tokenFromId[k]] = v;
        }
      }

      return out;
    }

    let nodeType = nodeTypeFromId[_node[0]];
    let accepting = _node[1] === 1 || false;
    let newNode = {};
    if (nodeType === "Start") {
      newNode = {
        type: nodeType,
        accepting: accepting,
        ordered_children: decompressedOrderedChildren(2)
      };
    } else if (nodeType === "rule") {
      newNode = { type: nodeType, accepting: accepting, rule_key: _node[2] };
    } else if (nodeType === "token") {
      newNode = {
        type: nodeType,
        accepting: accepting,
        token: tokenFromId[_node[2]],
        ordered_children: decompressedOrderedChildren(3)
      };
    }

    return stripEmpty(newNode);
  }

  function stripEmpty(obj) {
    /* Operates directly on object */
    /* this may no longer be necessary due to new compression? */
    /* Object.keys(obj).forEach(key => {
      if (obj[key] === null) {
        delete obj[key];
      } else if (obj[key] === {}) {
        delete obj[key];
      }
    }); */
    return obj;
  }

  function decompressEdgeData(data) {
    let [_constraints, _cost, _token] = data;

    let out = {};

    function classFromIdsOf(index) {
      let v = _constraints[index];
      // If (v === 0) return undefined;
      return v.map(el => classFromId[el]);
    }

    function tokenFromIdsOf(index) {
      let v = _constraints[index];
      //   Z if (v === 0) return undefined;
      return v.map(el => tokenFromId[el]);
    }

    if (_constraints) {
      // Filter out unused values
      out.constraints = stripEmpty({
        prev_classes: classFromIdsOf(0),
        prev_tokens: classFromIdsOf(1),
        next_tokens: tokenFromIdsOf(2),
        next_classes: classFromIdsOf(3)
      });
    }

    out.cost = decompressedCost(_cost);

    if (_token !== -1)
      //  -1 indicates no token
      out.token = tokenFromId[_token];

    return out;
  }

  let [
    classList,
    tokenList,
    _tokens, // _ indicates compression
    _rules,
    _whitespace,
    _onmatchRules,
    metadata,
    _graph
  ] = compressedSettings;

  // _tokenList = _token_list; /* Previous cast to list */
  let tokenFromId = tokenList; // {i: _ for i, _ in enumerate(_token_list)};
  let classFromId = classList; // {i: _ for i, _ in enumerate(classList)}
  let tokens = Object.assign(
    {},
    ...Object.entries(_tokens).map(([k, v]) => ({
      [tokenFromId[k]]: v.map(el => classFromId[el])
    }))
  );
  let rules = _rules.map(r => {
    return {
      production: r[0],
      prev_classes: r[1] ? r[1].map(el => classFromId[el]) : [],
      prev_tokens: r[2] ? r[2].map(el => tokenFromId[el]) : [],
      tokens: r[3].map(el => tokenFromId[el]),
      next_tokens: r[4] ? r[4].map(el => tokenFromId[el]) : [],
      next_classes: r[5] ? r[5].map(el => classFromId[el]) : [],
      cost: decompressedCost(r[6])
    };
  });
  let whitespace = {
    default: _whitespace[0],
    token_class: _whitespace[1],
    consolidate: _whitespace[2]
  };
  let onmatchRules = _onmatchRules
    ? _onmatchRules.map(r => {
        return {
          prev_classes: r[0].map(el => classFromId[el]),
          next_classes: r[1].map(el => classFromId[el]),
          production: r[2]
        };
      })
    : undefined;
  let graph;
  let nodeTypeFromId;
  if (_graph) {
    let [_nodetypeList, _nodes, _edges] = _graph;
    nodeTypeFromId = _nodetypeList; // {i: _ for i, _ in enumerate(_nodetype_list)}
    let node = _nodes.map(el => decompressNode(el));
    let edge = Object.assign(
      {},
      ...Object.entries(_edges).map(([k, v]) => ({
        [k]: Object.assign(
          {},
          ...Object.entries(v).map(([tail, _edgeData]) => ({
            [tail]: decompressEdgeData(_edgeData)
          }))
        )
      }))
    );
    graph = { node: node, edge: edge };
  }

  return {
    tokens: tokens,
    rules: rules,
    whitespace: whitespace,
    onmatch_rules: onmatchRules,
    graph: graph,
    metadata: metadata
  };
}

module.exports = { decompressSettings };
