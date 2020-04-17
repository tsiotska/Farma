import React, { Component } from 'react';
import { WithStyles, createStyles, withStyles, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';

const styles = createStyles({
    header: {
        borderBottom: '1px solid #e4e8f6',
        padding: '12px 0',
        '& p': {
            fontFamily: 'Source Sans Pro SemiBold',
            paddingLeft: 5,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            textTransform: 'capitalize'
        }
    },
    actionContainer: {
        width: 88,
        display: 'flex'
    },
    withPadding: {
        paddingLeft: 36
    }
});

interface IProps extends WithStyles<typeof styles> {}

@observer
class ListHeader extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.header} alignItems='center' container>
                <Grid xs={3} className={classes.withPadding} item>
                    <Typography variant='body2' color='textSecondary'>
                        Ім'я
                    </Typography>
                </Grid>
                <Grid xs item zeroMinWidth>
                    <Typography variant='body2' color='textSecondary'>
                        Посада
                    </Typography>
                </Grid>
                <Grid xs item zeroMinWidth>
                    <Typography variant='body2' color='textSecondary'>
                        Email
                    </Typography>
                </Grid>
                <Grid xs item zeroMinWidth>
                    <Typography variant='body2' color='textSecondary'>
                        Телефон
                    </Typography>
                </Grid>
                <Grid xs item zeroMinWidth>
                    <Typography variant='body2' color='textSecondary'>
                        № карти
                    </Typography>
                </Grid>
                <div className={classes.actionContainer} />
            </Grid>
        );
    }
}

export default withStyles(styles)(ListHeader);
