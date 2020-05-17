import React, { Component } from 'react';
import { createStyles, WithStyles, IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { withRestriction } from '../../../components/hoc/withRestriction';
import { PERMISSIONS } from '../../../constants/Permissions';
import { IWithRestriction } from '../../../interfaces';
import { EditOutlined } from '@material-ui/icons';

interface IProps extends IWithRestriction {
    onClick: () => void;
    className: string;
}

@withRestriction([ PERMISSIONS.EDIT_BRANCH ])
@observer
class EditBranchButton extends Component<IProps> {
    render() {
        const { onClick, className, isAllowed } = this.props;

        if (!isAllowed) return null;

        return (
            <IconButton
                onClick={onClick}
                className={className}>
                <EditOutlined fontSize='small' />
            </IconButton>
        );
    }
}

export default EditBranchButton;
