import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles, Avatar, Grid, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { USER_ROLE } from '../../constants/Roles';
import Level from '../ProfilePreview/Level';
import { IUser } from '../../interfaces';
import { computed } from 'mobx';
import { IPosition } from '../../interfaces/IPosition';

const styles = createStyles({
    avatar: {
        height: 100,
        width: 100,
    },
    textContainer: {
        padding: '8px 0 8px 16px'
    },
    credentials: {
        fontFamily: 'Source Sans Pro SemiBold'
    },
    position: {}
});

interface IProps extends WithStyles<typeof styles> {
    user: IUser;
    positions?: Map<number, IPosition>;
    disableClick?: boolean;
    hideLevel?: boolean;
}

@inject(({
    appState: {
        departmentsStore: {
            positions
        }
    }
}) => ({
    positions
}))
@observer
class UserShortInfo extends Component<IProps> {
    @computed
    get avatarProps(): any {
        const { user } = this.props;

        if (!user) return {};

        return user.avatar
        ? { src: user.avatar }
        : { children: this.userName[0] };
    }

    @computed
    get userPosition(): USER_ROLE {
        const { user } = this.props;
        return user
        ? user.position
        : USER_ROLE.UNKNOWN;
    }

    @computed
    get userName(): string {
        return this.props.user
            ? this.props.user.name
            : '';
    }

    @computed
    get positionName(): string {
        const { positions } = this.props;

        const pos = positions.get(this.userPosition);

        return pos
            ? pos.name
            : '';
    }

    render() {
        const { classes, user, disableClick, hideLevel } = this.props;

        return (
            <>
                <Avatar className={classes.avatar} {...this.avatarProps} />
                <Grid
                    className={classes.textContainer}
                    justify='space-around'
                    direction='column'
                    container>
                    <Typography className={classes.credentials} color='textPrimary'>
                        {this.userName}
                    </Typography>
                    <Typography className={classes.position} color='textSecondary' variant='body2'>
                        {this.positionName}
                    </Typography>
                    {
                        (hideLevel === false && (this.userPosition === USER_ROLE.MEDICAL_AGENT || this.userPosition === USER_ROLE.REGIONAL_MANAGER)) &&
                        <Level user={user} disableClick={disableClick} />
                    }
                </Grid>
            </>
        );
    }
}

export default withStyles(styles)(UserShortInfo);
