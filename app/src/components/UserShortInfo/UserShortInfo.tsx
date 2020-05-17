import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles, Avatar, Grid, Typography, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { USER_ROLE } from '../../constants/Roles';
import Level from '../ProfilePreview/Level';
import { IUser } from '../../interfaces';
import { computed, toJS } from 'mobx';
import { IPosition } from '../../interfaces/IPosition';
import Config from '../../../Config';
import { SALARY_PREVIEW_MODAL } from '../../constants/Modals';

const styles = createStyles({
    avatar: {
        height: 100,
        width: 100,
    },
    textContainer: {
        padding: '0 0 0 16px',
        justifyContent: 'space-around'
    },
    credentials: {
        fontFamily: 'Source Sans Pro SemiBold'
    },
    levelButton: {
        padding: 0,
        marginRight: 'auto',
        marginTop: 4
    },
    levelButtonLabel: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        color: '#647cfe'
    },
    position: {}
});

interface IProps extends WithStyles<typeof styles> {
    user: IUser;
    positions?: Map<number, IPosition>;
    disableClick?: boolean;
    hideLevel?: boolean;
    openModal?: (modalName: string, payload: any) => void;
    disableText?: boolean;
    hidePosition?: boolean;
}

@inject(({
    appState: {
        departmentsStore: {
            positions
        },
        uiStore: {
            openModal
        }
    }
}) => ({
    positions,
    openModal
}))
@observer
class UserShortInfo extends Component<IProps> {
    @computed
    get avatarProps(): any {
        const { user } = this.props;

        if (!user) return {};

        return user.image
        ? { src: `${Config.ASSETS_URL}/${user.image}` }
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

    @computed
    get showLevel(): boolean {
        const { hideLevel } = this.props;
        return hideLevel !== true && (this.userPosition === USER_ROLE.MEDICAL_AGENT || this.userPosition === USER_ROLE.REGIONAL_MANAGER);
    }

    salaryButtonClickHandler = () => {
        const { openModal, user } = this.props;
        openModal(SALARY_PREVIEW_MODAL, user);
    }

    render() {
        const { classes, user, disableClick, disableText, hidePosition } = this.props;

        return (
            <>
                <Avatar className={classes.avatar} {...this.avatarProps} />
                <Grid
                    className={classes.textContainer}
                    direction='column'
                    container>
                    <Typography className={classes.credentials} color='textPrimary'>
                        {this.userName}
                    </Typography>
                    <Typography className={classes.position} color='textSecondary' variant='body2'>
                        {!hidePosition && this.positionName}
                    </Typography>
                    {
                        this.showLevel &&
                        <Button
                            disabled={disableClick}
                            onClick={this.salaryButtonClickHandler}
                            classes={{
                                root: classes.levelButton,
                                label: classes.levelButtonLabel
                            }}>
                            <Level user={user} />
                            { !disableText && <Typography>Подивитись заплату </Typography>}
                        </Button>
                    }

                </Grid>
            </>
        );
    }
}

export default withStyles(styles)(UserShortInfo);
