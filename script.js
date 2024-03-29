class FreeCell {
    constructor() {
        /** Cards **/
        this.cards = [];
        this.texts = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        this.shapes = ["♥", "◆", "♣", "♠"];
        for (let i = 0; i < 13; i++) {
            this.shapes.forEach((shape) => {
                const text = this.texts[i];
                const color = this.getColorFromShape(shape);
                this.cards.push({
                    shape,
                    text,
                    color
                })
            })
        }

        /** Stage **/
        this.cascades = [];
        this.freeCells = [null, null, null, null];
        this.homeCells = {
            "♥": [],
            "◆": [],
            "♣": [],
            "♠": []
        };
        this.draggingCards = [];
        this.droppableCols = [];
        this.pos = {col: null, row: null}

        for (let i = 0; i < 8; i++) {
            this.cascades.push([]);
        }
        this.startGame();
        document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this.dragCancel();
        })
    }

    getColorFromShape = (shape) => {
        return shape === "♠" || shape === "♣" ? "black" : "red";
    };

    startGame = () => {
        this.cards.forEach(card => {
            const num = Math.floor(Math.random() * this.cascades.length);

            if (this.cascades[num].length <= 6) {
                this.cascades[num].push(card);
            } else {
                for (let i = 0; i < this.cascades.length; i++) {
                    if (this.cascades[i].length <= 6) {
                        this.cascades[i].push(card);
                        break;
                    }
                }
            }
        });
        this.checkDraggableCards();
        this.render();
    };

    checkDraggableCards = () => {
        this.cascades = this.cascades.map(cascade => {
            const draggableIndexes = [];
            let draggable = true;
            let idx = 0;

            while (draggable) {
                if (idx === 0) {
                    draggableIndexes.push(idx);
                } else if (idx === cascade.length) {
                    draggable = false;
                } else {
                    const currCell = cascade[idx];
                    const prevCell = cascade[idx - 1];

                    const currIdx = this.texts.indexOf(currCell.text);
                    const prevIdx = this.texts.indexOf(prevCell.text);
                    if (prevIdx + 1 === currIdx && currCell.color !== prevCell.color) {
                        draggableIndexes.push(idx);
                    } else {
                        draggable = false;
                    }
                }

                idx++;
            }

            return cascade.map((cell, idx) => {

                return ({
                    ...cell,
                    isDraggable: draggableIndexes.includes(idx)
                })
            })
        })
    };

    checkDroppableCascades = () => {

    };

    getDropEnableFreeCellIndex = () => {
        const isSingleCard = this.draggingCards.length === 1;
        if (!isSingleCard) {
            return -1;
        }
        return this.freeCells.findIndex(cell => !cell);
    };

    checkDropEnableHomeCell = () => {
        const isSingleCard = this.draggingCards.length === 1;
        if (!isSingleCard) {
            return false;
        }
        const {shape, text} = this.draggingCards[0];
        const targetCell = this.homeCells[shape];
        return targetCell.length === this.texts.indexOf(text);
    };

    checkGameWin = () => {

    };

    getMovableCardCnt = () => {

    };

    onUpload = (card) => {
        this.homeCells.push(card);
    };

    checkUploadable = (card) => {
        const {shape, text} = card;
        this.homeCells.push(card);
    };

    moveToFreeCell = (pos, freeCellIndex) => {
        this.freeCells[freeCellIndex] = this.getDraggingCardsFromPos(pos)[0];
        this.cascades[pos.col].shift();
        this.checkDraggableCards();
        this.render();
    };

    moveToHomeCell = (pos) => {
        console.log(this.draggingCards);
        const {shape} = this.draggingCards[0];
        this.homeCells[shape].push(this.draggingCards[0]);
        this.cascades[pos.col].shift();
        console.log(this.homeCells);
        this.checkDraggableCards();
        this.render();
    };


    getDraggingCardsFromPos = pos => {
        const {row, col} = pos;
        return this.cascades[col].slice(0, Number(row) + 1);
    };

    doubleClick = (pos) => {
        this.draggingCards = this.getDraggingCardsFromPos(pos);
        const dropEnableHomeCell = this.checkDropEnableHomeCell();
        const freeCellIndex = this.getDropEnableFreeCellIndex();
        if (dropEnableHomeCell) {
            this.moveToHomeCell(pos);
        } else if (freeCellIndex > -1) {
            this.moveToFreeCell(pos, freeCellIndex);
        }

        console.log(dropEnableHomeCell, freeCellIndex)
    };

    displayDroppable = (cols) => {
        cols.forEach(col => {
            const deck = document.querySelector(`[data-cascade="${col}"]`);
            deck.classList.add("droppable")
        })
    };

    getDroppableCols = (startCard) => {
        const cols = [];
        if (!startCard) {
            return cols;
        }
        const target_idx = this.texts.indexOf(startCard.text);
        const target_color = startCard.color;

        this.cascades.forEach(((col, _i) => {
            const firstCard = col[0];
            const {text, color} = firstCard;
            const i = this.texts.indexOf(text);
            if (target_color !== color && target_idx + 1 === i) {
                cols.push(_i)
            }
        }));
        return cols;
    };

    onDrag = (pos) => {
        console.log("onDrag", pos)
        this.pos = pos;
        const targetCol = this.cascades[Number(pos.col)];
        const startCard = targetCol[Number(pos.row)];
        console.log({startCard})
        this.droppableCols = this.getDroppableCols(startCard);
        this.draggingCards = this.getDraggingCardsFromPos(pos);

        console.log("droppableCols", this.droppableCols)
        console.log("draggingCards", this.draggingCards)
        this.displayDroppable(this.droppableCols);
//            console.log("before render")
//            this.pos = pos;
//            this.render();
//            console.log("after render")
//            if (result.length > 0) {
//                result.forEach(idx => {
//                    const cascade = document.querySelector(`[data-cascade="${idx}"]`);
//                    cascade.style.backgroundColor= "yellow";
//                })
//            }
    };

    onDrop = (cascadeIndex) => {
        const fromCascade = this.cascades[this.pos.col];
        fromCascade.splice(0, this.draggingCards.length); // 제거하기
        this.cascades[cascadeIndex] = this.draggingCards.concat(this.cascades[cascadeIndex]); // 추가하기
        this.draggingCards = [];
        this.droppableCols = [];
        this.checkDraggableCards();
        this.render();
    };

    dragCancel = () => {
        this.draggingCards = [];
        this.droppableCols = [];
        this.checkDraggableCards();
        this.render();
    };

    render = () => {
//            console.log(this.cards);
//            console.log(this.cascades);
//            console.log(this.freeCells);
//            console.log(this.homeCells);
        console.log("render")
        this.freeCells.forEach((card, idx) => {
            const deck = document.querySelector(`[data-free="${idx}"]`);
            deck.innerHTML = "";
            if (card !== null) {
                console.log(card);
                deck.innerHTML = `
                        <div
                            class="card draggable"
                            style="color:${card.color}"
                        >
                            <span>${card.text}</span>
                            <span>${card.shape}</span>
                        </div>`
            }
        });

        const homeCellNames = Object.keys(this.homeCells);
        homeCellNames.forEach((shape, idx) => {
            const deck = document.querySelector(`[data-home="${idx}"]`);
            const cards = this.homeCells[shape];
            if (cards) {
                deck.innerHTML = cards.reduce((cards, card) =>{
                    return cards += `
                        <div
                            class="card draggable"
                            style="color:${card.color}"
                        >
                            <span>${card.text}</span>
                            <span>${card.shape}</span>
                        </div>`
                },"")
            }
        });

        this.cascades.forEach((cascade, colIdx) => {
            const deck = document.querySelector(`[data-cascade="${colIdx}"]`);
            deck.innerHTML = "";
            console.log("colIdx", this.droppableCols)
            const isDroppable = this.droppableCols.includes(colIdx);
            if (isDroppable) {
                deck.classList.add("droppable")
            } else {
                deck.classList.remove("droppable")
            }
            const result = cascade.reduce((acc, card, rowIdx) => {
                const wrapper = document.createElement("div");
                const {isDraggable} = card;
                wrapper.setAttribute("draggable", isDraggable);
                wrapper.classList.add("drag-handler");
                wrapper.dataset["col"] = colIdx;
                wrapper.dataset["row"] = rowIdx;
                wrapper.innerHTML = `
                    <div
                        data-col="${colIdx}"
                        data-row="${rowIdx}"
                        class="card ${isDraggable ? " draggable" : "" }"
                        style="color:${card.color}"
                    >
                        <span>${card.text}</span>
                        <span>${card.shape}</span>
                    </div>
                    `;
                wrapper.appendChild(acc);
                return wrapper;
            }, document.createElement("div"));
            deck.appendChild(result);
        });

        for (const el of document.getElementsByClassName("drag-handler")) {
            el.addEventListener("dblclick", (e) => {
                const {row, col} = e.currentTarget.dataset;
                this.doubleClick({row, col})
            });
            el.addEventListener("dragstart", (e) => {
                e.stopPropagation();
                const {row, col} = e.currentTarget.dataset;
                setTimeout(()=>{
                    el.style.opacity = "0";
                },0)
                console.log("drag", e.currentTarget, row, col)
                this.onDrag({row, col})
            })
            el.addEventListener("dragover", (e) => {
                e.preventDefault();
            })

            el.addEventListener("drop", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const {row, col} = el.dataset;
                this.onDrop(Number(col));
//                    console.log("드랍", e, el);
//                    console.log("드랍", e, el.dataset);
            })

            el.addEventListener("dragend", (e) => {
                e.stopPropagation()

                const decks = document.querySelectorAll(".droppable");
                for (const deck of decks) {
                    deck.classList.remove("droppable")
                }
                console.log("Drag End", decks);

//                    this.onDrag({row, col})
            })
            el.addEventListener("dragenter", (e) => {
                e.stopPropagation()
                console.log("드래그 엔터", e.currentTarget)
            })
        }
        for (const el of document.getElementsByClassName("droppable")) {
//                el.addEventListener("click", (e) => {
//                    const {cascade} = e.currentTarget.dataset;
//                    this.dropCard(cascade);
//                })
            el.addEventListener("dragover", (e) => {
                e.preventDefault();
                console.log("드래그 오버")
            })
            el.addEventListener("drop", (e) => {
                e.preventDefault();
                console.log("drop", e)
            })
            el.addEventListener("dragenter", (e) => {
                e.stopPropagation()
                console.log("드래그 엔터")
            })
        }

    }
}

new FreeCell();