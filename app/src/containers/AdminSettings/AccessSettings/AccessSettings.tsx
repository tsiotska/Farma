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
import LoadingMask from '../../../components/LoadingMask';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { SNACKBAR_TYPE } from '../../../constants/Snackbars';
import Snackbar from '../../../components/Snackbar';

const styles = createStyles({
    submitButton: {
        marginRight: 'auto',
        marginTop: 30
    }
});

interface IProps extends WithStyles<typeof styles> {
    positions?: Map<number, IPosition>;
    updatePermissions?: (data: Map<USER_ROLE, PERMISSIONS[]>) => Promise<boolean>;
    getAsyncStatus?: (key: string) => IAsyncStatus;
}

@inject(({
    appState: {
        departmentsStore: {
            positions,
            updatePermissions,
            getAsyncStatus
        }
    }
}) => ({
    positions,
    updatePermissions,
    getAsyncStatus
}))
@observer
class AccessSettings extends Component<IProps> {
    @observable permissions: Map<USER_ROLE, PERMISSIONS[]> = new Map();
    @observable changedRoles: Set<USER_ROLE> = new Set();
    @observable showSnackbar: boolean = false;
    @observable snackbarType: SNACKBAR_TYPE = SNACKBAR_TYPE.SUCCESS;

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

    @computed
    get isRequestProccessing(): boolean {
        return this.props.getAsyncStatus('updatePermissions').loading;
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

    submitHandler = async () => {
        const { updatePermissions } = this.props;
        if (this.isRequestProccessing) return;
        const updated = await updatePermissions(this.permissions);
        this.snackbarType = updated
            ? SNACKBAR_TYPE.SUCCESS
            : SNACKBAR_TYPE.ERROR;
        this.showSnackbar = true;
    }

    snackbarCloseHandler = () => {
        this.showSnackbar = false;
    }

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
                        <Button
                            onClick={this.submitHandler}
                            variant='contained'
                            color='primary'
                            className={classes.submitButton}
                            disabled={this.isUnchanged}>
                                {
                                    this.isRequestProccessing
                                    ? <LoadingMask size={20} />
                                    : 'Зберегти'
                                }
                        </Button>
                        <Snackbar
                            open={this.showSnackbar}
                            onClose={this.snackbarCloseHandler}
                            type={this.snackbarType}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            autoHideDuration={6000}
                            message={
                                this.snackbarType === SNACKBAR_TYPE.SUCCESS
                                    ? 'Доступи користувачів оновленно'
                                    : 'Під час оновлення доступів трапилась помилка'
                            }
                        />
                    </>

                }

            </Grid>
        );
    }
}

export default withStyles(styles)(AccessSettings);
