/**
 * 구성요소
 *    카드 : 총 52장 (4가지 모양 * 13개 카드)
 *    무대
 *      홈셀
 *      프리셀
 *      캐스케이드
 * 게임 방법
 *    캐스케이드와 프리셀의 카드를 모두 홈셀로 이동
 * 룰
 *    홈셀 :
 *       - 총 적재 가능 수량 : 제한 없음 (논리적으로는 모양이 같은 카드의 총 개수)
 *       - 적재 가능 카드 : 현재 카드와 모양이 같고, 현재카드의 번호보다 1이 큰 값의 카드
 *    프리셀 :
 *       - 총 적재 가능 수량 : 1장
 *       - 적재 가능 카드 : 모든 카드
 *    캐스케이드 :
 *       - 총 적재 가능 수량 : 제한 없음 (논리적으로는 모든 카드의 개수)
 *       - 적재 가능 카드 : 현재 카드와 색상이 다르고 현재카드의 번호보다 1이 큰 값의 카드
 *       - 한번에 드래그 가능 수량 : 프리셀의 빈 데크 수량,
 *       - 한번에 드롭 가능 수량 : 제한 없음

 * 떼냄 가능 여부는 카드별로 판단,
 * 붙임 가능 여부는 필드별로 판단

 * 게임 시작
 *   초기상태
 *    홈셀 : 없음 ok
 *    프리셀 : 없음 ok
 *    캐스케이드: 카드 수량을 나누어 랜덤으로 배열함 ok
 *      추가(캐스케이드에 추가로 지정)
 * 게임 끝
 *  캐스케이드와 프리셀의 카드를 모두 홈셀로 이동하면 끝 ok
 *
 *  프로세스
 *  START / (READY / RUN / CHECK_RESULT) / FINISH
 * */

class Game {
    constructor(props) {
        this.freeCells = new Array(4).fill(undefined);
        this.homeCells = this.makeBlankFields(4);
        this.cascades = this.makeBlankFields(8);
        this.cardTypes = ["♥", "◆", "♣", "♠"];
        this.cardTexts = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        this.cards = this.cardTexts.reduce((cards, text) => {
            this.cardTypes.forEach(type => {
                cards.push({
                    type,
                    text,
                })
            })
            return cards;
        }, []);
        this.movingCards = [];
    }

    init() {
        // update CardState and zone
        // check takeEnable card
        // __render
    }

    run() {
        // onTakeCard
        // checkPutEnableArea
        // __render
        // onPutCard
        // moveCard
        // update CardState and zone
        //  check takeEnable card
        // checkResult
        // win
        // lose
        // __render
    }


    checkResult() {
        let checkIsWin = false;
        let checkIsLose = false;
    }

    /** Process :: 전체 흐름 제어 **/
    makeBlankFields = (length) => [...Array(length)].map(n => ({
        attachable: false,
        fields: [],
    }));

    start() {
        this.freeCells = new Array(4).fill(undefined);
        this.homeCells = this.makeBlankFields(4);
        this.cascades = this.makeBlankFields(8);
        this.cards.forEach((card) => {
            const colNum = Math.floor((Math.random() * this.cascades.length));
            this.cascades[colNum].fields.push(card);
        });
        this.movingCards = [];
        this.render();
    }

    /** Check :: 상태 확인 **/
    checkIsFailed() {
        /**
         * 이동 할 수 있는 카드가 없다고 판단하기
         * **/
        const isFailed = false;
        if (isFailed) {
            console.log("실패")
        } else {
            console.log("안 실패")
        }
    }

    checkIsFinished() {
        const homeCellTotalCardCnt = this.homeCells.reduce((totalCnt, homeCell) => totalCnt + homeCell.length, 0)
        const isFinished = this.cards.length === homeCellTotalCardCnt;
        if (isFinished) {
            console.log("끝")
        } else {
            console.log("안 끝남")
        }
    }

    getColorFromShape(type) {
        return ["♣", "♠"].includes(type) ? "black" : "red";
    }

