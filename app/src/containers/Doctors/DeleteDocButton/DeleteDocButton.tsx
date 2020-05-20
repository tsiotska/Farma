import React, { Component } from 'react';
import { createStyles, WithStyles, IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { IWithRestriction } from '../../../interfaces';
import { withRestriction } from '../../../components/hoc/withRestriction';
import { PERMISSIONS } from '../../../constants/Permissions';

interface IProps extends IWithRestriction {
    onClick: (e: any) => void;
    className: string;
}

@withRestriction([ PERMISSIONS.DELETE_AGENT ])
@observer
class DeleteDocButton extends Component<IProps> {
    render() {
        const { onClick, className, isAllowed } = this.props;

        if (!isAllowed) return null;

        return (
            <IconButton onClick={onClick}>
                <DeleteOutlineIcon
                    className={className}
                    fontSize='small'
                />
            </IconButton>
        );
    }
}

export default DeleteDocButton;
