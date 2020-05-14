const { transliterators } = require("../index.js");

describe("Bundled transliterators", () => {
  let x = Object.entries(transliterators).filter(
    ([, b]) => b instanceof transliterators.Bundled
  );
  it("has bundled transliterators", () => {
    expect(x.length >= 2);
  });
  x.forEach(([name, bundledTransliterator]) => {
    describe(`${name} transliterator`, () => {
      let tests = bundledTransliterator.tests;
      it("has tests", () => {
        expect(bundledTransliterator.tests.length > 1);
      });
      for (let [input, output] of Object.entries(tests)) {
        it(`can transliterate ${input} as ${output}`, () => {
          expect(bundledTransliterator.transliterate(input) === output);
        });
      }
    });
  });
});
