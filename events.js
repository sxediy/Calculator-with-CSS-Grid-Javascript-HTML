const appCalculator = (() => {
  let expression = [];

  const validateMathSqrt = (target) => {
    const previousSymbol = input.value.slice(-1);
    if (previousSymbol === '√' || previousSymbol === '^' || previousSymbol === '.') return;
    expression.push(target.innerHTML);
    input.value = input.value + target.innerHTML;
  };

  const validateMathExponentiation = target => {
    const previousSymbol = input.value.slice(-1);
    const isPreviousNumber = !Object.is(Number(previousSymbol), NaN);
    if (!isPreviousNumber) return;
    expression.push(target.innerHTML);
    input.value = input.value + target.innerHTML;
   };
    
  const validatePoint = target => {
    const isPreviousNumber = !Object.is(Number(expression[expression.length-1]), NaN);
    const lastElement = expression[expression.length -1];
    const lastIndex = [expression.length -1];
    
    if (!isPreviousNumber || String(lastElement).indexOf('.') !== -1) return;
    if (isPreviousNumber) {
      expression.splice(lastIndex, 1,  lastElement + '.');
      input.value = input.value + target.innerHTML;
    }
  };

  const validateOther = target => { // формирование последовательности число-операнд-число-опранд-число...
    const isCurrentNumber = !Object.is(Number(target.innerHTML), NaN);
    const isCurrentOperand = Object.is(Number(target.innerHTML), NaN);
    const previousElement = expression[expression.length-1];
    const isPreviousNumber = !Object.is(Number(previousElement), NaN);
    const previousIndex = [expression.length-1];
    
    const input = document.getElementById('input');
    const previousSymbol =  input.value.slice(-1);

    if (isCurrentOperand && expression.length>0 && isPreviousNumber ) { // если сейчас нажали на +-*/, а прошлый символ ввода был цифрой
      if (previousSymbol === '.') return;

      expression.push(target.innerHTML);
      input.value = input.value + target.innerHTML;
    };

    if (isCurrentNumber) { // ли сейчас нажали на цифру
      input.value = input.value + target.innerHTML;

      if (isPreviousNumber) {
        expression.splice(previousIndex, 1, previousElement + target.innerHTML);
      }

      if (!isPreviousNumber) {
        expression.push(target.innerHTML);
      }
    }
  };


  const calculateResult = () => {
    console.log('ВНАЧАЛЕ', expression);

    const mathPower = (a, b) => Math.pow(a, b);
    const mathSqrt = (a, b) => Math.sqrt(a, b);
    const multiplication = (a, b) => a * b;
    const division = (a, b) => a / b;
    const subtraction = (a, b) => a - b;
    const sum = (a, b) => +a + +b;

    const reduceResult = (operand, func) => {
      const result = [];

      expression.reduce((accum, current) => {
        current === operand ? null :
          accum === operand ? result.push(func(result.pop(), current)) :
            result.push(current);
        return current;
      }, 0);

      console.log(`result ${operand}`, result);
      expression = result;
      return result;
    };

    const reduceResultSqrt = (operand, func) => {
      const result = [];

      expression.reduce((accum, current) => {
      
        if (current === operand)  null;
        if (accum === operand && result.length === 0) {
         return result.push('1', '*', func(current));          
        }
        if (accum === operand) {
          Object.is(+result.slice(-1), NaN) ?
           result.push(func(current)) :
           result.push('*', func(current));
        }
        if(accum !== operand && current !== operand) {
          result.push(current);          
        }
/* Рефакторинг
        current === operand ? null :
          accum === operand ?
            Object.is(+result.slice(-1), NaN) ? result.push(func(current)) :
              result.push('*', func(current))
            :
            result.push(current);
*/
        return current;
      }, 0);

      console.log(`result ${operand}`, result);
      expression = result;
      return result;
    };


    reduceResult('^', mathPower);
    reduceResultSqrt('√', mathSqrt);
    reduceResult('/', division);
    reduceResult('*', multiplication);
    reduceResult('−', subtraction);
    reduceResult('+', sum);

    return expression;
  };

  const handleClickOrPress = (e, target = e.target) => {
    e.preventDefault();
    const input = document.getElementById('input');
    input.style.color = '';

    if (target.nodeName !== 'BUTTON') return;

    switch (target.id) {
      case 'clear':
        input.value = '';
        expression = [];
        console.clear();
        break;

      case 'math-sqrt':
        validateMathSqrt(target);
        break;

      case 'math-exponentiation':
        validateMathExponentiation(target);
        break;

      case 'point':
        validatePoint(target);
        break;

      case 'equals':
        input.value = calculateResult();
        input.style.color = 'green';

        break;

      default:
        validateOther(target);
    }
  };

  const removeSymbol = e => {
    const input = document.getElementById('input');
    input.value = input.value.slice(0, -1);

    const lastElement = expression[expression.length -1];
    const lastIndex = [expression.length -1];

    if (lastElement.length === 1) {
      expression.pop();
    } else {
        expression.splice(lastIndex, 1, String(lastElement).slice(0, -1));
    }

    console.log(input.value, expression);
  };
  
  const handleKeyDown = e => {
    const key = e.keyCode;

    if (key === 96 || key === 48) handleClickOrPress(e, document.getElementById('0'));
    if (key === 97 || key === 49) handleClickOrPress(e, document.getElementById('1'));
    if (key === 98 || key === 50) handleClickOrPress(e, document.getElementById('2'));
    if (key === 99 || key === 51) handleClickOrPress(e, document.getElementById('3'));
    if (key === 100 || key === 52) handleClickOrPress(e, document.getElementById('4'));
    if (key === 101 || key === 53) handleClickOrPress(e, document.getElementById('5'));
    if (key === 102 || key === 54) handleClickOrPress(e, document.getElementById('6'));
    if (key === 103 || key === 55) handleClickOrPress(e, document.getElementById('7'));
    if (key === 104 || key === 56) handleClickOrPress(e, document.getElementById('8'));
    if (key === 105 || key === 57) handleClickOrPress(e, document.getElementById('9'));
    if (key === 46 || key === 27) handleClickOrPress(e, document.getElementById('clear'));
    if (key === 106) handleClickOrPress(e, document.getElementById('multi'));
    if (key === 111) handleClickOrPress(e, document.getElementById('division'));
    if (key === 109) handleClickOrPress(e, document.getElementById('minus'));
    if (key === 107) handleClickOrPress(e, document.getElementById('plus'));
    if (key === 13) handleClickOrPress(e, document.getElementById('equals'));
    if (key === 110) handleClickOrPress(e, document.getElementById('point'));
    if (key === 8) removeSymbol(e);
  };

    document.getElementById('calc').addEventListener('click', handleClickOrPress, false);
    document.addEventListener('keydown', handleKeyDown, false);
})();