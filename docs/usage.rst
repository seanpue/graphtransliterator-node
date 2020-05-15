.. -------------------------------------------------------------------------------------
.. Note:
..     This is a documentation source file for Graph Transliterator Javascript.
..     Certain links and other features will not be accessible from here.
.. Links:
..     - Documentation: https://graphtransliterator-js.readthedocs.org
..     - NPM: https://www.npmjs.com/package/graphtransliterator
..     - Repository: https://github.com/seanpue/graphtransliterator-js/
.. -------------------------------------------------------------------------------------

*****
Usage
*****

Graph Transliterator Javascript is accessed via the ``graphtransliterator`` module. It can load
bundled transliterators or custom graph transliterators dumped as JSON.

Bundled Transliterators
=======================

Graph Transliterator Javascript contains a number of bundled transliterators that match up with
those provided by Graph Transliterator.  New contributions to the bundled transliterators are
welcome. Please see the Graph Transliterator 
`documentation on how to bundle a transliterator <https://graphtransliterator.readthedocs.io/en/latest/advanced_tutorial.html>`__.

Server-side Usage
-----------------

Graph Transliterator Javascript can be run server-side, and it includes all bundled transliterators:

.. code-block:: javascript

   var graphtransliterator = require("graphtransliterator");
   // Includes bundled transliterators
   var transliterator = graphtransliterator.transliterators.ITRANSDevanagariToUnicode;
   transliterator.transliterate("namaskAr")

.. code-block:: javascript

   "नमस्कार"

Client-side Usage
-----------------

Graph Transliterator can also be accessed as a client-side Javascript library (``graphtransliterator.js``) that
loads the Javascript library ``graphtransliterator`` and contains bundled transliterators in ``graphtransliterator.transliterators``:

.. code-block:: html

  <script src="https://unpkg.com/graphtransliterator/dist/graphtransliterator.js"></script>
  <script>
      var gt = graphtransliterator.transliterators.ITRANSDevanagariToUnicode;
      console.log(
        gt.transliterate("namaste")
      );
  </script>

.. code-block:: javascript

   "नमस्ते"

Each bundled transliterator can be accessed as a stand-alone Javascript library (e.g., ``graphtransliterator.Example.js``):

.. code-block:: html

   <script src="https://unpkg.com/graphtransliterator/dist/GraphTransliterator.ITRANSDevanagariToUnicode.js"></script>
   <script>
       console.log(ITRANSDevanagariToUnicode.transliterate("praNAm"));  
   </script>

.. code-block:: javascript

  "प्रणाम"

JSON Graph Transliterators
==========================

Graph Transliterator, a Python library and CLI, supports configuration using an `"easy-reading" YAML format <https://graphtransliterator.readthedocs.io/en/latest/usage.html>`__ for entering transliteration rules:

.. code-block:: yaml

  tokens:
    a: [vowel]               # type of token ("a") and its class (vowel)
    bb: [consonant, b_class] # type of token ("bb") and its classes (consonant, b_class)
    ' ': [wb]                # type of token (" ") and its class ("wb", for wordbreak)
  rules:
    a: A       # transliterate "a" to "A"
    bb: B      # transliterate "bb" to "B"
    a a: <2AS> # transliterate ("a", "a") to "<2AS>"
    ' ': ' '   # transliterate ' ' to ' '
  whitespace:
    default: " "        # default whitespace token
    consolidate: false  # whitespace should not be consolidated
    token_class: wb     # whitespace token class

Graph Transliterator Javascript does not support YAML input. It can only read **JSON dumped settings**. See the CLI command `graphtransliterator dump <https://graphtransliterator.readthedocs.io/en/latest/cli.html#dump>`__
or the Python API's `GraphTransliterator.dumps() <https://graphtransliterator.readthedocs.io/en/latest/usage.html#serialization-and-deserialization>`__.

The above example would be dumped using a simple compression as follows:

.. code-block:: javascript

    {"graphtransliterator_version":"1.2.0","compressed_settings":[["b_class","consonant","vowel","wb"],[" ","a","bb"],[[3],[2],[0,1]],[["<2AS>",0,0,[1,1],0,0,-2],["A",0,0,[1],0,0,-1],["B",0,0,[2],0,0,-1],[" ",0,0,[0],0,0,-1]],[" ","wb",0],0,{},null]}

Server-Side Loading from JSON
-----------------------------

To load from the server, create a new ``GraphTransliterator``:

.. code-block:: javascript

    { GraphTransliterator } = require("graphtransliterator");
    // The dumped settings are the output of ``graphtransliterator dump -f bundled Example``
    var gt = GraphTransliterator(
      {"graphtransliterator_version":"1.2.0","compressed_settings":[["b_class","consonant","vowel","wb"],[" ","a","bb"],[[3],[2],[0,1]],[["<2AS>",0,0,[1,1],0,0,-2],["A",0,0,[1],0,0,-1],["B",0,0,[2],0,0,-1],[" ",0,0,[0],0,0,-1]],[" ","wb",0],0,{},null]});
    );
    gt.transliterate("a");

Client-Side Loading from JSON
-----------------------------

The Graph Transliterator class (``graphTransliterator.GraphTransliterator``), without bundled transliterators, is available from the main library (``graphtransliterator.js``). 

The class, without the bundled transliterators, is distributed as ``graphtransliterator.GraphTransliterator.js``:

.. code-block:: html

   <script src="https://unpkg.com/graphtransliterator/dist/graphtransliterator.Graphtransliterator.js"></script>
   <script>
       // The dumped settings are the output of ``graphtransliterator dump -f bundled Example``
       var settings = {"graphtransliterator_version":"1.2.0","compressed_settings":[["consonant","vowel","whitespace"],[" ","a","b"],[[2],[1],[0]],[["!B!",[0],[1],[2],[1],[0],-5],["A",0,0,[1],0,0,-1],["B",0,0,[2],0,0,-1],[" ",0,0,[0],0,0,-1]],[" ","whitespace",0],[[[1],[1],","]],{"name":"example","version":"1.0.0","description":"An Example Bundled Transliterator","url":"https://github.com/seanpue/graphtransliterator/tree/master/transliterator/sample","author":"Author McAuthorson","author_email":"author_mcauthorson@msu.edu","license":"MIT License","keywords":["example"],"project_urls":{"Documentation":"https://github.com/seanpue/graphtransliterator/tree/master/graphtransliterator/transliterators/example","Source":"https://github.com/seanpue/graphtransliterator/tree/graphtransliterator/transliterators/example","Tracker":"https://github.com/seanpue/graphtransliterator/issues"}},null]};
       var gt = graphtransliterator.GraphTransliterator(settings);
       console.log(
          gt.transliterate("a")
       );
   </script>

