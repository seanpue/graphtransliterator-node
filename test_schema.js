// /* eslint-disable camelcase */
// var Ajv = require("ajv");
// var ajv = new Ajv({ useDefaults: true });
// var data = require("./test_config.json");

/* Cut
var RULE_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      production: { type: "string" },
      prev_classes: {
        type: ["array", "null"],
        items: { type: "string" }
        default: null
      },
      prev_tokens: {
        type: ["array", "null"],
        items: { type: "string" }
        default: null
      },
      tokens: {
        type: "array",
        items: { type: "string" }
      },
      next_tokens: {
        type: ["array", "null"],
        items: { type: "string" } 
        default: null
      },
      next_classes: {
        type: ["array", "null"],
        items: { type: "string" }
        default: null
      },
      cost: { type: "number" }
    },
    required: ["tokens", "cost"]
  }
};
*/

/* The basic_schema just fills in rules */
/*
const basicSchema = {
  type: "object",
  properties: {
    rules: RULE_SCHEMA
  }
}; */
/* MORE DETAILED SCHEMA

incomplete; save for later.

var schema = {
  type: "object",
  required: ["tokens", "rules", "tokenizer_pattern", "whitespace", "graph"
],
  properties: {
    tokens: {
      type: "object",
      patternProperties: {
        "^.*$": {
          type: "array",
          items: { type: "string" }
        }
      }
    },
    rules: ,
    whitespace: {
      type: "object",
      properties: {
        default: { type: "string" },
        token_class: { type: "string" },
        consolidate: { type: "boolean" }
      }
    },
    onmatch_rules: {
      type: "array",
      items: {
        type: "object",
        properties: {
          prev_classes: {
            type: "array",
            items: { type: "string" }
          },
          next_classes: {
            type: "array",
            items: { type: "string" }
          },
          production: { type: "string" }
        }
      },
      default: null
    },
    metadata: {
      type: "object",
      default: {}
    },
    ignore_errors: {
      type: "boolean",
      default: false
    },
    tokenizer_pattern: {
      type: "string"
    },
    graphtransliterator_version: {
      type: "string",
      default: "joe"
    },
    graph: {
      type: "object",
      properties: {
        node: {
          type: "array",
          items: {
            type: "object",
            properties: {
              "type": {"type": "string"},
              "ordered_children": {"type": "object"},
              "token": {"type": "string"},
              "rule_key": {"type": "number" },
              "rule": RULE_SCHEMA,
              accepting: { type: "boolean" },
            }
          }
        }
      }

    }
  }
}; */
// let valid = ajv.validate(schema, data);
// console.log(data);
// if (!valid) console.log(ajv.errors);
