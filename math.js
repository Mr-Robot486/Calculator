let display = document.getElementById('display');
let buttons = document.querySelectorAll('button');

let string = "";
let isResult = false; // The "Reset Flag"

buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let value = e.target.value;
        const operators = ["+", "-", "×", "÷", "%", "²"];

        // 1. Check if we should clear the screen for a new number
        if (isResult && !operators.includes(value) && value !== "=" && value !== "DEL" && value !== "AC") {
            string = ""; // Clear for a fresh number
            isResult = false;
        } else {
            isResult = false; // If  hit an operator, keep the result and continue
        }

        // 2. Standard Logic
        if (value === "DEL") {
            string = string.slice(0, -1);
        } else if (value === "AC") {
            string = '';
        } else if (value === "=") {
            string = calculate(string).toString();
            isResult = true; // flag after calculation
        } else if (value === "()") {
            // Toggle Logic
            const openCount = (string.match(/\(/g) || []).length;
            const closeCount = (string.match(/\)/g) || []).length;
            const lastChar = string.slice(-1);

            if (openCount > closeCount && !["+", "-", "×", "÷", "("].includes(lastChar)) {
                string += ")";
            } else {
                string += "(";
            } 
        } else {
        if (value === "sqrt")
            string += "√(";
        else if (value === "square")
            string += "²";
        else if (value === "log")
            string += "log(";
        else if (value === "ln")
            string += "ln(";
        else 
            string += value;
        }

        display.value = string || "0";
    });
});

if (string === "Math Error") {
    string = "";
}

function calculate(expression) {
    try {
        // 1. Basic Operator Mapping
        let formatted = expression
            .replace(/÷/g, '/')
            .replace(/×/g, '*');

        // 2. IMPLICIT MULTIPLICATION 
        formatted = formatted
            .replace(/(\d)\(/g, '$1*(')        
            .replace(/\)(\d)/g, ')*$1')          
            .replace(/\)\(/g, ')*(')             
            .replace(/(\d)√/g, '$1*√')           
            .replace(/(\d)log/g, '$1*log')       
            .replace(/(\d)ln/g, '$1*ln');        

        formatted = formatted
            .replace(/√\(/g, 'Math.sqrt(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/(\d+(\.\d+)?)²/g, 'Math.pow($1, 2)') 
            .replace(/(\d+(\.\d+)?)%/g, '($1/100)');


        const openBrackets = (formatted.match(/\(/g) || []).length;
        const closeBrackets = (formatted.match(/\)/g) || []).length;
        if (openBrackets > closeBrackets) {
            formatted += ')'.repeat(openBrackets - closeBrackets);
        }

        if (!formatted.trim()) return "";
        
        let result = new Function("return " + formatted)();
        
        return parseFloat(Number(result).toPrecision(12));
    } catch (e) {
        return "Math Error";
    }
}

function formatResult(num) {
    if (isNaN(num) || num === Infinity) return "Error";
    
    // Check if the number has a long decimal trail
    // Number.EPSILON helps handle precision limits
    return parseFloat(num.toPrecision(12)); 
}

document.addEventListener("keydown", (e) => {
    if (!isNaN(e.key) || "+-.".includes(e.key)) {
        string += e.key;
    } else if (e.key === "/") {
        string += "÷";
    } else if (e.key === "*") {
        string += "×"; 
    } else if (e.key === "%") {
        string += "%";
    } else if (e.key === "Enter") {
        e.preventDefault();
        string = calculate(string).toString();
    } else if (e.key === "Backspace") {
        string = string.slice(0, -1);
    }
    display.value = string;
});
