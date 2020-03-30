import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { ILocation } from '../../../interfaces/ILocation';
import { Typography } from '@material-ui/core';

interface IProps {
    label: ILocation;
    classes?: Partial<Record<'typography', string>>;
    isIgnored: boolean;
    toggleIgnoredLocation?: (locationId: number) => void;
}

@inject(({
    appState: {
        salesStore: {
            toggleIgnoredLocation
        }
    }
}) => ({
    toggleIgnoredLocation

}))
@observer
class LocationTextCell extends Component<IProps> {
    onChange = () => {
        const { toggleIgnoredLocation, label } = this.props;
        if (!label) return;
        toggleIgnoredLocation(label.id);
    }

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
