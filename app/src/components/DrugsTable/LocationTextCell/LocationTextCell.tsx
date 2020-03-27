import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ILocation } from '../../../interfaces/ILocation';
import { Typography } from '@material-ui/core';

interface IProps {
    label: ILocation;
    classes?: Partial<Record<'typography', string>>;
}

@observer
class LocationTextCell extends Component<IProps> {
    render() {
        const { label, classes } = this.props;

        return (
            <Typography className={classes && classes.typography} variant='body2'>
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