    /** 렌더 포함 */
    getAttachableZone() {
        console.log(this.movingCards)
        const lastMovingCard = this.movingCards[this.movingCards.length - 1];
        const lastMovingCardIndex = lastMovingCard && this.cardTexts.indexOf(lastMovingCard.text);
        const lastMovingCardType = lastMovingCard && lastMovingCard.type;

        // - 홈셀 : 카드 1개만, 비어있을 경우 A만,
        this.homeCells.forEach(homeCell => {
            if (homeCell.fields.length < 1) {
                homeCell.attachable = true;
            } else if (homeCell.fields.length > 0) {
                // 이어지는 카드이면 true;
                const lastHomeCard = homeCell.fields[homeCell.fields.length - 1];
                const isSameType = lastHomeCard.type === lastMovingCardType;
                const lastHomeCardIndex = this.cardTexts.indexOf(lastHomeCard.text);

                const isLinear = lastHomeCardIndex + 1 === lastMovingCardIndex;
                if (isSameType && isLinear) {
                    homeCell.attachable = true;
                }
            } else {
                homeCell.attachable = false;
            }
        })

        // - 프리셀 : 카드 1개만 (어떤 카드든)
        if (this.movingCards?.length === 1) {
            this.freeCells.forEach((freeCell, index) => {
                const freeCellEl = document.querySelector(`#freeCells > .free-cell:nth-child(${index + 1})`);
                if (!freeCell) {
                    freeCellEl.setAttribute("droppable", "true");
                    freeCellEl.classList.add("droppable");
                    freeCellEl.style.backgroundColor = "yellowgreen"
                }
            })
        }

        // - 캐스케이드: moving 카드가 쌓여있던 카드의 마지막 카드에서 색이 다르고 숫자가 1 감소하는 카드로 끝나는 더미만
        this.cascades.forEach((cascade, index) => {
            const cascadeEls = document.querySelectorAll("#cascades > .drag-group");
            let attachable = false;
            if (cascade.fields.length < 1) {
                attachable = true;
            } else {

                const bottomCascadeCard = cascade.fields[0];
                if (!bottomCascadeCard) {
                    debugger;
                }
                const lastCascadeCardIndex = this.cardTexts.indexOf(bottomCascadeCard.text);
                const isLinear = lastCascadeCardIndex === lastMovingCardIndex + 1;

                console.log(bottomCascadeCard, lastMovingCard)
                const isDiffColor = this.getColorFromShape(bottomCascadeCard.type) !== this.getColorFromShape(lastMovingCard.type);

                if (isLinear && isDiffColor) {
                    attachable = true;
                    console.log();
                    cascadeEls[index].classList.add('droppable');
                    cascadeEls[index].setAttribute("droppable", true);
                }
            }
            if (attachable) {
                cascade.attachable = true;
            }
        })
    }

    /** Actions :: 카드 이동 및 변화 **/
    preDetach(cards, from) {
        console.log("Pre Detach", cards, from)
        this.movingCards = cards;
        this.from = from;
    }

    detach() {
        const remainCnt = (this.from.fields.length - this.movingCards.length) * -1;
        this.from.fields = this.from.fields.splice(remainCnt);
    }

    attach(destination) {
        destination.fields = [
            ...this.movingCards,
            ...destination.fields,
        ];
    }

    createCardEl(card, detachable) {
        const {type, text} = card;
        const cardEl = document.createElement("div");
        cardEl.classList.add("card");
        cardEl.innerHTML = `<div class="card-text-group"><div class="text">${text}</div><div class="shape">${type}</div></div>`;
        cardEl.style.margin = '8px 16px';
        cardEl.style.padding = '4px 8px';
        cardEl.style.color = this.getColorFromShape(type);
        cardEl.style.backgroundColor = detachable ? "#fff" : "#ccc";
        return cardEl;
    }

