import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    withStyles,
    Grid,
    Typography,
    Checkbox
} from '@material-ui/core';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { PERMISSIONS } from '../../../../constants/Permissions';
import { USER_ROLE } from '../../../../constants/Roles';

const styles = createStyles({
    complexHeader: {
        marginTop: 40
    },
    cell: {
        borderBottom: '1px solid #E4EDF7',
        height: 40,
        whiteSpace: 'nowrap'
    },
    title_bold: {
        fontWeight: 600,
        color: '#808080'
    }
});

interface IProps extends WithStyles<typeof styles> {
    title: string;
    permissions: Map<USER_ROLE, PERMISSIONS[]>;
    onChange: (e: any, role: USER_ROLE, value: PERMISSIONS) => void;
    targetRole: USER_ROLE;
    // permissions: PERMISSIONS[];
    // onChange: (e: any, value: PERMISSIONS) => void;
}

@observer
class TableRow extends Component<IProps> {
    get targetPermissions(): PERMISSIONS[] {
        const { permissions, targetRole } = this.props;
        return permissions.get(targetRole) || [];
    }
    changeHandler = (value: PERMISSIONS) => (e: any) => {
        const { targetRole, onChange } = this.props;
        onChange(e, targetRole, value);
    }

    render() {
        const { classes, title, permissions } = this.props;

        return (
            <Grid direction='column' wrap='nowrap' container>

                <Grid className={cx(classes.complexHeader)}>
                    <Grid justify='center' alignItems='center' className={cx(classes.cell)} container item>
                        <Typography className={classes.title_bold} variant='body1'>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Typography variant='body1'>
                            <Checkbox
                                onChange={this.changeHandler(PERMISSIONS.SEE_REPORT)}
                                checked={this.targetPermissions.includes(PERMISSIONS.SEE_REPORT)}
                                size='small' color='default'/>
                        </Typography>
                    </Grid>
                </Grid>

                <Grid className={cx(classes.complexHeader)}>
                    <Grid alignItems='center' className={cx(classes.cell)} justify='center' container item>
                        <Typography color='textSecondary' variant='body1'>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.EDIT_BRANCH)}
                            checked={this.targetPermissions.includes(PERMISSIONS.EDIT_BRANCH)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.EDIT_USER)}
                            checked={this.targetPermissions.includes(PERMISSIONS.EDIT_USER)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.EDIT_SALARY)}
                            checked={this.targetPermissions.includes(PERMISSIONS.EDIT_SALARY)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.EDIT_DRUG)}
                            checked={this.targetPermissions.includes(PERMISSIONS.EDIT_DRUG)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.EDIT_HCF)}
                            checked={this.targetPermissions.includes(PERMISSIONS.EDIT_HCF)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.EDIT_PHARMACY)}
                            checked={this.targetPermissions.includes(PERMISSIONS.EDIT_PHARMACY)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.EDIT_AGENT)}
                            checked={this.targetPermissions.includes(PERMISSIONS.EDIT_AGENT)}
                            size='small' color='default'/>
                    </Grid>
                </Grid>

                <Grid className={cx(classes.complexHeader)}>
                    <Grid alignItems='center' className={cx(classes.cell)} justify='center' container item>
                        <Typography color='textSecondary' variant='body1'>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.ADD_BRANCH)}
                            checked={this.targetPermissions.includes(PERMISSIONS.ADD_BRANCH)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.ADD_USER)}
                            checked={this.targetPermissions.includes(PERMISSIONS.ADD_USER)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.ADD_DRUG)}
                            checked={this.targetPermissions.includes(PERMISSIONS.ADD_DRUG)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.ADD_HCF)}
                            checked={this.targetPermissions.includes(PERMISSIONS.ADD_HCF)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.ADD_PHARMACY)}
                            checked={this.targetPermissions.includes(PERMISSIONS.ADD_PHARMACY)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.ADD_AGENT)}
                            checked={this.targetPermissions.includes(PERMISSIONS.ADD_AGENT)}
                            size='small' color='default'/>
                    </Grid>
                </Grid>

                <Grid className={cx(classes.complexHeader)}>
                    <Grid alignItems='center' className={cx(classes.cell)} justify='center' container item>
                        <Typography color='textSecondary' variant='body1'>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.DELETE_BRANCH)}
                            checked={this.targetPermissions.includes(PERMISSIONS.DELETE_BRANCH)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.FIRED_USER)}
                            checked={this.targetPermissions.includes(PERMISSIONS.FIRED_USER)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.DELETE_DRUG)}
                            checked={this.targetPermissions.includes(PERMISSIONS.DELETE_DRUG)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.DELETE_HCF)}
                            checked={this.targetPermissions.includes(PERMISSIONS.DELETE_HCF)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.DELETE_PHARMACY)}
                            checked={this.targetPermissions.includes(PERMISSIONS.DELETE_PHARMACY)}
                            size='small' color='default'/>
                    </Grid>
                    <Grid className={cx(classes.cell)} justify='center' container item>
                        <Checkbox
                            onChange={this.changeHandler(PERMISSIONS.DELETE_AGENT)}
                            checked={this.targetPermissions.includes(PERMISSIONS.DELETE_AGENT)}
                            size='small' color='default'/>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(TableRow);
