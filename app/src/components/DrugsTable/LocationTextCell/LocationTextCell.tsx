import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {
    Typography,
    createStyles,
    WithStyles,
    withStyles,
    FormControlLabel,
    Checkbox,
    Grid
} from '@material-ui/core';
import { ILocation } from '../../../interfaces/ILocation';
import { toJS } from 'mobx';
import { ILPU } from '../../../interfaces/ILPU';
import { USER_ROLE } from '../../../constants/Roles';
const styles = createStyles({
    label: {
        margin: 0
    },
    checkbox: {
        padding: 0,
        marginRight: 5
    },
    label_text: {
        fontSize: 14
    }
});
interface IProps extends WithStyles<typeof styles> {
    label: ILocation | ILPU;
    isIgnored: boolean;
    toggleIgnoredLocation?: (locationId: number) => void;
    role: USER_ROLE;
}
@inject(({
             appState: {
                 salesStore: {
                     toggleIgnoredLocation
                 },
                 userStore: {
                     role
                 }
             }
         }) => ({
    role,
    toggleIgnoredLocation
}))
@observer
class LocationTextCell extends Component<IProps> {

    get location(): string {
        const { label, role } = this.props;
        if (label) {
            const condition = role === USER_ROLE.MEDICAL_AGENT
                && 'city' in label
                && 'address' in label;
            if (!condition) return '';
            const {city, address} = (label as ILPU);
            return `${city} ${address}`;
        }
    }

    changeHandler = () => {
        const { toggleIgnoredLocation, label } = this.props;
        if (!label) return;
        toggleIgnoredLocation(label.id);
    }

    render() {
        const { label, classes, isIgnored } = this.props;
        console.log('label: ', toJS(label));
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
                    <Grid>
                        <Typography className={classes.label_text}>
                             { label ? label.name : '-' }
                        </Typography>
                        <Typography className={classes.label_text} color='textSecondary'>
                              { this.location }
                        </Typography>
                    </Grid>
                }
            />
        );
    }
}
export default withStyles(styles)(LocationTextCell);
