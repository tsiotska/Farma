import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles, Grid, Divider, Paper } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { INotification } from '../../../interfaces/iNotification';
import { IDepartment } from '../../../interfaces/IDepartment';
import { computed } from 'mobx';
import Config from '../../../../Config';

const styles = createStyles({
    root: {
        margin: '8px 0',
        display: 'flex',
        flexDirection: 'column'
    },
    row: {
        '&:first-of-type': {
            height: 48
        },
        '&:last-of-type': {
            height: 58
        }
    },
    icon: {
        width: 40,
        height: 40,
        margin: 10
    }
});

interface IProps extends WithStyles<typeof styles> {
    notification: INotification;
    departments?: IDepartment[];
}

@inject(({
    appState: {
        departmentsStore: {
            departments
        }
    }
}) => ({
    departments
}))
@observer
class Notification extends Component<IProps> {
    @computed
    get iconSrc(): string {
        const { departments, notification: { department }} = this.props;
        const currentDep = departments.find(({ id }) => id === department);
        return currentDep
            ? currentDep.image
            : null;
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Grid className={classes.row} alignItems='center' container>
                    {
                        this.iconSrc &&
                        <img src={`${Config.ASSETS_URL}/${this.iconSrc}`} className={classes.icon} />
                    }
                    <Divider orientation='vertical' />
                    <Grid xs={5} container item>
                        user info
                    </Grid>
                    <Grid xs container item>
                        message
                    </Grid>
                </Grid>
                <Grid className={classes.row} alignItems='center' container>
                    ROWS
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(Notification);
