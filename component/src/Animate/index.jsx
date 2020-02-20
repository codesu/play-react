import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const STATUS = {
    INIT: 'init',
    ENTER: 'enter',
    LEAVE: 'leave'
};

const getUid = (function () {
    let currentId = 0;

    return function () {
        return `anme-${++currentId}`;
    };
}());

/**
 * @description 纯管理 class 动画组件，无包裹，外部可以直接销毁此组件
 * 在进入和离开时插入 class，必须需要指定进场、离场class
 * @props {string} transitionName 用于组合class名称。
 *  {transitionName-enter}{transitionName-enter-active}{transitionName-leave}{transitionName-leave-active}
 * @props {number} duration 保护，自身没有动画，等内部元素表演完就走
 */
export default class Animate extends Component {
    static defaultProps = {
        transitionName: '',
        duration: 0
    }

    static propTypes = {
        transitionName: PropTypes.string,
        duration: PropTypes.number,
        children: PropTypes.node
    }

    componentDidMount() {
        if (!this.domSupport) {
            return;
        }

        const { transitionName } = this.props;

        this.enterCls = `${transitionName}-${STATUS.ENTER}`;
        this.enterActiveCls = `${this.enterCls}-active`;
        this.leaveCls = `${transitionName}-${STATUS.LEAVE}`;
        this.leaveActiveCls = `${this.leaveCls}-active`;

        // eslint-disable-next-line
        this.$el = ReactDOM.findDOMNode(this);
        this.uid = getUid();

        this.$el.classList.add(this.uid);
        this.performStart(this.$el, STATUS.ENTER);
    }

    componentWillUnmount() {
        if (!this.domSupport) {
            return;
        }
        this.clearAnimationCls(this.$el);
        let cloneNode = this.$el.cloneNode(true);

        this.$el.parentNode.insertBefore(cloneNode, this.$el.nextSibling);
        // 清空元素引用
        cloneNode = null;
        this.cleartStartTimer();

        setTimeout(() => {
            // 有可能父级元素都被 unmount 了，重新寻找 clone 后的子元素
            let realDom = document.querySelector(`.${this.uid}`);

            if (!realDom) {
                return;
            }

            if (this.props.duration) {
                setTimeout(() => {
                    realDom.remove();
                }, this.props.duration);

                return;
            }

            this.performStart(realDom, STATUS.LEAVE);
            realDom = null;
        });
    }

    status = STATUS.INIT;
    domSupport = typeof window !== 'undefined';

    /**
     * @description 动画开始
     * @param {elemnt} el 动画作用元素
     * @param {STATUS} nextStatus 变化状态
     */
    performStart(el, nextStatus) {
        this.status = nextStatus;

        if (this.props.duration) {
            return;
        }

        el.classList.add(this[`${nextStatus}Cls`]);
        this.startTimer = setTimeout(() => {
            this.startTimer = null;
            el.classList.add(this[`${nextStatus}ActiveCls`]);
        }, 30);
        el.addEventListener('animationend', this.performEnd);
        el.addEventListener('transitionend', this.performEnd);
    }

    /**
     * @description 动画结束
     */
    performEnd = (e) => {
        const el = e.currentTarget;

        // 别是冒泡的小子
        if (e.currentTarget !== e.target) {
            return;
        }
        this.cleartStartTimer();
        this.clearAnimationCls(el);
        if (this.status === STATUS.LEAVE && el.parentNode) {
            el.remove();
            this.$el = null;
        }
        el.removeEventListener('animationend', this.performEnd);
        el.removeEventListener('transitionend', this.performEnd);

    }

    /**
     * @description 频繁切换，卸载时取消进入动画
     */
    cleartStartTimer() {
        if (this.startTimer) {
            clearTimeout(this.startTimer);
            this.startTimer = null;
        }
    }

    clearAnimationCls(el) {
        el.classList.remove(this[`${this.status}Cls`], this[`${this.status}ActiveCls`]);
    }

    render() {
        return this.props.children
    }
}
