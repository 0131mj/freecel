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

const zone = {
    freeCell: [],
    homeCell: [[], [], [], []],
    cascade: [[], [], [], [], [], [], [], [], []],
}

const cards = {
    A__heart: zone.freeCell[0],
    A__clover: zone.freeCell[1],
}

class Game {
    constructor(props) {
        this.homeCells = this.makeBlankFields(4);
        this.freeCells = this.makeBlankFields(4);
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
        this.homeCells = this.makeBlankFields(4);
        this.freeCells = this.makeBlankFields(4);
        this.cascades = this.makeBlankFields(8);
        this.cards.forEach((card) => {
            const colNum = Math.floor((Math.random() * this.cascades.length));
            this.cascades[colNum].fields.push(card);
            // console.log(card, colNum)
        });
        this.movingCards = [];
        // this.preDetach([this.cascades[0].fields[this.cascades[0].fields.length - 1]], this.cascades[0]);
        // this.getAttachableZone();
        // this.attach(this.cascades[1])
        console.log(this.cascades);
        this.render();
        // setTimeout(() => {
        //     this.detach();
        //     console.log(this.cascades);
        // }, 5000)
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
        this.freeCells.forEach((freeCell) => {
            if (freeCell.fields.length < 1) {
                freeCell.attachable = true;
            }
        })

        // - 캐스케이드: moving 카드가 쌓여있던 카드의 마지막 카드에서 색이 다르고 숫자가 1 감소하는 카드로 끝나는 더미만
        this.cascades.forEach((cascade, index) => {

            const cascadeEl = document.querySelectorAll("#cascades > .drag-group");
            let attachable = false;
            if (cascade.fields.length < 1) {
                attachable = true;
            } else {

                const bottomCascadeCard = cascade.fields[0];
                if(!bottomCascadeCard){
                    debugger;
                }
                const lastCascadeCardIndex = this.cardTexts.indexOf(bottomCascadeCard.text);
                const isLinear = lastCascadeCardIndex === lastMovingCardIndex + 1;

                const isDiffColor = this.getColorFromShape(bottomCascadeCard.type) !== this.getColorFromShape(lastMovingCard.type);

                if (isLinear && isDiffColor) {
                    attachable = true;
                    console.log();
                    cascadeEl[index].classList.add('droppable');
                    cascadeEl[index].setAttribute("droppable", true);
                }
            }
            if (attachable) {
                cascade.attachable = true;
            }
        })
    }

    /** Actions :: 카드 이동 및 변화 **/
    preDetach(cards, from) {
        this.movingCards = cards;
        this.from = from;
    }

    detach() {
        this.from.fields = this.from.fields.splice(0, this.from.fields.length - this.movingCards.length);
    }

    attach(destination) {
        destination.fields = [
            ...destination.fields,
            ...this.movingCards
        ];
    }

    rollBack() {
        this.movingCards = [];
    }

    move() {
        this.detach();
        this.attach();
        this.checkIsFailed();
        this.checkIsFinished();
    }

    createCardEl(card, detachable, cascadeIdx, cards) {
        const {type, text} = card;
        const cardEl = document.createElement("div");
        cardEl.classList.add("card");
        cardEl.innerHTML = `${type}_${text}`;
        cardEl.style.margin = '8px 16px';
        cardEl.style.padding = '4px 8px';
        cardEl.style.color = this.getColorFromShape(type);
        cardEl.style.backgroundColor = detachable ? "#fff" : "#888";
        // cardEl.addEventListener("click", () => {
        //     this.preDetach(cards, this.cascades[cascadeIdx]);
        //     this.render();
        // });
        return cardEl;
    }

    createDragEl(card, detachable, cascadeIdx, cards) {
        const dragEl = document.createElement("div");
        dragEl.classList.add("drag-group");
        dragEl.setAttribute("draggable", String(Boolean(detachable)));

        const {type, text} = card;
        dragEl.dataset.text = `${type}_${text}`;
        dragEl.addEventListener("dragstart", (e) => {
            e.stopPropagation()
            this.preDetach(cards, this.cascades[cascadeIdx]);
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
            // this.render();
        });
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
        const movingCardsContainer = document.createElement("section");
        const movingCards = this.movingCards.reduce((cards, card) => {
            const _card = document.createElement("div");
            _card.innerHTML = `${card.text}_${card.type}`;
            cards.appendChild(_card);
            return cards;
        }, movingCardsContainer);


        const cascadeContainer = document.createElement("section");
        cascadeContainer.style.display = "flex";
        cascadeContainer.setAttribute("id", "cascades");

        const cascades = this.cascades.reduce((cascade, columns, index) => {
            const column = columns.fields.reduce((acc, currCard) => {
                const lastCard = acc?.cards[acc.cards.length - 1] || null;
                const detachable = this.checkDetachable(lastCard, currCard);
                const accCards = (acc?.cards || []).concat([{...currCard, detachable}]);
                const cardEl = this.createCardEl(currCard, detachable, index, accCards);
                const dragEl = this.createDragEl(currCard, detachable, index, accCards);
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
        document.body.appendChild(movingCards);
    }

}

new Game().start();

// class Game {
//     constructor(props) {
//         this.cardTypes = new Set(["♥", "◆", "♣", "♠"]);
//         this.cardTexts = new Set(["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]);
//         this.cards = new Map();
//         this.cardKeys = new Set();
//         for (const text of this.cardTexts) {
//             for (const type of this.cardTypes) {
//                 this.cards.set(`${text}__${type}`, null);
//                 this.cardKeys.add(`${text}__${type}`);
//             }
//         }
//         console.log(this.cards)
//         console.log(this.cardKeys)
//     }
//
//     start() {
//
//     }
// }
