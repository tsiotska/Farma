import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, Button } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => createStyles({
    root: {
        width: 280,
        backgroundColor: theme.palette.primary.green.main,
        '& > *': {
            color: 'white'
        }
    },
    submitButton: {
        backgroundColor: 'transparent',
        borderTop: '1px solid white',
        color: 'white',
        fontFamily: 'Source Sans Pro SemiBold',
        fontSize: theme.typography.pxToRem(15)
    },
    bolderText: {
        fontFamily: 'Source Sans Pro SemiBold',
        fontSize: theme.typography.pxToRem(15)
    },
    typography: {
        height: 26,
        lineHeight: '26px'
    },
    textContainer: {
        padding: '4px 8px'
    }
});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class TransferBlock extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root} direction='column' container>
                <Grid className={classes.textContainer} wrap='nowrap' container>
                    <Grid xs={5} direction='column' container item>
                        <Typography className={classes.typography} variant='subtitle1'>
                            Всього для виплат
                        </Typography>
                        <Typography className={classes.typography} variant='subtitle1'>
                            Всього на депозит
                        </Typography>
                    </Grid>
                    <Grid xs direction='column' container item>
                        <Typography  align='right' className={classes.typography} variant='subtitle1'><span className={classes.bolderText}>343</span> уп.</Typography>
                        <Typography  align='right' className={classes.typography} variant='subtitle1'><span className={classes.bolderText}>343</span> уп.</Typography>
                    </Grid>
                    <Grid xs direction='column' container item>
                        <Typography align='right' className={classes.typography} variant='subtitle1'><span className={classes.bolderText}>343</span> бал.</Typography>
                        <Typography align='right' className={classes.typography} variant='subtitle1'><span className={classes.bolderText}>343</span> бал.</Typography>
                    </Grid>
                </Grid>
                <Button className={classes.submitButton}>
                    Перевести
                </Button>
            </Grid>
        );
    }
}

export default withStyles(styles)(TransferBlock);
