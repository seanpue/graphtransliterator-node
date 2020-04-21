[Unreleased - Maybe]
--------------------

* Add flag for logging full errors or just descriptive message
* Add multiple JS core versions
* Reconsider babel, ecmascript configuration
* Add compression functions
* add tests? Bundled are pretested in Python, but it might be useful.
* remove stripEmpty calls from compress.js
[Unreleased - To Do]
--------------------

* Make sure if works in Vue, etc.
* Add documentation (using sphinx-js?)


?.?.? (xx-xx-xxxx)
------------------

* disabled stripEmpty() in compress.js; will likely remove
* added "jest--coverage &&" to .travis.yml after_script to provide coverage info to coveralls
* removed transliterator directories with differently cased names remaining on github
* rewrote transliterators/index.js with some struggle due to file name errors on travis due
* wrote scripts/updateTransliterators.js and changed bundled transliterator naming format
* Added decompressSettings in compress.js
* Updated bundled transliterators with faster (less to download and quicker to load than expanded JSON) compressed versions

0.4.2 (01-11-2020)
------------------

* removed lib/__tests__ from dist

0.4.1 (01-10-2020)
------------------

* adjusted node engine requirement in package.json
* fixed files setting in package.json to include lib

0.4.0 (01-10-2020)
------------------

* Removed esm support due to difficulty configuring to work with jest
* Added support for compressed graphs
* Added graph creation as fromGraph(), as well as onmatchRulesLookupOf(), tokensByClassOf()
* Added esm for ecmascript management

0.3.0 (12-13-2019)
------------------

* Adjusted webpack.config.js to generate transliterators with babel
* Added update script to copy graphtransliterator transliterators into transliterators
* Added webpack yielding dist/GraphTranliterator.node.js and
  dist/GraphTransliterator.
* Added babel to client config converting from ES6 to CoreJS 3.0

0.2.0 (12-10-2019)
------------------

* Added matchAllAt() to GraphTransliterator
* Added console logging of error message or throwing of errors if
  ignoreErrors is false. 
* Added NoMatchingTransliterationRuleError, UnrecognizableInputError,
  GraphTransliteratorError
* Changed from Python version by switching to details from tokenize(),
  including position in string, unrecognizable characters, whitespace
* Fixed capitalization in index.js for Travis CI
* Added tests for coverage of all transliteration so far
* Implemented basic transliteration functionality from detailed JSON
* Added lib/__tests__/graphtransliterator.test.js
* Added lib/__tests__/test_config.json and test_config.yaml
* Restored afterscript to travis.yml and removed script from package.json
* Added GraphTransliterator.js
* Began constructor for GraphTransliterator

0.1.0 (12-03-2019)
------------------

* Added coveralls script to package.json
* Moved afterscript to script in travis.yml following coveralls docs
* Added .coveralls.yml (locally)
* Added travis status badge
* Restricted to node >= 12.0.0 in package.json
* Removed pre-12 versions of node from .travis.yml
* Added HISTORY.md
* Initialized using yeoman node [https://github.com/yeoman/generator-node]
