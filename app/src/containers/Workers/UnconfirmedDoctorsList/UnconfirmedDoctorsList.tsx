import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IDoctor } from '../../../interfaces/IDoctor';
import DoctorListItem from '../../Doctors/DoctorListItem';
import ListHeader from '../../Doctors/ListHeader';

const styles = (theme: any) => createStyles({
    title: {
        fontSize: 16,
        fontWeight: 600,
        color: '#868698'
    }
});

interface IProps extends WithStyles<typeof styles> {
    unconfirmedDoctors?: IDoctor[];
    confirmationCallback?: (success: boolean) => void;
}

@observer
class UnconfirmedDoctorsList extends Component<IProps> {

    render() {
        const {classes, unconfirmedDoctors, confirmationCallback} = this.props;

        return (
           <Grid container>
               <Typography className={classes.title}> Додані лікарі </Typography>
               <ListHeader unconfirmed/>
               {unconfirmedDoctors.map((doc) => (
               <DoctorListItem
                   key={doc.id}
                   doctor={doc}
                   unconfirmed
                   confirmationCallback={confirmationCallback}
               />
               ))}
               </Grid>
        );
    }
}

export default withStyles(styles)(UnconfirmedDoctorsList);
