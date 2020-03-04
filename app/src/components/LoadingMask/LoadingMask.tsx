import * as React from 'react';
import { PureComponent } from 'react';
import { observer } from 'mobx-react';

import CircularProgress from '@material-ui/core/CircularProgress';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import {Typography} from '@material-ui/core';

const styles = (theme: any) => createStyles({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    progress: {
        margin: theme.spacing(4)
    },
});

interface IProps extends WithStyles<typeof styles> {
    color?: 'inherit' | 'primary' | 'secondary';
    size?: number;
    text?: string;
}

@observer
export class LoadingMask extends PureComponent<IProps, null> {
    public render(): JSX.Element {
        const { classes, text, ...rest } = this.props;
        return (
            <div className={classes.wrapper}>
                <CircularProgress {...rest} />
                {
                    text && (
                        <Typography>
                            { text }
                        </Typography>
                    )
                }
            </div>
        );
    }
}

export default withStyles(styles)(LoadingMask);
