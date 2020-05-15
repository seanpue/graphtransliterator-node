.. -------------------------------------------------------------------------------------
.. Note:
..     This is a documentation source file for Graph Transliterator Javascript.
..     Certain links and other features will not be accessible from here.
.. Links:
..     - Documentation: https://graphtransliterator-js.readthedocs.org
..     - NPM: https://www.npmjs.com/package/graphtransliterator
..     - Repository: https://github.com/seanpue/graphtransliterator-js/
.. -------------------------------------------------------------------------------------

===============================
Graph Transliterator Javascript
===============================

.. image:: https://badge.fury.io/js/graphtransliterator.svg
   :target: https://badge.fury.io/js/graphtransliterator.svg
   :alt: NPM version

.. image:: https://travis-ci.com/seanpue/graphtransliterator-js.svg?branch=master
   :target: https://travis-ci.com/seanpue/graphtransliterator-js.svg?branch=master
   :alt: Build Status

.. image:: https://david-dm.org/seanpue/graphtransliterator-js.svg?theme=shields.io
   :target: https://david-dm.org/seanpue/graphtransliterator-js.svg?theme=shields.io
   :alt: Dependency Status

.. image:: https://coveralls.io/repos/seanpue/graphtransliterator-js/badge.svg
   :target: https://coveralls.io/repos/seanpue/graphtransliterator-js/badge.svg
   :alt: Coverage percentage

========================================================================================


A partial Javascript/Node implementation of `Graph Transliterator <https://graphtransliterator.rtfd.io>`__, 
graph-based transliteration tool that lets you convert the symbols of one
language or script to those of another using rules that you define.

* Free software: MIT license
* Documentation: https://graphtransliterator-js.readthedocs.io
* NPM: https://www.npmjs.com/package/graphtransliterator
* Repository: https://github.com/seanpue/graphtransliterator-js

Transliteration... What? Why?
-----------------------------

Moving text or data from one script or encoding to another is a common problem:

- Many languages are written in multiple scripts, and many people can only read one of
  them. Moving between them can be a complex but necessary task in order to make
  texts accessible.

- The identification of names and locations, as well as machine translation,
  benefit from transliteration.

- Library systems often require metadata be in particular forms of romanization in
  addition to the original script.

- Linguists need to move between different methods of phonetic transcription.

- Documents in legacy fonts must now be converted to contemporary Unicode ones.

- Complex-script languages are frequently approached in natural language processing and
  in digital humanities research through transliteration, as it provides disambiguating
  information about pronunciation, morphological boundaries, and unwritten elements not
  present in the original script.


`Graph Transliterator <https://graphtransliterator.rtfd.io>`__ abstracts transliteration, offering 
an "easy reading" method for developing transliterators that does not require writing 
a complex program. It also contains bundled transliterators that are rigorously tested. 
These can be expanded to handle many transliteration tasks.

Graph Transliterator Javascript provides **access to Graph Transliterator's bundled transliterators**,
as well as **any JSON-dumped graph transliterator**. 

Features
--------

Graph Transliterator Javascript provides:

   * a partial Javascript/Node implementation of `Graph Transliterator <https://graphtransliterator.readthedocs.io/>`__ (a Python library and CLI)
   * bundled transliterators from Graph Transliterator
   * processing of the JSON dump of a Graph Transliterator
   * convenient client-side Javascript libraries

Installation
------------

Graph Transliterator Javascript is a Node.js module. It can be installed using ``npm``:

.. code-block::

   $ npm install --save graphtransliterator

It can also be used independently as a client-side Javascript library.
