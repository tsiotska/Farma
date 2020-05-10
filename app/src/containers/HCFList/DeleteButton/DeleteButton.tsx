import React, { Component } from 'react';
import { createStyles, WithStyles, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { Delete } from '@material-ui/icons';
import { PERMISSIONS } from '../../../constants/Permissions';
import { IUser } from '../../../interfaces';
import { USER_ROLE } from '../../../constants/Roles';

interface IProps {
    className: string;
    onClick: (e: any) => void;
    type: 'hcf' | 'pharmacy';
    unconfirmed: boolean;
    userPermissions?: PERMISSIONS[];
    user?: IUser;
}

@inject(({
    appState: {
        userStore: {
            userPermissions,
            user
        }
    }
}) => ({
    userPermissions,
    user
}))
@observer
class DeleteButton extends Component<IProps> {
    readonly mapPermissions: Partial<Record<'hcf' | 'pharmacy', PERMISSIONS>> = {
        'hcf': PERMISSIONS.DELETE_HCF,
        'pharmacy': PERMISSIONS.DELETE_PHARMACY
    };

    get isAllowed(): boolean {
        const { type, userPermissions, user: { position }, unconfirmed } = this.props;

        const unconfirmedCheck = unconfirmed
            ? [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN].includes(position)
            : true;

        if (!unconfirmedCheck) return false;

        const targetPermission = this.mapPermissions[type];
        return userPermissions.includes(targetPermission);
    }

    render() {
        const { onClick, className, children } = this.props;

        if (!this.isAllowed) return null;

        return (
            <IconButton
                onClick={onClick}
                className={className}>
                    { children }
            </IconButton>
        );
    }
}

export default DeleteButton;
