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
 *  START / (RUN / CHECK_RESULT) / FINISH
 * */

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
                    detachable: false,
                })
            })
            return cards;
        }, []);
        this.movingCards = [];
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
        this.cards.reverse().forEach((card) => {
            const colNum = Math.floor((Math.random() * this.cascades.length));
            this.cascades[colNum].fields.push(card);
            // console.log(card, colNum)
        });
        this.movingCards = [];
        this.getDetachableCards();
        this.preDetach([this.cascades[0].fields[this.cascades[0].fields.length - 1]]);
        this.getAttachableZone();
        console.log(this);
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
    /**
     * 떼어낼 수 있는 카드들을 찾아 속성 변경 처리
     */
    getDetachableCards() {
        // - 홈셀: 모든 카드 하나씩
        this.homeCells.forEach(({fields}) => {
            fields.forEach(card => {
                card.detachable = true;
            })
        });
        // - 프리셀: 모든 카드 하나씩
        this.freeCells.forEach(({fields}) => {
            if (fields[fields.length - 1]) {
                fields[fields.length - 1].detachable = true;
            }
        });
        // - 캐스케이드: 맨 아래에서부터 ~ 색이 다르고 숫자가 1씩 감소하는 카드까지만 (1~n)
        this.cascades.forEach(({fields}) => {
            let prevCard = null;
            let idx = fields.length - 1;
            while (idx >= 0) {
                const card = fields[idx];
                if (!prevCard) {
                    card.detachable = true;
                } else {
                    const prevIndex = this.cardTexts.indexOf(prevCard.text);
                    const cardIndex = this.cardTexts.indexOf(card.text);
                    const isLinear = prevIndex + 1 === cardIndex;

                    const prevColor = this.getColorFromShape(prevCard.type);
                    const cardColor = this.getColorFromShape(card.type);
                    const isDiffColor = prevColor !== cardColor;

                    const detachable = isLinear && isDiffColor;
                    card.detachable = detachable;
                    if (!detachable) {
                        break;
                    }
                }
                prevCard = card;
                idx--;
            }
        })
    }
    getAttachableZone() {
        const firstMovingCard = this.movingCards[0];
        const firstMovingCardIndex = firstMovingCard && this.cardTexts.indexOf(firstMovingCard.text);
        const firstMovingCardType = firstMovingCard && firstMovingCard.type;

        // - 홈셀 : 카드 1개만, 비어있을 경우 A만,
        this.homeCells.forEach(homeCell => {
            if (homeCell.fields.length < 1) {
                homeCell.attachable = true;
            } else if (homeCell.fields.length > 0) {
                // 이어지는 카드이면 true;
                const lastHomeCard = homeCell.fields[homeCell.fields.length - 1];
                const isSameType = lastHomeCard.type === firstMovingCardType;
                const lastHomeCardIndex = this.cardTexts.indexOf(lastHomeCard.text);

                const isLinear = lastHomeCardIndex + 1 === firstMovingCardIndex;
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
        this.cascades.forEach((cascade) => {
            if (cascade.fields.length < 1) {
                cascade.attachable = true;
            } else {
                const lastCascadeCard = cascade.fields[cascade.fields.length - 1];
                const lastCascadeCardIndex = this.cardTexts.indexOf(lastCascadeCard.text);
                const isLinear = lastCascadeCardIndex === firstMovingCardIndex + 1;

                const isDiffColor = this.getColorFromShape(lastCascadeCard.type) !== this.getColorFromShape(firstMovingCard.type);

                if (isLinear && isDiffColor) {
                    cascade.attachable = true;
                }
            }
        })
    }

    /** Actions :: 카드 이동 및 변화 **/
    preDetach(cards) {
        this.movingCards = cards;
    }
    rollBack() {
        this.movingCards = [];
    }
    move() {
        this.checkIsFailed();
        this.checkIsFinished();
    }

}

new Game().start();