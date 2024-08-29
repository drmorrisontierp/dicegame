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

function createSVGElement(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function setAttributes(element, attributes) {
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
}

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

function randomChoice(array) {
    let x = array.length;
    let y = Math.floor(Math.random() * x);
    return array[y];
}


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

function allClear() {
    buttonDown("clear");
    setTimeout(() => {
        buttonUp("clear");
    }, 150);
    if (!start) {
        for (mem of memoryScreens){
            memoryFlags[mem] = false;
            memoryDice[mem] = []
            memoryExprs[mem] = []
            clearMemory(mem)
        }
        exprChars = []
        exprDisplay = []
        let target = document.getElementById("expression");
        target.innerHTML = "";
        target = document.getElementById("question");
        document.getElementById("question-base").setAttribute("fill", "red");
        update();
    }
}

function countElements(list, element) {
    let x = 0;
    for (let elem of list) {
        if (elem == element) x ++;
    }
    return x;
}

function enter(event) {
    if (buttons.includes(event)) {
        buttonDown(event);
        setTimeout(() => {
            buttonUp(event);
        });
    }
    //console.log(event)
    let target = document.getElementById("expression");
    
    /*let oldExpr = target.innerHTML;
    let ob = charCount(oldExpr, "(");
    let cb = charCount(oldExpr, ")");
    let difb = ob - cb;
    let x = oldExpr.slice(-1);
    */
    let openBrackets = countElements(exprChars, "o")
    let closedBrackets = countElements(exprChars, "c")
    let bracketDifference = openBrackets - closedBrackets
    let lastEntered = "e"
    if (exprChars.length > 0) lastEntered = exprChars[exprChars.length-1]
    let flag = false;
    let die = ""

    if (event.includes(" ")) {
        //console.log("check")
        eventDie = event.split(" ");
        event = eventDie[0];
        die = eventDie[1];
        flag = true;
        //console.log(event)
    }
    /*
    if (event === "(") {
        if (digits.includes(x) || x === ")") {
            return 0;
        }
    }
    if (event === ")") {
        if (ops.includes(x) || x === "(" || difb <= 0) {
            return 0;
        }
    }
    if (digits.includes(event)) {
        if (digits.includes(x) || x === ")") {
            return 0;
        }
    }
    if (ops.includes(event)) {
        if (ops.includes(x) || x === "(" || x === "") {
            return 0;
        }
    }
    */
   //console.log("LE", lastEntered)
   //console.log(dice)
   //console.log(bracketDifference)
    if (event === "(") {
        if (dice.includes(lastEntered) || lastEntered == "c") {
            return 0;
        }
    }
    //console.log("open")
    /*
    if (event === ")") {
        if (lastEntered = "x" || lastEntered == "o" || bracketDifference <= 0) {
            return 0;
        }
    }
    */
    if (event === ")") {
        if (lastEntered == "o") return 0;
        if (lastEntered == "x") return 0;
        if (bracketDifference <= 0) return 0;
    }
    //console.log("closed")
    if (ops.includes(event)){
        if (lastEntered == "x" || lastEntered =="o" || lastEntered == "e") return 0;
    }
    //console.log("op")
    if (dice.includes(die))  {
        if (((lastEntered != "x") == (lastEntered != "e")) && lastEntered != "o") { 
            console.log((lastEntered != "x") == (lastEntered != "e"))
            return 0;}
        if (lastEntered == "c") return 0;
    }
    //console.log("digits")

    if (ops.includes(event)) exprChars.push("x");
    if (event == "(") exprChars.push("o");
    if (event == ")") exprChars.push("c");
    if (flag) exprChars.push(die);
    exprDisplay.push(event)

    //console.log(exprChars)
    //console.log(exprDisplay)
    update();
}

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
        let extra = 0;
        if (char.includes("M")) {
            memoryDice[char] = [];
            extra = memoryExprs[char].length + 1;
            document.getElementById(char).onclick = () => {
                useMemory(die);
            };
            document.getElementById("T" + char).innerHTML = "";
            memoryExprs[char] = [];
            memoryFlags[char] = false;
        }
        expr.innerHTML = exprDisplay.join(" ");
        let text = calculateExpr(exprDisplay)
        result.innerHTML = text;
        update();
    }
}

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

