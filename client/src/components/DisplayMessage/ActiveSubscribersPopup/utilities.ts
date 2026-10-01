type SetCheckedState = (checkedState: boolean[]) => void;

function handleUncheckedAll(
  setCheckedState: SetCheckedState,
  checkedState: boolean[]
) {
  setCheckedState(checkedState.map(() => false));
}

function handleCheckedAll(
  setCheckedState: SetCheckedState,
  checkedState: boolean[]
) {
  setCheckedState(checkedState.map(() => true));
}

function areSomeTruthy(arr: boolean[]) {
  return arr.includes(true);
}

function countStateTruthy(arr: boolean[]) {
  let count = 0;

  for (const val of arr) {
    if (val) {
      count++;
    }
  }

  return count;
}

export {
  handleUncheckedAll,
  handleCheckedAll,
  areSomeTruthy,
  countStateTruthy,
};
