import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Typography, createStyles, WithStyles, withStyles, FormControlLabel, Checkbox } from '@material-ui/core';
import { IUserCommonInfo } from '../../../interfaces/IUser';
import ImageLoader from '../../ImageLoader';
import Config from '../../../../Config';

const styles = createStyles({
    label: {
        margin: 0
    },
    checkbox: {
        padding: 0,
        marginRight: 5
    }
});

interface IProps extends WithStyles<typeof styles> {
    label: IUserCommonInfo;
    isIgnored: boolean;
    toggleIgnoredAgents?: (agent: IUserCommonInfo) => void;
}

@inject(({
    appState: {
        salesStore: {
            toggleIgnoredAgents
        }
    }
}) => ({
    toggleIgnoredAgents
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

    render() {
        const { classes, isIgnored } = this.props;

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
                    <Typography variant='body2'>
                        {
                            this.avatar &&
                            <ImageLoader src={`${Config.ASSETS_URL}/${this.avatar}`} />
                        }
                        { this.name }
                    </Typography>
                }
            />
        );

        // return (
        //     <Typography variant='body2'>
        //         {
        //             this.avatar &&
        //             <ImageLoader
        //                 src={`${Config.ASSETS_URL}/${this.avatar}`}
        //             />
        //         }
        //         { this.name }
        //     </Typography>
        // );
    }
}

export default withStyles(styles)(AgentTextCell);