function update() {
    let targetExpression = document.getElementById("expression");
    let targetResult = document.getElementById("result");
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
    console.log("x", x)
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
    console.log(dieCount)
    if (dieCount.length === 6) {
        console.log("check")
        check();
    }
    updateDice();
    //console.log("exprchars", exprChars)
    //console.log("exprDisplay", exprDisplay)
    //console.log("memoryDice", memoryDice)
    //console.log("memoryExprs", memoryExprs)
    //console.log("memoryFlags", memoryFlags)
}

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

function check() {
    let target = document.getElementById("result");
    let result = target.innerHTML;
    target = document.getElementById("question");
    let question = target.innerHTML;
    if (result === question) {
        document.getElementById("question-base").setAttribute("fill", "green");
        start = true;
        if (bonusCounter < 3) bonusCounter++;
        updateScore();
    }
}

function updateScore() {
    scoreCounter += bonusCounter;
    document.getElementById("score").innerHTML = scoreCounter;
    document.getElementById("bonus").innerHTML = bonusCounter;
}

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

function calculate(query) {
    let operators = ["*", "/", "-", "+"];
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

function saveMemory() {
    if (!memoryFlags["M1"] && !memoryFlags["M2"] && !memoryFlags["M3"] && !memoryFlags["M4"]) return 0;
    let savedExpr = [...exprDisplay];
    let x = exprChars.filter(item => item != "x")
    let id = "";
    for (const [key, value] of Object.entries(memoryFlags)) {
        if (value) {
            id = key;
        }
    }
    let i = 0;
    let temp = []
    for (let die of x) {
        if (die.includes("M")) {
            x[i] = false;
            temp.push(...memoryDice[die]);
            memoryDice[die] = [];
            memoryExprs[die] = [];
            clearMemory(die)
        }
        i++;
    }
    x.push(...temp)
    x = x.filter(item => item)
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
    update()
}

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
    document.getElementById(id).onclick = () => { useMemory(id) }
    update()
}

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
        exprChars.push(id)
        update();
    }
    memoryFlags[id] = !memoryFlags[id];
}

function changeLevel(flag) {
    //console.log("change level");
    if (flag === level) return 0;
    level = flag;

    if (start) allClear();
    for (let b of buttons) {
        document.getElementById(b).innerHTML = "";
        drawButton(b)
    }
    let baseOne = document.getElementById("polyone")
    let baseTwo = document.getElementById("polytwo")
    let textOne = document.getElementById("textone")
    let textTwo = document.getElementById("texttwo")

    if (level) {  
        setAttributes(baseOne, {
            points: "9 57 15 7 65 8 59 57 ",
            transform: "scale(1,2)",
            fill: "#5c5353",
        })
        setAttributes(baseTwo, {
            points: "9 57 9 105 59 105 59 57",
            transform: "scale(1,2)",
            fill: "#d44a20"
        })
        setAttributes(textOne, {
            transform: "rotate(5) translate(10, 0)",
        })
        setAttributes(textTwo, {
            transform: "",
        })
    } else {
        setAttributes(baseOne, {
            points: "9 57 9 6 59 6 59 57 ",
            transform: "scale(1,2)",
            fill: "#d44a20",
        })
        setAttributes(baseTwo, {
            points: "9 57 15 106 65 105 59 57",
            transform: "scale(1,2)",
            fill: "#8a7d7d"
        })
        setAttributes(textOne, {
            transform: "",
        })
        setAttributes(textTwo, {
            transform: "rotate(-5) translate(-10, 0)",
        })
    }
    
console.log(level)
}