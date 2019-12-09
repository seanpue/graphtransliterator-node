[Unreleased - Maybe]
--------------------
* Add flag for logging full errors or just descriptive message
* Allow for minimized JSON processing (removal of null, etc)

[Unreleased - To Do]
--------------------
* Add documentation

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
* Initialized using yeoman node

