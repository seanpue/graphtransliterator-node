.. highlight:: shell

============
Contributing
============

Contributions are welcome, and they are greatly appreciated! Every little bit
helps, and credit will always be given.

Contributor Code of Conduct
---------------------------
Please note that this project is released with a :doc:`Contributor Code of
Conduct <code_of_conduct>`. By participating in this project you agree to
abide by its terms.

Types of Contributions
----------------------

You can contribute in many ways:

Report Bugs
~~~~~~~~~~~

Report bugs at https://github.com/seanpue/graphtransliterator-js/issues.

If you are reporting a bug, please include:

* Your operating system name and version.
* Any details about your local setup that might be helpful in troubleshooting.
* Detailed steps to reproduce the bug.

Fix Bugs
~~~~~~~~

Look through the GitHub issues for bugs. Anything tagged with "bug" and "help
wanted" is open to whoever wants to implement it.

Implement Features
~~~~~~~~~~~~~~~~~~

Look through the GitHub issues for features. Anything tagged with "enhancement"
and "help wanted" is open to whoever wants to implement it.

Write Documentation
~~~~~~~~~~~~~~~~~~~

Graph-based Transliterator could always use more documentation, whether as part of the
official Graph Transliterator docs, in docstrings, or even on the web in blog posts,
articles, and such. Documentation is generated using `sphinx-js <https://github.com/mozilla/sphinx-js>`_.


Submit Feedback
~~~~~~~~~~~~~~~

The best way to send feedback is to file an issue at https://github.com/seanpue/graphtransliterator-js/issues.

If you are proposing a feature:

* Explain in detail how it would work.
* Keep the scope as narrow as possible, to make it easier to implement.
* Remember that this is a volunteer-driven project, and that contributions
  are welcome :)

Add Transliterators
~~~~~~~~~~~~~~~~~~~

We welcome new transliterators to be added to the bundled transliterators!

However, these should be added to Graph Transliterator, not Graph Transliterator Javscript.
See the Graph Transliterator documentation on `how to add a transliterator <https://graphtransliterator.readthedocs.io/en/latest/contributing.html#add-transliterators>`__.

Get Started!
------------

Ready to contribute? Here's how to set up ``graphtransliterator-js`` for local
development.

1. Fork the ``graphtransliterator-js`` repo on GitHub.

2. Clone your fork locally::

    $ git clone git@github.com:your_name_here/graphtransliterator-js.git

3. Create a branch for local development::

    $ git checkout -b name-of-your-bugfix-or-feature

   Now you can make your changes locally.

4. Run the tests::

    $ npm run test

   This will automatically generate coverage. Check that your changes are covered::

    $ make coverage

5. Commit your changes and push your branch to GitHub::

    $ git add .
    $ git commit -m "Your detailed description of your changes."
    $ git push origin name-of-your-bugfix-or-feature

6. Submit a pull request through the GitHub website.

Pull Request Guidelines
-----------------------

Before you submit a pull request, check that it meets these guidelines:

1. The pull request should include tests.
2. If the pull request adds functionality, the docs should be updated. Put
   your new functionality into a function with a docstring, and add the
   feature to the list in README.rst.
3. The pull request should work for Node 12, 13, and 14. Check
   https://travis-ci.org/seanpue/graphtransliterator-js/pull_requests
   and make sure that the tests pass for all supported Python versions.

Deploying
---------

Here is a reminder for the maintainers on how to deploy a new version::

  $ npm run update-transliterators
  $ npm version major
  $ git push --follow-tags
  $ npm publish
