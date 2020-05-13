import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles, Grid, Typography, Checkbox } from '@material-ui/core';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { PERMISSIONS } from '../../../../constants/Permissions';

const styles = createStyles({
    complexHeader: {
        marginTop: 40
    },
    cell: {
        borderBottom: '1px solid #E4EDF7',
        height: 40
    },
    title_bold: {
        fontWeight: 600,
        color: '#808080'
    }
});

interface IProps extends WithStyles<typeof styles> {
    title: string;
    permissions: PERMISSIONS[];
    onChange: (e: any, value: PERMISSIONS) => void;
}

@observer
class TableRow extends Component<IProps> {
    changeHandler = (value: PERMISSIONS) => (e: any) => this.props.onChange(e, value);

    render() {
        const { classes, title, permissions } = this.props;

        return (
            <Grid direction='column' wrap='nowrap' container>

                <Grid className={cx(classes.complexHeader)} >
                <Grid className={cx(classes.cell)} justify='center' container item>
                    <Typography className={classes.title_bold} variant='body1'>
                        {title}
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell)} justify='center' container item>
                    <Typography variant='body1'>
                        <Checkbox onChange={this.changeHandler(PERMISSIONS.SEE_REPORT)} checked={permissions.includes(PERMISSIONS.SEE_REPORT)} size='small' color='default' />
                    </Typography>
                </Grid>
                </Grid>

                <Grid className={cx(classes.complexHeader)} >
                <Grid className={cx(classes.cell)} justify='center' container item>
                    <Typography color='textSecondary' variant='body1'>
                        {title}
                    </Typography>
                </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.EDIT_USER)} checked={permissions.includes(PERMISSIONS.EDIT_USER)} size='small' color='default' />
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.EDIT_SALARY)} checked={permissions.includes(PERMISSIONS.EDIT_SALARY)} size='small' color='default' />
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.EDIT_DRUG)} checked={permissions.includes(PERMISSIONS.EDIT_DRUG)} size='small' color='default' />
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.EDIT_HCF)} checked={permissions.includes(PERMISSIONS.EDIT_HCF)} size='small' color='default' />
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.EDIT_PHARMACY)} checked={permissions.includes(PERMISSIONS.EDIT_PHARMACY)} size='small' color='default' />
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.EDIT_AGENT)} checked={permissions.includes(PERMISSIONS.EDIT_AGENT)} size='small' color='default' />
                    </Grid>
                </Grid>

                <Grid className={cx(classes.complexHeader)} >
                <Grid className={cx(classes.cell)} justify='center' container item>
                    <Typography color='textSecondary' variant='body1'>
                        {title}
                    </Typography>
                </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.ADD_DRUG)} checked={permissions.includes(PERMISSIONS.ADD_DRUG)} size='small' color='default' />
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.ADD_HCF)} checked={permissions.includes(PERMISSIONS.ADD_HCF)} size='small' color='default' />
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.ADD_PHARMACY)} checked={permissions.includes(PERMISSIONS.ADD_PHARMACY)} size='small' color='default' />
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.ADD_AGENT)} checked={permissions.includes(PERMISSIONS.ADD_AGENT)} size='small' color='default' />
                    </Grid>
                </Grid>

                <Grid className={cx(classes.complexHeader)} >
                <Grid className={cx(classes.cell)} justify='center' container item>
                    <Typography color='textSecondary' variant='body1'>
                        {title}
                    </Typography>
                </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.DELETE_DRUG)} checked={permissions.includes(PERMISSIONS.DELETE_DRUG)} size='small' color='default' />
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.DELETE_HCF)} checked={permissions.includes(PERMISSIONS.DELETE_HCF)} size='small' color='default' />
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.DELETE_PHARMACY)} checked={permissions.includes(PERMISSIONS.DELETE_PHARMACY)} size='small' color='default' />
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                    <Checkbox onChange={this.changeHandler(PERMISSIONS.DELETE_AGENT)} checked={permissions.includes(PERMISSIONS.DELETE_AGENT)} size='small' color='default' />
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(TableRow);
