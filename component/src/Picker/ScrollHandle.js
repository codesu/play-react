import formatHeight, { DEFAULT_HEIGHT_RATIO } from './heightHelper';

const halfDefaultRatio = DEFAULT_HEIGHT_RATIO / 2;

export default class ScrollHandlers {
    startY = 0;
    lastY = 0;
    scrollY = 0;

    // velocity
    velocity = 0;
    lastTime = 0;
    currentDis = 0;
    middleY = 0;

    constructor(el, itemsCount, selectedIdx, onChange) {
        this.el = el;
        this.itemsY = formatHeight(itemsCount, selectedIdx);
        this.itemsCount = itemsCount;
        this.maxY = this.itemsY[itemsCount - 1];
        this.onChange = onChange;
        this.scrollToIdx(selectedIdx);
    }

    record(y) {
        const now = +new Date();
        const interval = now - this.lastTime;

        this.velocity = (y - this.middleY) / interval;
        // 按住不动
        if (interval >= 30) {
            this.velocity = interval <= 200 ? this.velocity : 0;
            this.middleY = y;
            this.lastTime = now;
        }
    }

    getVelocity() {
        return this.velocity;
    }

    setTransform(value) {
        this.el.style.transform = value;
        this.el.style.webkitTransform = value;
    }

    setTransition(value) {
        this.el.style.transition = value;
        this.el.style.webkitTransition = value;
    }

    scrollTo(y, time) {
        this.scrollY = y;
        this.setTransform(`translate3d(0, ${y}px, 0)`);
        this.setTransition(`cubic-bezier(0,0,0.2,1.15) ${time}s`);

        setTimeout(() => { this.setTransition(''); }, +time * 1000);
    }

    scrollToIdx(i = 0, time) {
        this.scrollTo(this.itemsY[i], time);
    }

    resetSelected(selectedIdx) {
        this.itemsY = formatHeight(this.itemsCount, selectedIdx);
        this.maxY = this.itemsY[this.itemsCount - 1];
    }

    onStart(y) {
        this.startY = y;
        this.middleY = y;
        this.lastY = this.scrollY;
        this.lastTime = +new Date();
    }

    onMove(y) {
        this.record(y);
        // 现在的 scroll 距离 + 上一次距离
        this.scrollY = (y - this.startY) + this.lastY;
        this.setTransform(`translate3d(0, ${this.scrollY}px, 0)`);
    }

    onFinish = () => {
        let selectedIdx = 0;
        let targetY = this.scrollY;
        let time = 0.3;

        const velocity = this.getVelocity() * 4;

        if (velocity) {
            targetY = (velocity * 40) + targetY;
            time = Math.abs(velocity) * 0.1;
        }

        if (targetY < 0) {
            if (targetY > this.maxY) {
                selectedIdx = this.itemsY.indexOf(targetY);

                if (selectedIdx === -1) {
                    selectedIdx = Math.floor(Math.abs(targetY) / DEFAULT_HEIGHT_RATIO);
                    // 超过一半就滚到下一个
                    while (this.itemsY[selectedIdx] - halfDefaultRatio > targetY) {
                        selectedIdx++;
                    }
                }
            } else {
                selectedIdx = this.itemsCount - 1;
            }
        }

        if (this.onChange) {
            this.onChange(selectedIdx);
        }

        this.resetSelected(selectedIdx);
        this.scrollToIdx(selectedIdx, time < 0.3 ? 0.3 : time);
    }

    destory() {
        this.el = null;
    }
}