    createDragEl(args) {
        const {card, detachable, idx, cards, from} = args;
        const dragEl = document.createElement("div");
        dragEl.classList.add("drag-group");
        dragEl.setAttribute("draggable", String(Boolean(detachable)));

        const {type, text} = card;
        dragEl.dataset.text = `${type}_${text}`;
        dragEl.dataset.col = idx;
        dragEl.addEventListener("dragstart", (e) => {
            e.stopPropagation();
            this.preDetach(cards, from);
            setTimeout(() => {
                dragEl.style.opacity = "0";
            }, 0);
            this.getAttachableZone();
        });

        dragEl.addEventListener("dragend", (e) => {
            e.stopPropagation()
            setTimeout(() => {
                dragEl.style.opacity = "1";
            }, 0);
            this.render();
        });

        dragEl.addEventListener("dragover", (e) => {
            if (e.path && Array.isArray(e.path)) {
                const isDroppable = e.path.some(p => p && p?.classList && p.classList.contains("droppable"))
                if (isDroppable) {
                    e.preventDefault();
                }
            }
        })

        dragEl.addEventListener("dragenter", (e) => {
            if (e.path && Array.isArray(e.path)) {
                const isDroppable = e.path.some(p => p && p?.classList && p.classList.contains("droppable"))
                if (isDroppable) {
                    e.preventDefault();
                }
            }
        })

        dragEl.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const {col} = dragEl.dataset;
            const colIdx = Number(col);
            this.attach(this.cascades[colIdx]);
            this.detach();
            this.render();
        })
        return dragEl;
    }

    checkDetachable(lastCard, currCard) {
        if (!lastCard) {
            return true;
        }

        if (!lastCard.detachable) {
            return false;
        }

        const lastCascadeCardIndex = this.cardTexts.indexOf(lastCard.text);
        const currCascadeCardIndex = this.cardTexts.indexOf(currCard.text);
        const isLinear = lastCascadeCardIndex + 1 === currCascadeCardIndex;

        const prevColor = this.getColorFromShape(lastCard.type);
        const cardColor = this.getColorFromShape(currCard.type);
        const isDiffColor = prevColor !== cardColor;

        return isLinear && isDiffColor;
    }

    render() {
        document.body.innerHTML = "";

        /** Free Cell **/
        const freeCellContainer = document.createElement("section");
        freeCellContainer.style.display = "flex";
        freeCellContainer.setAttribute("id", "freeCells");

        const freeCells = this.freeCells.reduce((freeCellsEl, currCard, index) => {
            const freeCellEl = document.createElement("div");
            freeCellEl.dataset.col = index;
            freeCellEl.style.width = "100px";
            freeCellEl.style.height = "100px";
            freeCellEl.style.margin = "8px";
            freeCellEl.style.padding = "8px";
            freeCellEl.style.backgroundColor = "pink";
            freeCellEl.classList.add("free-cell");
            if (currCard) {
                const cardEl = this.createCardEl(currCard, true);
                const dragEl = this.createDragEl({card: currCard, detachable: true, from: this.freeCells, cards: [this.freeCells[index]]});
                dragEl.appendChild(cardEl)
                freeCellEl.appendChild(dragEl);
            }

            freeCellEl.addEventListener("dragover", (e) => {
                const isDroppable = freeCellEl.getAttribute("droppable");
                if (isDroppable) {
                    e.preventDefault();
                }
            });

            freeCellEl.addEventListener("dragenter", (e) => {
                const isDroppable = freeCellEl.getAttribute("droppable");
                if (isDroppable) {
                    e.preventDefault();
                }
            });

            freeCellEl.addEventListener("drop", (e) => {
                const colIdx = e.target.dataset.col;
                this.freeCells[colIdx] = this.movingCards[0];
                this.detach();
                this.render();
            });
            freeCellsEl.appendChild(freeCellEl);
            return freeCellsEl;
        }, freeCellContainer);
        document.body.appendChild(freeCells);

        /** Cascade **/
        const cascadeContainer = document.createElement("section");
        cascadeContainer.style.display = "flex";
        cascadeContainer.setAttribute("id", "cascades");

        const cascades = this.cascades.reduce((cascade, columns, idx) => {
            const column = columns.fields.reduce((acc, currCard) => {
                const lastCard = acc?.cards[acc.cards.length - 1] || null;
                const detachable = this.checkDetachable(lastCard, currCard);
                const accCards = (acc?.cards || []).concat([{...currCard, detachable}]);
                const cardEl = this.createCardEl(currCard, detachable, idx, accCards);
                const dragEl = this.createDragEl({card: currCard, detachable, idx, cards: accCards, from: this.cascades[idx]});
                dragEl.appendChild(cardEl);
                if (acc?.dragEl) {
                    dragEl.appendChild(acc?.dragEl);
                }
                return {
                    dragEl,
                    cards: accCards
                };
            }, null);
            cascade.appendChild(column?.dragEl);
            return cascade;
        }, cascadeContainer);
        document.body.appendChild(cascades);

        /** Moving Cards **/
        const movingCardsContainer = document.createElement("section");
        const movingCards = this.movingCards.reduce((cards, card) => {
            const _card = document.createElement("div");
            _card.innerHTML = `${card.text}_${card.type}`;
            cards.appendChild(_card);
            return cards;
        }, movingCardsContainer);
        document.body.appendChild(movingCards);
    }

}

new Game().start();