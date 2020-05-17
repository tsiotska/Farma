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
    onMountCallback: (type: string, isHidden: boolean) => void;
}

@withRestriction([ PERMISSIONS.EDIT_USER ])
@observer
class EditButton extends Component<IProps> {
    get isHidden(): boolean {
        const { isAllowed } = this.props;
        return !isAllowed;
    }

    componentDidMount() {
        const { onMountCallback } = this.props;
        onMountCallback('edit', this.isHidden);
    }

    render() {
        const { onClick } = this.props;

        if (this.isHidden) return null;

        return (
            <IconButton onClick={onClick}>
                <EditOutlinedIcon />
            </IconButton>
        );
    }
}

export default withStyles(styles)(EditButton);
