/*
 * @description Picker
 * @params {string} title 标题
 * @params {function} onConfirm 确定回调
 * @params {array} data 数据源
 * @params {array} value 默认值
 * @params {function} onClose 关闭回调
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Animate from '../Animate';
import Picker from './Picker';

export default class PickerComponent extends Component {

    static propTypes = {
        title: PropTypes.string,
        onConfirm: PropTypes.func,
        onClose: PropTypes.func,
        data: PropTypes.array,
        value: PropTypes.any,
        onChange: PropTypes.func
    }

    static defaultProps = {
        title: '标题',
        data: [Array(1000).fill().map((_, i) => ({
            label: `${i}月`,
            value: i
        })), Array(1000).fill().map((_, i) => ({
            label: `${i}月`,
            value: i
        })), Array(1000).fill().map((_, i) => ({
            label: `${i}月`,
            value: i
        }))],
        value: [0, 500, 999]
    }

    constructor(props) {
        super(props);
        this.handleChanges = this.props.data.map((_, i) => {
            return this.onChange.bind(this, i);
        });
    }

    /**
     * @description 值变化触发，不变化不触发
     * @param {number} colIdx 选中列
     * @param {any} value 选中列的值
     * @param {number} itemIdx 选中列的序号
     */
    onChange(colIdx, value, itemIdx) {
        this.selectedValue = this.props.value;
        this.selectedValue[colIdx] = value;

        if (this.props.onChange) {
            this.props.onChange(this.selectedValue, itemIdx);
        }
    }

    handleClose = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    handleConfirm = () => {
        if (this.props.onConfirm) {
            this.props.onConfirm(this.selectedValue);
        }
    }

    render() {
        const { title, data, value } = this.props;

        return (
            <Animate duration={300}>
                <div className="picker">
                    <Animate transitionName="picker-backdrop">
                        <div className="picker-backdrop" />
                    </Animate>
                    <Animate transitionName="picker-main">
                        <section className="picker-main">
                            <header className="picker-header">
                                <div className="picker-header-btn" onClick={this.handleClose}>取消</div>
                                <div>{title}</div>
                                <div className="picker-header-btn" onClick={this.handleConfirm}>确定</div>
                            </header>
                            <main className="picker-body">
                                {
                                    data.map((col, idx) => {
                                        return (
                                            <Picker
                                                data={col}
                                                value={value[idx]}
                                                key={+idx}
                                                onChange={this.handleChanges[idx]}
                                            />
                                        );
                                    })
                                }
                            </main>
                        </section>
                    </Animate>
                </div>
            </Animate>
        );
    }
}
