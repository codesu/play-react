import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ScrollHandle from './ScrollHandle';

export default class PickerComponent extends Component {

    static propTypes = {
        data: PropTypes.array,
        value: PropTypes.any,
        onChange: PropTypes.func
    }

    static defaultProps = {
        data: [],
        value: []
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedIdx: this.getValueIdx(),
            itemsCount: this.props.data.length
        };
        this.rootRef = React.createRef();
        this.contentRef = React.createRef();
    }

    componentDidMount() {
        const { selectedIdx, itemsCount } = this.state;

        this.scrollHandle = new ScrollHandle(this.contentRef.current, itemsCount, selectedIdx, this.onChange);
        this.bindTouch();
    }

    componentWillUnmount() {
        this.scrollHandle.destory();
    }

    onChange = (i) => {
        const { onChange, data } = this.props;

        if (onChange && i !== this.state.selectedIdx) {
            onChange(data[i].value, i);
        }

        this.setState({ selectedIdx: i });
    }

    getValueIdx() {
        const { value, data } = this.props;

        return data.findIndex((item) => {
            return !value || item.value === value;
        });
    }

    passiveSupported() {
        let passiveSupported = false;

        try {
            const options = Object.defineProperty({}, 'passive', {
                // eslint-disable-next-line
                get() {
                    passiveSupported = true;
                }
            });

            window.addEventListener('test', null, options);
        } catch (err) { /**/ }

        return passiveSupported;
    }

    bindTouch() {
        const eventsHandler = {
            touchstart: (evt) => {
                this.scrollHandle.onStart(evt.touches[0].pageY);
            },
            touchmove: (evt) => {
                evt.preventDefault();
                this.scrollHandle.onMove(evt.touches[0].pageY);
            },
            touchend: this.scrollHandle.onFinish,
            touchcancel: this.scrollHandle.onFinish
        };

        Object.keys(eventsHandler).forEach((event) => {
            const passiveOptions = event === 'touchmove' && this.passiveSupported() ? {
                passive: false
            } : false;

            this.rootRef.current.addEventListener(event, eventsHandler[event], passiveOptions);
        });
    }

    render() {
        const { data } = this.props;
        const { selectedIdx } = this.state;

        return (
            <section className="picker-col" ref={this.rootRef}>
                <div className="picker-col-mask" />
                <div className="picker-col-indicator" />
                <div className="picker-col-content" ref={this.contentRef}>
                    {
                        data.map((item, i) => {
                            return (
                                <div
                                    className={cx('picker-item', {
                                        'picker-item-current': selectedIdx === i,
                                        'picker-item-small': Math.abs(selectedIdx - i) === 1
                                    })}
                                    key={+i}
                                >{item.label}
                                </div>
                            );
                        })
                    }
                </div>
            </section>
        );
    }
}
