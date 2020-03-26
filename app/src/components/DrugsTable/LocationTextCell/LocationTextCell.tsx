import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ILocation } from '../../../interfaces/ILocation';
import { Typography } from '@material-ui/core';

interface IProps {
    label: ILocation;
}

@observer
class LocationTextCell extends Component<IProps> {
    render() {
        const { label } = this.props;

        return (
            <Typography>
                {
                    label
                    ? label.name
                    : '-'
                }
            </Typography>
        );
    }
}

export default LocationTextCell;
