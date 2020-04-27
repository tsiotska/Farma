import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Button,
    IconButton,
    Typography
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { Delete, Edit } from '@material-ui/icons';
import { IDoctor } from '../../../interfaces/IDoctor';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    root: {
        backgroundColor: ({ unconfirmed }: any) => unconfirmed
            ? theme.palette.primary.blue
            : 'white',
        marginBottom: 1,
        padding: '5px 0 5px 5px',
        '& > .MuiGrid-container': {
            overflowX: 'hidden'
        }
    },
    column: {
        minWidth: 120
    },
    phone: {},
    phoneContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    editIcon: {
        color: theme.palette.primary.green.main
    },
    removeIcon: {
        color: ({ unconfirmed }: any) => unconfirmed
            ? 'white'
            : theme.palette.primary.gray.light
    },
    text: {
        color: ({ unconfirmed }: any) => unconfirmed
            ? 'white'
            : theme.palette.primary.gray.main,
        paddingRight: 5
    },
    confirmButton: {
        color: 'white',
        borderColor: 'white',
        height: 36,
        padding: '0 8px'
    },
    deposit: {
        width: '100%',
        color: '#7B8FFE'
    }
});

interface IProps extends WithStyles<typeof styles> {
    doctor: IDoctor;
    unconfirmed?: boolean;
}

@observer
class DoctorListItem extends Component<IProps> {
    render() {
        const {
            unconfirmed,
            classes,
            doctor: {
                LPUName,
                name,
                specialty,
                mobilePhone,
                workPhone,
                deposit,
                card,
            }
        } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' wrap='nowrap' container>
                <Grid xs={3} container item>
                    <Typography className={classes.text}>
                        { LPUName || '-' }
                    </Typography>
                </Grid>
                <Grid xs={3} container item>
                    <Typography className={classes.text}>
                        { name || '-' }
                    </Typography>
                </Grid>
                <Grid xs className={classes.column} container item>
                    <Typography className={classes.text}>
                        { specialty || '-'}
                    </Typography>
                </Grid>
                <Grid xs className={classes.column} container item>
                    <Typography className={cx(classes.phoneContainer, classes.text)}>
                        {
                            !mobilePhone && !workPhone
                            ? '-'
                            : <>
                                <span className={classes.phone}>{ mobilePhone }</span>
                                <span className={classes.phone}>{ workPhone }</span>
                              </>
                        }
                    </Typography>
                </Grid>
                <Grid xs className={classes.column} container item>
                    <Typography className={classes.text}>
                        { card || '-'}
                    </Typography>
                </Grid>
                <Grid xs={3} alignItems='center' justify='flex-end' wrap='nowrap' container item>
                    {
                        unconfirmed
                        ? <Button className={classes.confirmButton} variant='outlined'>
                            Підтвердити
                          </Button>
                        : <>
                            <Typography className={cx(classes.deposit, classes.text)}>
                                { deposit || 0 }
                            </Typography>
                            <IconButton>
                                <Edit className={classes.editIcon} fontSize='small' />
                            </IconButton>
                          </>
                    }
                    <IconButton>
                        <Delete className={classes.removeIcon} fontSize='small' />
                    </IconButton>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(DoctorListItem);
