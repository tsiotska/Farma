import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {
    Typography,
    createStyles,
    WithStyles,
    withStyles,
    FormControlLabel,
    Checkbox
} from '@material-ui/core';
import { ILocation } from '../../../interfaces/ILocation';

const styles = createStyles({
    label: {
        margin: 0
    },
    checkbox: {
        padding: 0,
        marginRight: 5
    }
});

interface IProps extends WithStyles<typeof styles> {
    label: ILocation;
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
    changeHandler = () => {
        const { toggleIgnoredLocation, label } = this.props;
        if (!label) return;
        toggleIgnoredLocation(label.id);
    }

    render() {
        const { label, classes, isIgnored } = this.props;

        return (
            <FormControlLabel
                className={classes.label}
                control={
                    <Checkbox
                        className={classes.checkbox}
                        checked={!isIgnored}
                        onChange={this.changeHandler}
                        size='small'
                        color='default'
                    />
                }
                label={
                    <Typography variant='body2'>
                        { label ? label.name : '-' }
                    </Typography>
                }
            />
        );
    }
}

export default withStyles(styles)(LocationTextCell);
