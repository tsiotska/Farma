import React, { Component } from 'react';
import { createStyles, WithStyles, IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IWithRestriction } from '../../../interfaces';
import { PERMISSIONS } from '../../../constants/Permissions';
import { withRestriction } from '../../hoc/withRestriction';
import { styles } from '../../FormRow';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

interface IProps extends IWithRestriction {
    onClick: (e: any) => void;
}

@withRestriction([ PERMISSIONS.EDIT_USER ])
@observer
class EditButton extends Component<IProps> {
    render() {
        const { isAllowed, onClick } = this.props;
        if (!isAllowed) return null;
        return (
            <IconButton onClick={onClick}>
                <EditOutlinedIcon />
            </IconButton>
        );
    }
}

export default withStyles(styles)(EditButton);
