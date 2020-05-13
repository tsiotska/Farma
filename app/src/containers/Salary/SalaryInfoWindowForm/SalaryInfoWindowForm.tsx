import React, { Component } from 'react';
import { Card, CardContent, createStyles, Grid, Typography, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => createStyles({
    root: {
        padding: '10px'
    },
    column: {
        '&:not(:first-child)': { marginTop: '15px' }
    }
});

interface IProps extends WithStyles<typeof styles> {
    region?: { id: number, name: string };
    mobilePhone?: string;
    workPhone?: string;
    card?: string;
}

@observer
class SalaryInfoWindowForm extends Component<IProps> {

    render() {
        const { classes, workPhone, mobilePhone, region, card } = this.props;

        return (
            <Card className={classes.root}>
                <CardContent>
                    { workPhone &&
                        <Grid className={classes.column}>
                            <Typography color='textSecondary'>
                                Робочий телефон
                            </Typography>
                            <Typography>
                                {workPhone}
                            </Typography>
                        </Grid>
                    }
                    { mobilePhone &&
                        <Grid className={classes.column}>
                            <Typography color='textSecondary'>
                                Мобільний телефон
                            </Typography>
                            <Typography>
                                {mobilePhone}
                            </Typography>
                        </Grid>
                    }
                    {region &&
                    <Grid className={classes.column}>
                      <Typography color='textSecondary'>
                        Регіон
                      </Typography>
                      <Typography>
                          {region && region.name}
                      </Typography>
                    </Grid>
                    }
                    { card &&
                        <Grid className={classes.column}>
                            <Typography color='textSecondary'>
                                Банківська картка
                            </Typography>
                            <Typography>
                                {card}
                            </Typography>
                        </Grid>
                    }
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(SalaryInfoWindowForm);
