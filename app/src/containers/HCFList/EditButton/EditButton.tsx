import React, { Component } from 'react';
import { IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { Edit } from '@material-ui/icons';
import { PERMISSIONS } from '../../../constants/Permissions';
import { IUser } from '../../../interfaces';

interface IProps {
    onClick: () => void;
    className: string;
    iconClassName: string;
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
class EditButton extends Component<IProps> {
    readonly mapPermissions: Partial<Record<'hcf' | 'pharmacy', PERMISSIONS>> = {
        'hcf': PERMISSIONS.EDIT_HCF,
        'pharmacy': PERMISSIONS.EDIT_PHARMACY
    };

    get isAllowed(): boolean {
        const {
            type,
            userPermissions,
            user: { position },
            unconfirmed
        } = this.props;

        // const unconfirmedCheck = unconfirmed
        //     ? [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN].includes(position)
        //     : true;

        // if (!unconfirmedCheck) return false;

        const targetPermission = this.mapPermissions[type];
        return userPermissions.includes(targetPermission);
    }

    render() {
        const {
            onClick,
            className,
            iconClassName,
        } = this.props;

        return (
            <IconButton
                onClick={onClick}
                className={className}>
                <Edit className={iconClassName}/>
            </IconButton>
        );
    }
}

export default EditButton;
