import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Typography } from '@material-ui/core';
import { IUserCommonInfo } from '../../../interfaces/IUser';
import ImageLoader from '../../ImageLoader';
import Config from '../../../../Config';

interface IProps {
    label: IUserCommonInfo;
    classes?: Partial<Record<'typography'|'image', string>>;
}

@observer
class AgentTextCell extends Component<IProps> {
    get name(): string {
        const { label } = this.props;
        return label
        ? label.name
        : '-';
    }

    get avatar(): string {
        const { label } = this.props;
        return label
        ? label.avatar
        : null;
    }

    render() {
        const { classes } = this.props;

        return (
            <Typography className={classes && classes.typography} variant='body2'>
                {
                    this.avatar &&
                    <ImageLoader
                        className={classes && classes.image}
                        src={`${Config.ASSETS_URL}/${this.avatar}`}
                    />
                }
                { this.name }
            </Typography>
        );
    }
}

export default AgentTextCell;