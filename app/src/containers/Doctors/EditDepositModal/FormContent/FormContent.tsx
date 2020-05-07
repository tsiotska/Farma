import {
    createStyles, withStyles, WithStyles,
    Grid, InputBase, InputLabel, Button, Typography, FormControl
} from '@material-ui/core';
import LoadingMask from '../../../../components/LoadingMask';
import { observer } from 'mobx-react';
import { Component } from 'react';
import React from 'react';
import { computed } from 'mobx';
import cx from 'classNames';

const styles = (theme: any) => createStyles({
        root: {
            minWidth: 600,
            [theme.breakpoints.up('sm')]: {
                width: 'fit-content',
            },
        },
        head: {
            [theme.breakpoints.up('sm')]: {
                marginRight: theme.spacing(2),
            },
        },
        count: {
            color: '#1ba61f',
            fontSize: 22
        },

        FIO: {},

        body: {
            flexWrap: 'nowrap',
            maxHeight: 300,
            overflowY: 'auto',
            padding: theme.spacing(2, 0),
            borderTop: '1px solid #a8a8a8',
            borderBottom: '1px solid #a8a8a8'
        },

        field: {
            marginTop: theme.spacing(2)
        },

        label: {
            marginBottom: theme.spacing(1)
        },

        minusValue: {
            color: '#a60825'
        },

        plusValue: {
            color: '#1ba61f'
        },

        footer: {
            justifyContent: 'space-between',
            alignItems:
                'center',
            marginTop:
                theme.spacing(2),
            [theme.breakpoints.down('sm')]:
                {
                    flexDirection: 'column',
                    minWidth:
                        300,
                }
        }
        ,

        smallInput: {
            width: 125
        }
        ,

        longInput: {
            width: 315
        }
        ,

        bootstrapInput: {
            border: '1px solid #a8a8a8'
        }
        ,

        submitButton: {
            margin: '8px 0 0 auto',
            padding:
                '4px 16px',
        }
        ,
    })
;

interface IProps extends WithStyles<typeof styles> {
    submitHandler: (data: any) => void;
    isLoading: boolean;
}

@observer
class FormContent extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    @computed
    get isSubmitAllowed(): boolean {
        return false;
    }

    submitHandler = () => {
        //  if (this.isSubmitAllowed) this.props.submitHandler();
    }

    render() {
        const { classes, isLoading } = this.props;
        return (
            <Grid direction='column' className={classes.root} container>
                <Grid direction='column' className={classes.head} container item>
                    <Grid item>
                        <Typography className={classes.count}>
                            9 679
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography className={classes.FIO}>
                            Цензура Татьяна Владимировна
                        </Typography>
                    </Grid>
                </Grid>

                <Grid direction='column' className={classes.body} container item>
                    <Grid direction='row' className={classes.field} container item>
                        <Grid xs={3} item>
                            <Typography color='textSecondary'>Март 2020</Typography>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography>+50</Typography>
                        </Grid>
                        <Grid xs={6} item>
                            <Typography>За гарні очі</Typography>
                        </Grid>
                    </Grid>

                    <Grid direction='row' className={classes.field} container item>
                        <Grid xs={3} item>
                            <Typography color='textSecondary'>Март 2020</Typography>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography>+511</Typography>
                        </Grid>
                        <Grid xs={6} item>
                            <Typography>За гарні очі</Typography>
                        </Grid>
                    </Grid>

                    <Grid direction='row' className={classes.field} container item>
                        <Grid xs={3} item>
                            <Typography color='textSecondary'>Март 2020</Typography>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography>-11</Typography>
                        </Grid>
                        <Grid xs={6} item>
                            <Typography>Виписка</Typography>
                        </Grid>
                    </Grid>

                    <Grid direction='row' className={classes.field} container item>
                        <Grid xs={3} item>
                            <Typography color='textSecondary'> Март 2020</Typography>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography>-11</Typography>
                        </Grid>
                        <Grid xs={6} item>
                            <Typography>Виписка</Typography>
                        </Grid>
                    </Grid>

                    <Grid direction='row' className={classes.field} container item>
                        <Grid xs={3} item>
                            <Typography color='textSecondary'>Март 2020</Typography>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography>-11</Typography>
                        </Grid>
                        <Grid xs={6} item>
                            <Typography>Виписка</Typography>
                        </Grid>
                    </Grid>

                    <Grid direction='row' className={classes.field} container item>
                        <Grid xs={3} item>
                            <Typography color='textSecondary'>Март 2020</Typography>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography>-11</Typography>
                        </Grid>
                        <Grid xs={6} item>
                            <Typography>Виписка</Typography>
                        </Grid>
                    </Grid>

                    <Grid direction='row' className={classes.field} container item>
                        <Grid xs={3} item>
                            <Typography color='textSecondary'>Март 2020</Typography>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography>-11</Typography>
                        </Grid>
                        <Grid xs={6} item>
                            <Typography>Виписка</Typography>
                        </Grid>
                    </Grid>

                    <Grid direction='row' className={classes.field} container item>
                        <Grid xs={3} item>
                            <Typography color='textSecondary'>Март 2020</Typography>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography>-11</Typography>
                        </Grid>
                        <Grid xs={6} item>
                            <Typography>Виписка</Typography>
                        </Grid>
                    </Grid>

                    <Grid direction='row' className={classes.field} container item>
                        <Grid xs={3} item>
                            <Typography color='textSecondary'>Март 2020</Typography>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography>-11</Typography>
                        </Grid>
                        <Grid xs={6} item>
                            <Typography>Виписка</Typography>
                        </Grid>
                    </Grid>

                    <Grid direction='row' className={classes.field} container item>
                        <Grid xs={3} item>
                            <Typography color='textSecondary'>Март 2020</Typography>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography>-11</Typography>
                        </Grid>
                        <Grid xs={6} item>
                            <Typography>Виписка</Typography>
                        </Grid>
                    </Grid>
                    <Grid direction='row' className={classes.field} container item>
                        <Grid xs={3} item>
                            <Typography color='textSecondary'>Март 2020</Typography>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography>-11</Typography>
                        </Grid>
                        <Grid xs={6} item>
                            <Typography>Виписка</Typography>
                        </Grid>
                    </Grid>

                    <Grid direction='row' className={classes.field} container item>
                        <Grid xs={3} item>
                            <Typography color='textSecondary'>Март 2020</Typography>
                        </Grid>
                        <Grid xs={3} item>
                            <Typography>-11</Typography>
                        </Grid>
                        <Grid xs={6} item>
                            <Typography>Виписка</Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid direction='row' className={classes.footer} container>

                    <Grid item>
                        <InputLabel className={classes.label} htmlFor='sumInput'>
                            Сумма
                        </InputLabel>
                        <InputBase id='sumInput' className={cx(classes.bootstrapInput, classes.smallInput)}/>
                    </Grid>

                    <Grid item>
                        <InputLabel className={classes.label} htmlFor='sumInput'>
                            Причина
                        </InputLabel>
                        <InputBase id='sumInput' className={cx(classes.bootstrapInput, classes.longInput)}/>
                    </Grid>

                    <Grid item>
                        <Button
                            disabled={!this.isSubmitAllowed || isLoading}
                            className={classes.submitButton}
                            variant='contained'
                            color='primary'
                            onClick={this.submitHandler}>
                            {
                                isLoading
                                    ? <LoadingMask size={20}/>
                                    : 'Змінити'
                            }
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(FormContent);
