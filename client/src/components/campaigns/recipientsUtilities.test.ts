import {
  areSomeTruthy,
  countStateTruthy,
  handleCheckedAll,
  handleUncheckedAll,
} from "./recipientsUtilities";

describe("ActiveSubscribersPopup utilities", () => {
  it("checks and unchecks all checkboxes", () => {
    const setState = vi.fn();

    handleCheckedAll(setState, [false, true, false]);
    handleUncheckedAll(setState, [false, true, false]);

    expect(setState).toHaveBeenNthCalledWith(1, [true, true, true]);
    expect(setState).toHaveBeenNthCalledWith(2, [false, false, false]);
  });

  it("counts the checked checkboxes", () => {
    expect(countStateTruthy([true, false, true])).toBe(2);
    expect(areSomeTruthy([false, false])).toBe(false);
    expect(areSomeTruthy([false, true])).toBe(true);
  });
});
