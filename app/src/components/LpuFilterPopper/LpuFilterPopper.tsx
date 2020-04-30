import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Popover,
    Grid,
    Button,
    Divider,
    Input
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import cx from 'classnames';
import { SORT_ORDER, ISortBy } from '../../stores/UIStore';

const styles = (theme: any) => createStyles({
    input: {
        border: '1px solid #aaa',
        borderRadius: 2,
        padding: '0 8px'
    },
    container: {
        padding: 12
    },
    divider: {
        margin: '10px 0'
    },
    button: {
        marginTop: 10,
        '&.active': {
            border: '1px solid #aaa'
        }
    }
});

export type SortableProps = 'name' | 'region' | 'oblast' | 'city';

interface IProps extends WithStyles<typeof styles> {
    anchor: HTMLElement;
    propName: SortableProps;
    onClose: () => void;
    sortLpuBy?: (propName: SortableProps, order: SORT_ORDER) => void;
    LpuSortSettings?: ISortBy;
}

@inject(({
    appState: {
        uiStore: {
            sortLpuBy,
            LpuSortSettings
        }
    }
}) => ({
    sortLpuBy,
    LpuSortSettings
}))
@observer
class LpuFilterPopper extends Component<IProps> {
    get sortPropName(): SortableProps {
        const { LpuSortSettings } = this.props;
        return LpuSortSettings
            ? LpuSortSettings.propName
            : null;
    }

    get sortOrder(): SORT_ORDER {
        const { LpuSortSettings } = this.props;
        return LpuSortSettings
            ? LpuSortSettings.order
            : null;
    }

    sortAtoZ = () => {
        const { sortLpuBy, propName, onClose } = this.props;
        sortLpuBy(propName, SORT_ORDER.ASCENDING);
        onClose();
    }

    sortZtoA = () => {
        const { sortLpuBy, propName, onClose } = this.props;
        sortLpuBy(propName, SORT_ORDER.DESCENDING);
        onClose();
    }

    render() {
        const { classes, anchor, onClose, propName } = this.props;

        return (
            <Popover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onClose={onClose}
                anchorEl={anchor}
                open={!!anchor}>
                    <Grid className={classes.container} container direction='column'>
                        <Button
                            className={cx(classes.button, { active: this.sortPropName === propName && this.sortOrder === SORT_ORDER.ASCENDING})}
                            onClick={this.sortAtoZ}>
                                Сортувати від А до Я
                            </Button>
                        <Button
                            className={cx(classes.button, { active: this.sortPropName === propName && this.sortOrder === SORT_ORDER.DESCENDING})}
                            onClick={this.sortZtoA}>
                                Сортувати від Я до А
                            </Button>
                        {/* <Divider className={classes.divider} />
                        <Input className={classes.input} disableUnderline /> */}
                    </Grid>
            </Popover>
        );
    }
}

export default withStyles(styles)(LpuFilterPopper);
