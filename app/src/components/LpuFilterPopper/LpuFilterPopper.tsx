import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Popover,
    Grid,
    Button,
    Divider,
    Input,
    Typography,
    List
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import cx from 'classnames';
import { SORT_ORDER, ISortBy } from '../../stores/UIStore';
import { ILPU } from '../../interfaces/ILPU';
import SuggestItem from './SuggestItem';

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
    },
    list: {
        overflow: 'auto',
        maxHeight: 300,
        maxWidth: 250
    },
    listItem: {}
});

export type SortableProps = 'name' | 'region' | 'oblast' | 'city';

interface IProps extends WithStyles<typeof styles> {
    anchor: HTMLElement;
    propName: SortableProps;
    onClose: () => void;

    sortLpuBy?: (propName: SortableProps, order: SORT_ORDER) => void;
    LpuSortSettings?: ISortBy;
    sortedLpus?: ILPU[];
}

@inject(({
    appState: {
        uiStore: {
            sortLpuBy,
            LpuSortSettings
        },
        departmentsStore: {
            sortedLpus
        }
    }
}) => ({
    sortLpuBy,
    sortedLpus,
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

    get suggestions(): ILPU[] {
        const { sortedLpus } = this.props;
        return sortedLpus
            ? sortedLpus.slice(0, 50)
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

    lpuClickHandler = (lpu: ILPU) => {
        console.log('click');
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
                        <Divider className={classes.divider} />
                        <Input className={classes.input} disableUnderline />
                        <List className={classes.list}>
                            {
                                this.suggestions
                                    ? this.suggestions.length
                                        ? this.suggestions.map(x => (
                                            <SuggestItem
                                                lpu={x}
                                                title='name'
                                                checked={false}
                                                onClick={this.lpuClickHandler}
                                                className={classes.listItem}
                                            />
                                          ))
                                        : <Typography>
                                            Відповідні дані відсутні
                                          </Typography>
                                    : <Typography>
                                        Дані відсутні
                                    </Typography>
                            }
                        </List>
                    </Grid>
            </Popover>
        );
    }
}

export default withStyles(styles)(LpuFilterPopper);
