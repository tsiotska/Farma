import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {
    Typography,
    createStyles,
    WithStyles,
    withStyles,
    FormControlLabel,
    Checkbox
} from '@material-ui/core';
import { IUserCommonInfo } from '../../../interfaces/IUser';
import ImageLoader from '../../ImageLoader';
import Config from '../../../../Config';
import { toJS } from 'mobx';

const styles = createStyles({
    label: {
        margin: 0
    },
    checkbox: {
        padding: 0,
        marginRight: 5
    },
    text: {
        display: 'flex',
        alignItems: 'center'
    },
    image: {
        marginRight: 8,
        borderRadius: 2
    }
});

interface IProps extends WithStyles<typeof styles> {
    label: IUserCommonInfo;
    isIgnored: boolean;
    toggleIgnoredAgents?: (agent: IUserCommonInfo) => void;
    historyPushUser?: (agent: IUserCommonInfo) => void;
}

@inject(({
    appState: {
        salesStore: {
            toggleIgnoredAgents
        },
        userStore: {
            historyPushUser
        }
    }
}) => ({
    toggleIgnoredAgents,
    historyPushUser
}))
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

    changeHandler = () => {
        const { toggleIgnoredAgents, label } = this.props;
        if (!label) return;
        toggleIgnoredAgents(label);
    }

    onClick = (e: any) => {
        e.preventDefault();
        const { label, historyPushUser } = this.props;
        historyPushUser(label);
    }

    render() {
        const { classes, isIgnored, label } = this.props;

        return (
            <FormControlLabel
                className={classes.label}
                control={
                    <Checkbox
                        className={classes.checkbox}
                        checked={!isIgnored}
                        onChange={this.changeHandler}
                        size='small'
                        color='default'
                    />
                }
                label={
                    <Typography onClick={this.onClick} className={classes.text} variant='body2'>
                        {
                            this.avatar &&
                            <ImageLoader
                                src={`${Config.ASSETS_URL}/${this.avatar}`}
                                className={classes.image}
                            />
                        }
                        { this.name }
                    </Typography>
                }
            />
        );
    }
}

export default withStyles(styles)(AgentTextCell);
