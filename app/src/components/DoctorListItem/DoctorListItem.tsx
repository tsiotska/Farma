import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Button,
    IconButton
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { ILPU } from '../../interfaces/ILPU';
import { IDoctor } from '../../interfaces/IDoctor';
import { Delete } from '@material-ui/icons';

const styles = (theme: any) => createStyles({
    root: {

    },
    confirmButton: {

    }
});

interface IProps extends WithStyles<typeof styles> {
    doctor: IDoctor;
    lpu: ILPU;
    withConfirmation?: boolean;
    allowConfirm?: boolean;
}

@observer
class DoctorListItem extends Component<IProps> {
    get lpuName(): string {
        const { lpu } = this.props;
        return lpu
        ? lpu.name
        : '-';
    }

    render() {
        const {
            allowConfirm,
            withConfirmation,
            classes,
            doctor: {
                name,
                specialty,
                phone,
                card
            }
        } = this.props;

        return (
            <Grid className={classes.root} wrap='nowrap' container>
                {
                    withConfirmation &&
                    <Grid>
                        qwer
                    </Grid>
                }

                <Grid container item>
                    { this.lpuName }
                </Grid>
                <Grid container item>
                    { name }
                </Grid>
                <Grid container item>
                    { specialty }
                </Grid>
                <Grid container item>
                    { phone }
                </Grid>
                <Grid container item>
                    { card }
                </Grid>

                {
                    allowConfirm &&
                    <Button className={classes.confirmButton} variant='outlined'>
                        Підтвердити
                    </Button>
                }

                <IconButton>
                    <Delete fontSize='small' />
                </IconButton>
            </Grid>
        );
    }
}

export default withStyles(styles)(DoctorListItem);
