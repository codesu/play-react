/*
 * @description 下滑线输入框
 * @params {number} maxLength [maxLength=6]输入数值长度
 * @params {boolean} isError 是否错误
 * @params {boolean} isSecure 是否隐藏数字，黑点点显示
 * @params {string} value 输入值
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class UnderlineInput extends Component {
    static propTypes = {
        maxLength: PropTypes.number,
        isError: PropTypes.bool,
        isSecure: PropTypes.bool,
        value: PropTypes.string
    };

    static defaultProps = {
        maxLength: 6,
        isSecure: false,
        isError: false,
        value: ''
    };

    render() {
        const {
            isSecure,
            isError,
            value,
            maxLength
        } = this.props;

        const items = value.padEnd(maxLength, '-').split('');

        return (
            <section className={cx('underline-input', { 'underline-input-error': isError })}>
                <ul className="underline-input_list">
                    {
                        items.map((ch, i) => {
                            return (
                                <li className="underline-input_item" key={+i}>
                                    {
                                        ch !== '-' && (
                                            isSecure
                                                ? <i className="underline-input_dot" />
                                                : <span className="underline-input_number">{ch}</span>
                                        )
                                    }
                                </li>
                            );
                        })
                    }
                </ul>
            </section>
        );
    }
}
