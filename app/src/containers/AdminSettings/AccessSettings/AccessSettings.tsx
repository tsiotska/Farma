import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles, Grid, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import TableHeader from './TableHeader';
import { IPosition } from '../../../interfaces/IPosition';
import TableRow from './TableRow';
import { USER_ROLE } from '../../../constants/Roles';
import { observable, computed } from 'mobx';
import { PERMISSIONS } from '../../../constants/Permissions';
import isEqual from 'lodash/isEqual';

const styles = createStyles({
    submitButton: {
        marginLeft: 'auto',
        marginTop: 30
    }
});

interface IProps extends WithStyles<typeof styles> {
    positions?: Map<number, IPosition>;
    updatePermissions?: (data: Map<USER_ROLE, PERMISSIONS[]>) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            positions,
            updatePermissions
        }
    }
}) => ({
    positions,
    updatePermissions
}))
@observer
class AccessSettings extends Component<IProps> {
    @observable permissions: Map<USER_ROLE, PERMISSIONS[]> = new Map();
    @observable changedRoles: Set<USER_ROLE> = new Set();

    @computed
    get initialPermissions(): Map<USER_ROLE, PERMISSIONS[]> {
        const { positions } = this.props;
        const res = new Map();

        if (!positions.size) return res;
        positions.forEach(({ permissions }, role) => {
            res.set(role, [...permissions].sort());
        });
        return res;
    }

    @computed
    get isUnchanged(): boolean {
        return !this.changedRoles.size;
    }

    changeHandler = (role: USER_ROLE) => ({ target: { checked }}: any, value: PERMISSIONS) => {
        const permissions = [...this.permissions.get(role)];

        if (checked && permissions.includes(value) === false) {
            permissions.push(value);
        } else if (checked === false && permissions.includes(value) === true) {
            const ind = permissions.indexOf(value);
            if (ind !== -1) permissions.splice(ind, 1);
        }

        const sorted = permissions.sort();
        const isEqualToInitial = isEqual(sorted, this.initialPermissions.get(role));

        if (isEqualToInitial) this.changedRoles.delete(role);
        else this.changedRoles.add(role);

        this.permissions.set(role, sorted);
    }

    submitHandler = () => this.props.updatePermissions(this.permissions);

    componentDidMount() {
        const { positions } = this.props;
        if (positions.size) {
            positions.forEach(({ permissions }, key) => {
                this.permissions.set(key, permissions);
            });
        }
    }

    componentDidUpdate(prevProps: IProps) {
        const { positions: prevPositions } = prevProps;
        const { positions: actualPositions } = this.props;
        if (!prevPositions.size && actualPositions.size) {
            actualPositions.forEach(({ permissions }, key) => {
                this.permissions.set(key, permissions);
            });
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid direction='column' container>
                <TableHeader />
                {
                    this.permissions.size &&
                    <>
                        <TableRow onChange={this.changeHandler(USER_ROLE.SUPER_ADMIN)} title='Супер адмін' permissions={this.permissions.get(USER_ROLE.SUPER_ADMIN)} />
                        <TableRow onChange={this.changeHandler(USER_ROLE.ADMIN)} title='Адмін' permissions={this.permissions.get(USER_ROLE.ADMIN)} />
                        <TableRow onChange={this.changeHandler(USER_ROLE.PRODUCT_MANAGER)} title='Продукт Менеджер' permissions={this.permissions.get(USER_ROLE.PRODUCT_MANAGER)} />
                        <TableRow onChange={this.changeHandler(USER_ROLE.FIELD_FORCE_MANAGER)} title='ФФМ' permissions={this.permissions.get(USER_ROLE.FIELD_FORCE_MANAGER)} />
                        <TableRow onChange={this.changeHandler(USER_ROLE.REGIONAL_MANAGER)} title='РМ' permissions={this.permissions.get(USER_ROLE.REGIONAL_MANAGER)} />
                        <TableRow onChange={this.changeHandler(USER_ROLE.MEDICAL_AGENT)} title='МП' permissions={this.permissions.get(USER_ROLE.MEDICAL_AGENT)} />
                        <Button onClick={this.submitHandler} variant='contained' color='primary' className={classes.submitButton} disabled={this.isUnchanged}>
                            Зберегти
                        </Button>
                    </>

                }

            </Grid>
        );
    }
}

export default withStyles(styles)(AccessSettings);
