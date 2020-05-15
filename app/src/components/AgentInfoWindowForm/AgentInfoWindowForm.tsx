import React, { Component } from 'react';
import { Card, CardContent, createStyles, Grid, IconButton, Typography, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import copy from 'clipboard-copy';

const styles = (theme: any) => createStyles({
    root: {
        padding: 10
    },
    field: {
        '&:not(:first-child)': { marginTop: '15px' }
    }
});

interface IProps extends WithStyles<typeof styles> {
    region?: { id: number, name: string };
    mobilePhone?: string;
    workPhone?: string;
    card?: string;
    specialty?: string;
}

@observer
class AgentInfoWindowForm extends Component<IProps> {

    copyCardNumber = () => {
        copy(this.props.card);
    }

    render() {
        const { classes, specialty, workPhone, mobilePhone, region, card } = this.props;

        return (
            <Card className={classes.root}>
                <CardContent>
                    {specialty &&
                    <Grid container direction='column' className={classes.field}>
                        <Typography color='textSecondary'>
                            Спеціальність
                        </Typography>
                        <Typography>
                            {specialty}
                        </Typography>
                    </Grid>
                    }
                    {workPhone &&
                    <Grid container direction='column' className={classes.field}>
                        <Typography color='textSecondary'>
                            Робочий телефон
                        </Typography>
                        <Typography>
                            {workPhone}
                        </Typography>
                    </Grid>
                    }
                    {mobilePhone &&
                    <Grid container direction='column' className={classes.field}>
                        <Typography color='textSecondary'>
                            Мобільний телефон
                        </Typography>
                        <Typography>
                            {mobilePhone}
                        </Typography>
                    </Grid>
                    }
                    {region &&
                    <Grid container direction='column' className={classes.field}>
                        <Typography color='textSecondary'>
                            Регіон
                        </Typography>
                        <Typography>
                            {region && region.name}
                        </Typography>
                    </Grid>
                    }
                    {card &&
                    <Grid container wrap='nowrap' className={classes.field}>
                        <Grid container direction='column'>
                            <Typography color='textSecondary'>
                                Банківська картка
                            </Typography>
                            <Typography>
                                {card}
                            </Typography>
                        </Grid>
                        <Grid>
                            <IconButton onClick={this.copyCardNumber}>
                                <FileCopyOutlinedIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                    }
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(AgentInfoWindowForm);
