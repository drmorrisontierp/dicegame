const dice = ["first", "second", "third", "fourth", "fifth", "sixth"];
const ops = ["+", "-", "/", "*"];
const digits = ["1", "2", "3", "4", "5", "6"];
const brackets = ["(", ")"];
let scoreCounter = 0;
let bonusCounter = 1;
let currentDie = "";
let dicePlusMemory = [];
let exprChars = [];
let exprDisplay = [];
let start = false;
let level = false;
const buttons = ["+", "-", "*", "/", "(", ")", "del", "clear", "throw"];
const memoryScreens = ["M1", "M2", "M3", "M4"];
let memoryFlags = { M1: false, M2: false, M3: false, M4: false };
let memoryDice = { M1: [], M2: [], M3: [], M4: [] };
let memoryExprs = { M1: [], M2: [], M3: [], M4: [] };

for (let b of buttons) {
    drawButton(b);
}
for (let m of memoryScreens) {
    drawButton(m);
}

let timeout = true;
document.getElementById("score").innerHTML = scoreCounter;
document.getElementById("bonus").innerHTML = bonusCounter;

// Function to create an SVG element
function createSVGElement(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

// Function to set attributes on an HTML element
function setAttributes(element, attributes) {
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
}

// Function to draw a button
function drawButton(id) {
    let label = id;
    if (!level && id == "(") {
        document.getElementById(id).onclick = () => {
            saveMemory();
        };
        label = "M";
    }
    if (!level && id == ")") {
        document.getElementById(id).onclick = () => {
            clearMemory();
        };
        label = "MC";
    }
    if (level && id == "(") {
        document.getElementById(id).onclick = () => {
            enter('(');
        };
        label = "(";
    }
    if (level && id == ")") {
        document.getElementById(id).onclick = () => {
            enter(')');
        };
        label = ")";
    }
    if (!level && id.includes("M")) {
        document.getElementById(id).onclick = () => {
            useMemory(id);
        };
    }
    if (id.includes("M")) label = "";
    let svg = createSVGElement("svg");
    let shadow = createSVGElement("rect");
    let base = createSVGElement("rect");
    let front = createSVGElement("rect");
    let text = createSVGElement("text");
    let node = document.createTextNode(label);
    text.appendChild(node);
    if (id.includes("M")) {
        setAttributes(svg, {
            width: "16vh",
            height: "16vh",
        });
        setAttributes(base, {
            id: "B" + id,
            rx: "5%",
            ry: "5%",
            x: "4%",
            y: "4%",
            width: "92%",
            height: "92%",
            stroke: "black",
            "stroke-width": "5%",
            fill: "darkcyan",
        });
        setAttributes(shadow, {
            rx: "5%",
            ry: "5%",
            x: "0%",
            y: "6%",
            width: "93%",
            height: "94%",
            fill: "#00000037",
        });
        setAttributes(front, {
            rx: "5%",
            ry: "5%",
            x: "4%",
            y: "4%",
            width: "92%",
            height: "92%",
            fill: "url(#Glass)",
        });
        setAttributes(text, {
            id: "T" + id,
            x: "50%",
            y: "62%",
            fill: "white",
            stroke: "black",
            "text-anchor": "middle",
            "font-size": "2em",
        });
        svg.appendChild(shadow);
        svg.appendChild(base);

        svg.appendChild(text);
        svg.appendChild(front);
    } else {
        setAttributes(svg, {
            width: "16vh",
            height: "16vh",
        });
        setAttributes(shadow, {
            rx: "5%",
            ry: "5%",
            x: "0%",
            y: "6%",
            width: "90%",
            height: "93%",
            fill: "#00000037",
        });
        setAttributes(base, {
            rx: "5%",
            ry: "5%",
            x: "4%",
            y: "4%",
            width: "92%",
            height: "92%",
            fill: "black",
        });
        setAttributes(front, {
            rx: "5%",
            ry: "5%",
            x: "8%",
            y: "4%",
            width: "86%",
            height: "86%",
            fill: "url(#Bob)",
        });
        setAttributes(text, {
            x: "50%",
            y: "62%",
            fill: "white",
            stroke: "black",
            "text-anchor": "middle",
            "font-size": "2em",
        });

        if (id == "throw") {
            svg.setAttribute("width", "32vh")
            base.setAttribute("fill", "#09371b");
        }
        if (id == "clear") base.setAttribute("fill", "#621a10");
        if (id == "del") base.setAttribute("fill", "#621a10");
        svg.appendChild(shadow);
        svg.appendChild(base);
        svg.appendChild(front);
        svg.appendChild(text);
    }
    document.getElementById(id).appendChild(svg);
}

// Function to handle the button press when it's pressed down
function buttonDown(id) {
    let svg = document.getElementById(id).children[0];
    let shadow = svg.children[0];
    let base = svg.children[1];
    let front = svg.children[2];
    let text = svg.children[3];
    setAttributes(shadow, {
        fill: "transparent",
    });
    setAttributes(front, {
        x: "6%",
        y: "6%",
        width: "88%",
        height: "88%",
    });
    setAttributes(text, {
        x: "48%",
        y: "65%",
    });
}

// Function to handle the button when it's released
function buttonUp(id) {
    let svg = document.getElementById(id).children[0];
    let shadow = svg.children[0];
    let base = svg.children[1];
    let front = svg.children[2];
    let text = svg.children[3];
    setAttributes(shadow, {
        fill: "#00000037",
    });
    setAttributes(front, {
        x: "8%",
        y: "4%",
        width: "86%",
        height: "86%",
    });
    setAttributes(text, {
        x: "50%",
        y: "62%",
    });
}

// Function to draw a dice with spots at specified coordinates
function drawDice(spotCoords) {
    let shading = [];
    let svg = createSVGElement("svg");
    let base = createSVGElement("rect");
    setAttributes(svg, {
        width: "100%",
        height: "100%",
    });
    setAttributes(base, {
        rx: "20%",
        ry: "20%",
        width: "100%",
        height: "100%",
        fill: "blue",
    });
    for (let i = 1; i < 5; i++) {
        let elem = createSVGElement("path");
        shading.push(elem);
    }
    for (let i = 0; i < 4; i++) {
        shading[i].setAttribute(
            "d",
            "M6 6 Q10 0 20 0 L80 0 Q90 0 94 6 L 85 15 L 15 15 Z"
        );
        if (i == 0) {
            shading[i].setAttribute("transform", "scale(1.5)");
            shading[i].setAttribute("fill", "url(#light-edge)");
        } else if (i == 1) {
            shading[i].setAttribute(
                "transform",
                "rotate(90, 50, 50) scale(1.5) translate(0, -34)"
            );
            shading[i].setAttribute("fill", "url(#light-edge)");
        } else if (i == 2) {
            shading[i].setAttribute(
                "transform",
                "rotate(180, 50, 50) scale(1.5) translate(-34, -33)"
            );
            shading[i].setAttribute("fill", "url(#edge)");
        } else {
            shading[i].setAttribute(
                "transform",
                "rotate(270, 50, 50) scale(1.5) translate(-33, 0)"
            );
            shading[i].setAttribute("fill", "url(#edge)");
        }
    }
    svg.appendChild(base);
    for (edge of shading) {
        svg.appendChild(edge);
    }
    spotCoords.map((coord) => {
        let x = coord[0];
        let y = coord[1];
        let spot = createSVGElement("circle");
        setAttributes(spot, {
            cx: x,
            cy: y,
            r: "9%",
            fill: "url(#spot)",
            stroke: "url(#spot-edge)",
        });
        svg.appendChild(spot);
    });
    return svg;
}

let diceGraphics = [];
const spotCoordinates = [
    [
        ["50%", "50%"]
    ],
    [
        ["67%", "33%"],
        ["33%", "67%"],
    ],
    [
        ["70%", "30%"],
        ["50%", "50%"],
        ["30%", "70%"],
    ],
    [
        ["33%", "33%"],
        ["33%", "67%"],
        ["67%", "33%"],
        ["67%", "67%"],
    ],
    [
        ["30%", "30%"],
        ["30%", "70%"],
        ["50%", "50%"],
        ["70%", "30%"],
        ["70%", "70%"],
    ],
    [
        ["33%", "25%"],
        ["33%", "50%"],
        ["33%", "75%"],
        ["67%", "25%"],
        ["67%", "50%"],
        ["67%", "75%"],
    ],
];

for (let i = 0; i < 6; i++) {
    let die = drawDice(spotCoordinates[i]);
    diceGraphics.push(die);
}

// Function to randomly choose an item from an array
function randomChoice(array) {
    let x = array.length;
    let y = Math.floor(Math.random() * x);
    return array[y];
}


// Function to simulate casting the dice
function cast(id) {
    buttonDown(id);

    setTimeout(() => {
        buttonUp(id);
    }, 150);

    if (timeout == true) {
        timeout = false;

        if (!start) {
            bonusCounter = 1;
            document.getElementById("bonus").innerHTML = bonusCounter;
        }

        document.getElementById("throw").children[0].children[1].setAttribute("fill", "#621a10");

        setTimeout(() => {
            document.getElementById("throw").children[0].children[1].setAttribute("fill", "#09371b");
            timeout = true;
        }, 10000);

        const dice = ["first", "second", "third", "fourth", "fifth", "sixth"];

        for (let x = 0; x < 6; x++) {
            let value = Math.floor(Math.random() * 6);
            let target = document.getElementById(dice[x]);
            target.innerHTML = "";
            target.setAttribute("data-value", value + 1);
            let dieClone = diceGraphics[value].cloneNode(true);
            target.appendChild(dieClone);
        }

        let target = document.getElementById("question");
        let value = Math.floor(Math.random() * 6 + 1) * 10;
        target.innerHTML = value;
        target.style.backgroundColor = "red";

        start = false;
        allClear();
    }
}

// Function to clear all memory and expressions
function allClear() {
    buttonDown("clear");

    setTimeout(() => {
        buttonUp("clear");
    }, 150);

    if (!start) {
        for (mem of memoryScreens) {
            memoryFlags[mem] = false;
            memoryDice[mem] = [];
            memoryExprs[mem] = [];
            clearMemory(mem);
        }

        exprChars = [];
        exprDisplay = [];

        let target = document.getElementById("expression");
        target.innerHTML = "";

        target = document.getElementById("question");
        document.getElementById("question-base").setAttribute("fill", "red");

        update();
    }
}


// Function to count occurrences of an element in a list
function countElements(list, element) {
    let x = 0;
    for (let elem of list) {
        if (elem == element) x++;
    }
    return x;
}

// Function to handle the entry of a button event
function enter(event) {
    if (buttons.includes(event)) {
        buttonDown(event);
        setTimeout(() => {
            buttonUp(event);
        });
    }
    //let target = document.getElementById("expression");

    let openBrackets = countElements(exprChars, "o");
    let closedBrackets = countElements(exprChars, "c");
    let bracketDifference = openBrackets - closedBrackets;
    let lastEntered = "e";
    if (exprChars.length > 0) lastEntered = exprChars[exprChars.length - 1];
    let flag = false;
    let die = "";

    if (event.includes(" ")) {
        eventDie = event.split(" ");
        event = eventDie[0];
        die = eventDie[1];
        flag = true;
    }

    if (event === "(") {
        if (dice.includes(lastEntered) || lastEntered == "c") {
            return 0;
        }
    }

    if (event === ")") {
        if (lastEntered == "o") return 0;
        if (lastEntered == "x") return 0;
        if (bracketDifference <= 0) return 0;
    }
    if (ops.includes(event)) {
        if (lastEntered == "x" || lastEntered == "o" || lastEntered == "e") return 0;
    }
    if (dice.includes(die)) {
        if (((lastEntered != "x") == (lastEntered != "e")) && lastEntered != "o") {
            console.log((lastEntered != "x") == (lastEntered != "e"));
            return 0;
        }
        if (lastEntered == "c") return 0;
    }

    if (ops.includes(event)) exprChars.push("x");
    if (event == "(") exprChars.push("o");
    if (event == ")") exprChars.push("c");
    if (flag) exprChars.push(die);
    exprDisplay.push(event);

    update();
}

// Function to handle the "delete" button
function del() {
    buttonDown("del");
    setTimeout(() => {
        buttonUp("del");
    }, 150);
    if (!start) {
        let expr = document.getElementById("expression");
        let result = document.getElementById("result");
        let char = exprChars.pop();
        exprDisplay.pop();
        if (char.includes("M")) {
            memoryDice[char] = [];
            document.getElementById(char).onclick = () => {
                useMemory(die);
            };
            document.getElementById("T" + char).innerHTML = "";
            memoryExprs[char] = [];
            memoryFlags[char] = false;
        }
        expr.innerHTML = exprDisplay.join(" ");
        let text = calculateExpr(exprDisplay);
        result.innerHTML = text;
        update();
    }
}


// Function to enter a die into the expression
function enterDie(die) {
    let dice = [];
    for (let id of exprChars) {
        if (!id.includes("M")) dice.push(id);
    }
    for (const [key, value] of Object.entries(memoryDice)) {
        dice.push(...value);
    }
    if (!dice.includes(die)) {
        currentDie = die;
        let target = document.getElementById(die);
        let dieNumber = target.getAttribute("data-value") + " " + die;
        if (dieNumber) {
            enter(dieNumber);
        }
    }
}

// Function to update the expression and result display
function update() {
    let targetExpression = document.getElementById("expression");
    let targetResult = document.getElementById("result");
    let expr, result;

    if (level) {
        expr = exprDisplay.join("");
    } else {
        expr = exprDisplay.join(" ");
    }

    result = calculateExpr(exprDisplay)[0];

    if (result === undefined) {
        result = 0;
    }

    targetExpression.innerHTML = expr;
    targetResult.innerHTML = result;

    let x = exprChars.filter(item => !"xco".includes(item));
    let dieCount = [];

    for (let id of x) {
        if (id.includes("M")) {
            for (let die of memoryDice[id]) {
                dieCount.push(die);
            }
        } else {
            dieCount.push(id);
        }
    }

    if (dieCount.length === 6) {
        check();
    }

    updateDice();
}

// Function to unravel memory and retrieve a list of dice
function unravelMemory() {
    let dieCount = [];
    let x = exprChars.filter(item => item != "x");

    for (let id of x) {
        if (id.includes("M")) {
            for (let die of memoryDice[id]) {
                dieCount.push(die);
            }
        } else {
            dieCount.push(id);
        }
    }

    return dieCount;
}


// Function to calculate an expression
function calculateExpr(expression) {
    let final = expression.concat();
    let ob = charCount(final, "(");
    let cb = charCount(final, ")");
    let difb = ob - cb;

    if (["+", "-"].includes(final[final.length - 1])) {
        final.push("0");
    }
    if (["*", "/"].includes(final[final.length - 1])) {
        final.push("1");
    }

    for (let x = 0; x < difb; x++) {
        final.push("0");
        final.push("+");
        final.push("0");
        final.push(")");
    }

    final = calculate(final);

    return final;
}

// Function to update the appearance of dice elements
function updateDice() {
    for (let die of dice) {
        let target = document.getElementById(die);
        target.children[0].children[0].setAttribute("fill", "blue");
    }
    for (const [key, value] of Object.entries(memoryDice)) {
        for (let die of value) {
            let target = document.getElementById(die);
            target.children[0].children[0].setAttribute("fill", "#1c292d80");
        }
    }
    let x = exprChars.filter(item => !"xco".includes(item));
    for (let die of x) {
        let target = document.getElementById(die);
        target.children[0].children[0].setAttribute("fill", "#1c292d80");
    }
}

// Function to check the result against the question and update the display
function check() {
    let target = document.getElementById("result");
    let result = target.innerHTML;
    let targetExpression = document.getElementById("expression");
    let oldExpression = targetExpression.innerHTML;
    target = document.getElementById("question");
    let question = target.innerHTML;
    if (result === question) {
        let expression = exprDisplay.concat();
        let openBrackets = charCount(expression, "(");
        let closedBrackets = charCount(expression, ")");
        let bracketDifference = openBrackets - closedBrackets;
        if (bracketDifference != 0) {
            for (let x = 0; x < bracketDifference; x++) {
                oldExpression += ")";
            }
            targetExpression.innerHTML = oldExpression;
        }
        document.getElementById("question-base").setAttribute("fill", "green");
        start = true;
        updateScore();
        bonusCounter++;

        if (level && bonusCounter > 4) bonusCounter = 4;
        if (!level && bonusCounter > 3) bonusCounter = 3;
        document.getElementById("bonus").innerHTML = bonusCounter;
    }
}

// Function to update the score display
function updateScore() {
    scoreCounter += bonusCounter;
    document.getElementById("score").innerHTML = scoreCounter;

}

// Function to count the occurrences of a character in a string
function charCount(string, c) {
    let result = 0,
        i = 0;
    for (i; i < string.length; i++) {
        if (string[i] === c) {
            result++;
        }
    }
    return result;
}

/*
_calculate(query, n) Function:

This function is responsible for performing basic arithmetic operations (addition, subtraction, multiplication, and division) on a given mathematical expression represented as an array called query. The n parameter specifies the operation to be performed (+, -, *, or /).

Here's a step-by-step breakdown of how it works:

It enters a while loop as long as the specified operation n exists in the query.
Inside the loop, it iterates over each character in the query array.
When it finds a character matching the specified operation n, it calculates the result of the operation based on the numbers preceding and following it.
The result is obtained using parseFloat() to convert the string numbers to actual numbers and performing the operation.
It then replaces the portion of the query array with the result of the operation.
The loop continues until all instances of the specified operation n are processed.
Finally, it returns the modified query array.
calculate(query) Function:

This function is responsible for evaluating complex mathematical expressions that may include parentheses. It calls _calculate(query, n) to handle the basic arithmetic operations.

Here's a step-by-step breakdown of how it works:

It enters a while loop as long as there are parentheses in the query.
Inside the loop, it searches for the first occurrence of an opening parenthesis ( that is not followed by another opening parenthesis.
It then finds the matching closing parenthesis ) and extracts the portion of the expression enclosed within these parentheses into a new array called parentes.
It proceeds to evaluate this parentes array using _calculate() for all four basic arithmetic operations.
The result is then inserted back into the original query array, replacing the portion enclosed within the parentheses.
The loop continues until all parentheses are resolved.
After handling parentheses, it proceeds to evaluate the remaining arithmetic operations (*, /, +, -) using _calculate() in a specific order (multiplication and division before addition and subtraction).
The final modified query array is returned as the result of the expression evaluation.
*/


// Function to calculate expressions
function _calculate(query, n) {
    while (query.includes(n)) {
        for (let i of query) {
            if (i === n) {
                let answer;
                let x = query.indexOf(i) - 1;
                let y = query.indexOf(i) + 1;
                switch (n) {
                    case "+":
                        answer = parseFloat(query[x]) + parseFloat(query[y]);
                        break;
                    case "-":
                        answer = parseFloat(query[x]) - parseFloat(query[y]);
                        break;
                    case "*":
                        answer = parseFloat(query[x]) * parseFloat(query[y]);
                        break;
                    case "/":
                        answer = parseFloat(query[x]) / parseFloat(query[y]);
                        break;
                }
                query.splice(x, 3, answer);
            }
        }
    }
    return query;
}

// Function to calculate expressions
function calculate(query) {
    while (query.includes("(")) {
        let e = 0;
        while (e < query.length) {
            if (query[e] === "(" && query[e + 1] !== "(") {
                let parentes = [];
                for (let e_2 = e; e < query.length; e_2++) {
                    if (query[e_2] === ")") {
                        let y = e_2;
                        if (query.slice(e + 1, y).includes("(")) continue;
                        for (let e_3 = e + 1; e_3 < y; e_3++) {
                            parentes.push(query[e_3]);
                        }
                        let answer;
                        for (let e_4 of ["*", "/", "-", "+"]) {
                            answer = _calculate(parentes, e_4);
                        }
                        query.splice(e, y + 1 - e, answer[0]);
                        break;
                    }
                }
            }
            e++;
        }
    }
    for (let opp of ["*", "/", "-", "+"]) {
        query = _calculate(query, opp);
    }
    return query;
}


// Function to save memory
function saveMemory() {
    if (!memoryFlags["M1"] && !memoryFlags["M2"] && !memoryFlags["M3"] && !memoryFlags["M4"]) return 0;
    let savedExpr = [...exprDisplay];
    let x = exprChars.filter(item => item != "x");
    let id = "";
    for (const [key, value] of Object.entries(memoryFlags)) {
        if (value) {
            id = key;
        }
    }
    let i = 0;
    let temp = [];
    for (let die of x) {
        if (die.includes("M")) {
            x[i] = false;
            temp.push(...memoryDice[die]);
            memoryDice[die] = [];
            memoryExprs[die] = [];
            clearMemory(die);
        }
        i++;
    }
    x.push(...temp);
    x = x.filter(item => item);
    if (memoryDice[id].length != 0) {
        return 0;
    }
    let base = document.getElementById("B" + id);
    let text = document.getElementById("T" + id);
    let savedNumberList = calculateExpr(savedExpr);
    let savedNumber = savedNumberList[0].toString();
    text.innerHTML = savedNumber;
    memoryDice[id] = x;
    memoryExprs[id].push(savedNumber);
    exprChars = [];
    exprDisplay = [];
    document.getElementById("result").innerHTML = "";
    document.getElementById("expression").innerHTML = "";
    update();
}

// Function to clear memory
function clearMemory(id) {
    if (!id && !memoryFlags["M1"] && !memoryFlags["M2"] && !memoryFlags["M3"] && !memoryFlags["M4"]) return 0;
    if (id == null) {
        for (const [key, value] of Object.entries(memoryFlags)) {
            if (value) {
                id = key;
            }
        }
    }
    memoryDice[id] = [];
    memoryExprs[id] = [];
    memoryFlags[id] = false;
    let base = document.getElementById("B" + id);
    let text = document.getElementById("T" + id);
    text.innerHTML = "";
    setAttributes(base, {
        stroke: "black",
        fill: "darkcyan",
    });
    document.getElementById(id).onclick = () => { useMemory(id) };
    update();
}

// Function to use memory
function useMemory(id) {
    for (const [key, value] of Object.entries(memoryFlags)) {
        if (value && key != id) {
            let oldbase = document.getElementById("B" + key);
            setAttributes(oldbase, {
                stroke: "black",
                fill: "darkcyan",
            });
            memoryFlags[key] = false;
        }
    }
    let div = document.getElementById(id);
    let base = document.getElementById("B" + id);
    let text = document.getElementById("T" + id);

    if (memoryFlags[id] == false) {
        setAttributes(base, {
            stroke: "gold",
            fill: "cyan",
        });
    } else {
        if (text.innerHTML == "") {
            setAttributes(base, {
                stroke: "black",
                fill: "darkcyan",
            });
            return 0;
        }
        let index = exprDisplay.length - 1;
        if (!"*+-/".includes(exprDisplay[index]) && exprDisplay.length > 0) return 0;
        exprDisplay.push(...memoryExprs[id]);
        setAttributes(base, {
            stroke: "black",
            fill: "darkcyan",
        });
        div.onclick = () => {
            null;
        };
        exprChars.push(id);
        update();
    }
    memoryFlags[id] = !memoryFlags[id];
}


function changeLevel(flag) {
    if (flag === level) return 0;
    level = flag;

    if (exprChars.length != 0) allClear();

    for (let b of buttons) {
        document.getElementById(b).innerHTML = "";
        drawButton(b)
    }
    let baseOne = document.getElementById("polyone")
    let baseTwo = document.getElementById("polytwo")
    let textOne = document.getElementById("textone")
    let textTwo = document.getElementById("texttwo")
    let shadowOne = document.getElementById("shadowone")
    let shadowTwo = document.getElementById("shadowtwo")
    let outerShadowOne = document.getElementById("outerShadowOne")
    let outerShadowTwo = document.getElementById("outerShadowTwo")
    let bonus = document.getElementById("bonus")

    if (level) {
        bonusCounter += 1;
        setAttributes(baseOne, {
            d: "M9 53 L13 10 Q15 6 17 6 L59 6 Q63 6 63 10 L59 53 Z ",
            transform: "scale(1.4,2)",
            fill: "#5c5353",
        })
        setAttributes(baseTwo, {
            d: "M9 55 L9 101 Q9 105 13 105 L55 105 Q59 105 59 101 L59 55 Z",
            transform: "scale(1.4,1.9)",
            fill: "#d44a20"
        })
        setAttributes(textOne, {
            transform: "rotate(4) translate(10, 0)",
        })
        setAttributes(textTwo, {
            transform: "",
        })
        setAttributes(shadowOne, {
            d: "M9 53 L13 10 Q15 6 17 6 L59 6 Q63 6 63 10 L59 53 Z",
            transform: "scale(1.4,2)",
            fill: "url(#ToggleOne)",
        })
        setAttributes(shadowTwo, {
            d: "M9 55 L9 101 Q9 105 13 105 L55 105 Q59 105 59 101 L59 55 Z",
            transform: "scale(1.4,1.9)",
            fill: "url(#Toggle)",
        })
        setAttributes(outerShadowOne, {
            points: "7,54 0,8 59,8",
        })
        setAttributes(outerShadowTwo, {
            points: "",
        })
    } else {
        bonusCounter -= 1;
        setAttributes(baseOne, {
            d: "M9 54 L9 10 Q9 6 15 6 L55 6 Q59 6 59 10 L59 54 Z",
            transform: "scale(1.4,2)",
            fill: "#d44a20",
        })
        setAttributes(baseTwo, {
            d: "M9 55 L13 103 Q15 105 17 105  L59 105 Q63 105 63 102 L59 55 Z ",
            transform: "scale(1.4,1.9)",
            fill: "#8a7d7d"
        })
        setAttributes(textOne, {
            transform: "",
        })
        setAttributes(textTwo, {
            transform: "rotate(-4) translate(-9, 0)",
        })
        setAttributes(shadowOne, {
            d: "M9 54 L9 10 Q9 6 15 6 L55 6 Q59 6 59 10 L59 54 Z",
            transform: "scale(1.4,2)",
            fill: "url(#Toggle)",
        })
        setAttributes(shadowTwo, {
            d: "M9 55 L13 103 Q15 105 17 105  L59 105 Q63 105 63 102 L59 55 Z ",
            transform: "scale(1.4,1.9)",
            fill: "url(#ToggleTwo)",
        })
        setAttributes(outerShadowOne, {
            points: "",
        })
        setAttributes(outerShadowTwo, {
            points: "7,55 56,55 56,110 0,110",
        })
    }
    bonus.innerHTML = bonusCounter;
}