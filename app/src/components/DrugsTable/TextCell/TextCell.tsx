import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ISalesStat } from '../../../interfaces/ISalesStat';

interface IProps {
    value: ISalesStat | string;
}

@observer
class TextCell extends Component<IProps> {
    render() {
        const { value } = this.props;

        return (
            <p>
                {
                    typeof value === 'string'
                    ? value
                    : value.id
                }
            </p>
        );
    }
}

export default TextCell;
