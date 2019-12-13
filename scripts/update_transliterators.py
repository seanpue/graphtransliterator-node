# -*- coding: utf-8 -*-

"""Console script for graphtransliterator-node to update transliterators."""

import graphtransliterator
import graphtransliterator.transliterators
import jinja2
import json
import os

GRAPHTRANSLITERATOR_NODE_DIR_BASENAME = "graphtransliterator-node"
JS_CLASS_SOURCE = """
const {{ class_name }}Settings = require("./{{ json_filen }}");
const GraphTransliterator = require("../../GraphTransliterator.js").default
  .GraphTransliterator;
const {{ class_name }}Transliterator = GraphTransliterator.fromDict({{ class_name }}Settings);
module.exports = {{ class_name }}Transliterator;

""".lstrip()
PATH_TO_GRAPHTRANSLITERATOR_NODE = "."
TRANSLITERATORS_PATH = os.path.join(PATH_TO_GRAPHTRANSLITERATOR_NODE, "lib", "transliterators")

overwrite_classes = False

def test_cwd():
    """Check running from root directory of node module."""
    cwd = os.getcwd()
    _ = GRAPHTRANSLITERATOR_NODE_DIR_BASENAME
    assert os.path.basename(cwd) == _, f"Not in root directory of {_}."
    assert os.path.exists(TRANSLITERATORS_PATH), f"{TRANSLITERATORS_PATH} does not exist."

def make_json():
    """Copy JSON file."""
    try:
        os.mkdir(js_path)
    except FileExistsError:
        pass

    filen = os.path.join(js_path, json_filen)
    try:
        with open(filen, "r") as f:
            js_json = json.load(f)
        if js_json['metadata']['version'] <= version:
            print(f"   Skipping {json_filen}.")
            return
    except FileNotFoundError:
        pass
    
    with open(filen, "w") as f:
        json.dump(transliterator_data, f)

def make_class():
    """Create Node class."""
    output = template.render(class_name=class_name, json_filen=json_filen)
    filen = os.path.join(js_path, class_filen)
    try:
        if not overwrite_classes:
            with open(filen, "r") as f:
                js_module = f.read()
            if js_module == output:
                print(f"   Skipping {class_filen}.")
                return
    except FileNotFoundError:
        pass
    print(f"Writing {class_filen}...") 
    with open(filen, "w") as f:
        f.write(output)


if __name__ == "__main__":
    print("Updating transliterators")
    test_cwd()
    template = jinja2.Template(JS_CLASS_SOURCE)
    for transliterator in graphtransliterator.transliterators.iter_transliterators():
        class_name = type(transliterator).__name__
        module_name = transliterator.name
        json_filen = os.path.join(transliterator.directory, module_name) + ".json"
        with open(json_filen, 'r') as f:
            transliterator_data = json.load(f)
            version = transliterator_data['metadata']['version']
        js_path = os.path.join(TRANSLITERATORS_PATH, module_name)
        json_filen = module_name + ".json"
        class_filen = class_name + ".js"
        make_json()
        make_class()
   