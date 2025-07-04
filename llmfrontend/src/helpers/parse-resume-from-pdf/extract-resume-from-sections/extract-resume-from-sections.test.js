import {
  matchOnlyLetterSpaceOrPeriod,
  matchEmail,
  matchPhone,
  matchUrl,
} from "./extract-profile";

const makeTextItem = (text) => ({
  text,
});

describe("extract-profile tests - ", () => {
  it("Name", () => {
    expect(
        matchOnlyLetterSpaceOrPeriod(makeTextItem("Leonardo W. DiCaprio"))[0]
    ).toBe("Leonardo W. DiCaprio");
  });

  it("Email", () => {
    expect(matchEmail(makeTextItem("  hello@open-resume.org  "))[0]).toBe(
        "hello@open-resume.org"
    );
  });

  it("Phone", () => {
    expect(matchPhone(makeTextItem("  (123)456-7890  "))[0]).toBe(
        "(123)456-7890"
    );
  });

  it("Url", () => {
    expect(matchUrl(makeTextItem("  linkedin.com/in/open-resume  "))[0]).toBe(
        "linkedin.com/in/open-resume"
    );
    expect(matchUrl(makeTextItem("hello@open-resume.org"))).toBeFalsy();
  });
});
