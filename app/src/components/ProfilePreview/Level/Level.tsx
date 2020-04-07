import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles, Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { IUser } from '../../../interfaces';
import { USER_ROLE } from '../../../constants/Roles';
import cx from 'classnames';
import { SALARY_PREVIEW_MODAL } from '../../../constants/Modals';

const styles = (theme: any) => createStyles({
    root: {
        transition: '0.3s',
        padding: '10px 0',
        cursor: 'pointer',
        marginRight: 'auto',
        width: 'auto',
        paddingLeft: 5,
        borderRadius: 2,
        '&:hover': {
            backgroundColor: ({ disableClick }: any) => disableClick ? 'transparent' : '#f1f1f1'
        }
    },
    item: {
        width: 30,
        height: 4,
        borderRadius: 2,
        marginRight: 5,
        backgroundColor: '#d2d2d9'
    },
    red: {
        backgroundColor: theme.palette.primary.level.red
    },
    orangered: {
        backgroundColor: theme.palette.primary.level.orangered
    },
    yellow: {
        backgroundColor: theme.palette.primary.level.yellow
    },
    limeGreen: {
        backgroundColor: theme.palette.primary.level.limeGreen
    },
    green: {
        backgroundColor: theme.palette.primary.level.green
    },
});

interface IProps extends WithStyles<typeof styles> {
    user: IUser;
    openModal?: (modalName: string, payload: any) => void;
    disableClick?: boolean;
}

@inject(({
    appState: {
        uiStore: {
            openModal
        }
    }
}) => ({
    openModal
}))
@observer
class Level extends Component<IProps> {
    readonly colors: any;

    constructor(props: IProps) {
        super(props);
        const { classes: { red, orangered, yellow, limeGreen, green } } = this.props;
        this.colors = {
            [USER_ROLE.REGIONAL_MANAGER]: [red, yellow, green],
            [USER_ROLE.MEDICAL_AGENT]: [red, orangered, yellow, limeGreen, green],
        };
    }

    get userColors() {
        const { user: { position } } = this.props;
        return this.colors[position];
    }

    clickHandler = () => {
        const { disableClick, openModal, user } = this.props;
        if (!disableClick) openModal(SALARY_PREVIEW_MODAL, user);
    }

    render() {
        const { classes, user: { level } } = this.props;

        if (!this.userColors) return null;

        const content: any[] = [];
        for (let i = 1; i <= this.userColors.length; ++i) {
            content.push(
                <div
                    key={i}
                    className={cx(classes.item, { [this.userColors[i - 1]]: i <= level })}
                />
            );
        }

        return (
            <Grid onClick={this.clickHandler} className={classes.root} wrap='nowrap' alignItems='center' container>
                {content}
            </Grid>
        );
    }
}

export default withStyles(styles)(Level);
