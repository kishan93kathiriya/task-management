function addNumbers(number1: number, number2: number) {
  return number1 + number2;
}

describe('Example Test', () => {
  it('Testing', () => {
    expect(addNumbers(2, 2)).toEqual(4);
  });
});
