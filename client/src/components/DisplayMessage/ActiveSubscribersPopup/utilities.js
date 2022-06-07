function handleUncheckedAll(setCheckedState, checkedState) {
  setCheckedState(checkedState.map((v) => false));
}

function handleCheckedAll(setCheckedState, checkedState) {
  setCheckedState(checkedState.map((v) => true));
}

function areSomeTruthy(arr) {
  return arr.includes(true);
}

function countStateTruthy(arr) {
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
