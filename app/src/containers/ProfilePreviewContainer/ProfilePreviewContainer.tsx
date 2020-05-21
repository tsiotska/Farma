import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, createStyles, WithStyles } from '@material-ui/core';
import { IUser } from '../../interfaces';
import ProfilePreview from '../../components/ProfilePreview';

const styles = createStyles({
    navContainer: {
        // height: 128,
        position: 'relative',
        overflow: 'hidden'
    },
});

interface IProps extends WithStyles<typeof styles> {
    navHistory?: IUser[];
}

@inject(({
    appState: {
        userStore: {
            navHistory
        }
    }
}) => ({
    navHistory
}))
@observer
class ProfilePreviewContainer extends Component<IProps> {
    render() {
        const { navHistory, classes } = this.props;

        return navHistory.length
        ? <div className={classes.navContainer}>
            {
                navHistory.map((user, i, arr) => (
                    <ProfilePreview
                        key={user.id}
                        user={user}
                        index={i}
                        scaleIndex={arr.length - i - 1}
                    />
                ))
            }
          </div>
        : null;
    }
}

export default withStyles(styles)(ProfilePreviewContainer);
