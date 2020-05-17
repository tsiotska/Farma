import React, { Component } from 'react';
import { createStyles, WithStyles, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IWithRestriction, IUser } from '../../../interfaces';
import { PERMISSIONS } from '../../../constants/Permissions';
import { withRestriction } from '../../hoc/withRestriction';
import { styles } from '../../FormRow';
import BlockOutlinedIcon from '@material-ui/icons/BlockOutlined';

interface IProps extends IWithRestriction {
    onMountCallback: (type: string, isHidden: boolean) => void;
    onClick: (e: any) => void;
    id: number;
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
@withRestriction([ PERMISSIONS.EDIT_USER ])
@observer
class DeleteButton extends Component<IProps> {
    get isHidden(): boolean {
        const { isAllowed, id, user } = this.props;
        const isTheSameUser = id === user.id;
        return !isAllowed || isTheSameUser;
    }

    componentDidMount() {
        const { onMountCallback } = this.props;
        onMountCallback('delete', this.isHidden);
    }

    render() {
        const {onClick } = this.props;

        if (this.isHidden) return null;

        return (
            <IconButton onClick={onClick}>
                <BlockOutlinedIcon />
            </IconButton>
        );
    }
}

export default withStyles(styles)(DeleteButton);
