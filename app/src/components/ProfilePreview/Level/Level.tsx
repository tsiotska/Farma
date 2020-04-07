import React, { Component } from 'react';
import { createStyles, WithStyles, withStyles, Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import { IUser } from '../../../interfaces';
import { USER_ROLE } from '../../../constants/Roles';
import cx from 'classnames';

const styles = createStyles({
    root: {},
    item: {
        width: 30,
        height: 4,
        borderRadius: 2,
        marginRight: 5,
        backgroundColor: '#d2d2d9'
    },
    red: {
        backgroundColor: '#e25353'
    },
    orangered: {
        backgroundColor: '#ff9b3a'
    },
    yellow: {
        backgroundColor: '#f3ca47'
    },
    limeGreen: {
        backgroundColor: '#a5cd58'
    },
    green: {
        backgroundColor: '#25d174'
    },
});

interface IProps extends WithStyles<typeof styles> {
    user: IUser;
}

@observer
class Level extends Component<IProps> {
    readonly colors: any;

    constructor(props: IProps) {
        super(props);
        const { classes: { red, orangered, yellow, limeGreen, green } } = this.props;
        this.colors = {
            [USER_ROLE.REGIONAL_MANAGER]: [ red, yellow, green ],
            [USER_ROLE.MEDICAL_AGENT]: [ red, orangered, yellow, limeGreen, green ],
        };
    }

    get userColors() {
        const { user: { position }} = this.props;
        return this.colors[position];
    }

    render() {
        const { classes, user: { level }} = this.props;

        if (!this.userColors) return null;

        const content: any[] = [];
        for (let i = 0; i < this.userColors.length; ++i) {
            content.push(
                <div
                    key={i}
                    className={cx(classes.item, { [this.userColors[i]]: i <= level })}
                />
            );
        }

        return (
            <Grid wrap='nowrap' alignItems='center' container>
                { content }
            </Grid>
        );
    }
}

export default withStyles(styles)(Level);
