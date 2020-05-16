import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IWithRestriction } from '../../../interfaces';
import { PERMISSIONS } from '../../../constants/Permissions';
import { withRestriction } from '../../../components/hoc/withRestriction';
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

interface IProps extends IWithRestriction {
    onClick: (e: any) => void;
}

@withRestriction([ PERMISSIONS.DELETE_DRUG ])
@observer
class RemoveButton extends Component<IProps> {
    render() {
        const { onClick, isAllowed } = this.props;

        if (!isAllowed) return null;

        return (
            <IconButton onClick={onClick}>
                <Delete fontSize='small' />
            </IconButton>
        );
    }
}

export default RemoveButton;
