import React, { Component } from 'react';
import { Grid, createStyles, WithStyles, withStyles, Typography, IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import { ILPU } from '../../../interfaces/ILPU';
import cx from 'classnames';
import { Edit, Delete } from '@material-ui/icons';
import { gridStyles } from '../gridStyles';

const styles = (theme: any) => createStyles({
    ...gridStyles(theme),
    root: {
        marginBottom: 1,
        minHeight: 48,
        padding: '6px 0',
        backgroundColor: ({ unconfirmed }: any) => unconfirmed
            ? theme.palette.primary.blue
            : theme.palette.primary.white,
        color: ({ unconfirmed }: any) => unconfirmed
        ? theme.palette.primary.white
        : theme.palette.primary.gray.main,
    },
    text: {
        lineHeight: 1.5,
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    iconButton: {
        padding: 8,
        borderRadius: 2
    },
    icon: {
        fontSize: '1rem',
        color: ({ unconfirmed }: any) => unconfirmed
            ? theme.palette.primary.white
            : ''
    }
});

interface IProps extends WithStyles<typeof styles> {
    pharmacy: ILPU;
    unconfirmed: boolean;
}

@observer
class ListItem extends Component<IProps> {
    render() {
        const {
            classes,
            pharmacy: {
                name,
                type,
                region,
                oblast,
                city,
                address,
                phone1,
                phone2,
            }
        } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' container>
                <Grid className={cx(classes.cell, classes.name)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { name }
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.region)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { region }
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.oblast)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { oblast }
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.city)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { city }
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.address)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        { address }
                    </Typography>
                </Grid>
                <Grid
                    className={cx(classes.cell, classes.phone)}
                    xs={1}
                    wrap='nowrap'
                    alignItems='center'
                    container
                    item>
                    <Typography className={classes.text} variant='body2'>
                        { phone1 } { phone2 }
                    </Typography>
                    <IconButton className={classes.iconButton}>
                        <Edit className={classes.icon} />
                    </IconButton>
                    <IconButton className={classes.iconButton}>
                        <Delete className={classes.icon} />
                    </IconButton>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ListItem);
