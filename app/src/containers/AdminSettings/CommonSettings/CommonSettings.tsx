import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles, Grid, Typography, Input, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { ISalarySettings } from '../../../interfaces/ISalarySettings';

const styles = createStyles({
    row: {
        margin: '10px auto 10px 0',
        padding: '16px 8px',
        backgroundColor: '#f5f9fc',
        width: 'auto',
        minWidth: 353,
    },
    header: {
        marginBottom: 15,
        fontFamily: 'Source Sans Pro SemiBold'
    },
    text: {},
    input: {
        width: 45,
        border: '1px solid #aaa',
        borderRadius: 2,
        margin: '0 10px'
    },
    inputRoot: {},
    inputError: {},
    submitButton: {
        margin: '20px auto 20px 0 '
    }
});

interface IProps extends WithStyles<typeof styles> {
    salarySettings?: ISalarySettings;
}

@inject(({
    appState: {
        userStore: {
            salarySettings
        }
    }
}) => ({
    salarySettings
}))
@observer
class CommonSettings extends Component<IProps> {
    render() {
        const { classes } = this.props;

        return (
            <Grid direction='column' container>
                <Typography variant='h6' className={classes.header}>
                    Бонуси
                </Typography>
                <Grid className={classes.row} alignItems='center' container>
                    <Typography className={classes.text}>
                        Розподіл бонусів, %
                    </Typography>
                    <Input
                        classes={{
                            input: classes.input,
                            root: classes.inputRoot,
                            error: classes.inputError
                        }}
                        disableUnderline />
                    <Typography className={classes.text}>на</Typography>
                    <Input
                        classes={{
                            input: classes.input,
                            root: classes.inputRoot,
                            error: classes.inputError
                        }}
                        disableUnderline />
                </Grid>
                <Grid className={classes.row} alignItems='center' container>
                    <Typography className={classes.text}>
                        Ліміт товарів для нарахування бонусів
                        <Input
                            classes={{
                                input: classes.input,
                                root: classes.inputRoot,
                                error: classes.inputError
                            }}
                            disableUnderline />
                    </Typography>
                </Grid>
                <Button className={classes.submitButton} variant='contained' color='primary'>
                    Зберегти
                </Button>
            </Grid>
        );
    }
}

export default withStyles(styles)(CommonSettings);
