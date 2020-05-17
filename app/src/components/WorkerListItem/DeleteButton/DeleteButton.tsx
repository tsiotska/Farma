import React, { Component } from 'react';
import { IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { NotInterested } from '@material-ui/icons';
import { IWithRestriction, IUser } from '../../../interfaces';
import { PERMISSIONS } from '../../../constants/Permissions';
import { withRestriction } from '../../hoc/withRestriction';

interface IProps extends IWithRestriction {
    workerId: number;
    onClick: (e: any) => void;
    className: string;
    user?: IUser;
}

@inject(({
    appState: {
        userStore: {
            user
        }
    }
}) => ({
    user
}))
@withRestriction([ PERMISSIONS.FIRED_USER ])
@observer
class DeleteButton extends Component<IProps> {
    render() {
        const {
            onClick,
            className,
            isAllowed,
            user: { id },
            workerId
         } = this.props;

        const isTheSameUser = id === workerId;

        if (!isAllowed || isTheSameUser) return null;

        return (
            <IconButton
                onClick={onClick}
                className={className}>
                <NotInterested fontSize='small' />
            </IconButton>
        );
    }
}

export default DeleteButton;
