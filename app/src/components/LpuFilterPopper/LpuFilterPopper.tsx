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
    IconButton,
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import cx from 'classnames';
import { SORT_ORDER } from '../../stores/UIStore';
import { ILPU } from '../../interfaces/ILPU';
import LoadingMask from '../LoadingMask';
import { Search } from '@material-ui/icons';
import SuggestList from './SuggestList';

const styles = (theme: any) => createStyles({
    input: {
        border: '1px solid #aaa',
        borderRadius: 2,
        padding: '0 0 0 8px'
    },
    container: {
        padding: 12
    },
    divider: {
        margin: '10px 0'
    },
    button: {
        marginTop: 10,
        border: '1px solid transparent',
        '&.active': {
            borderColor: '#aaa'
        }
    },
    iconButton: {
        padding: 6,
        borderRadius: 2
    },
    placeholder: {
        marginTop: 12
    },
    discardButton: {
        color: '#36A0F4',
        width: '100%'
    },
    applyButton: {
        backgroundColor: '#647CFE',
        color: 'white',
        width: '100%',
        '&:hover': {
            backgroundColor: '#7a8fff',
        }
    },
    buttonGroup: {
        padding: 10,
        marginTop: 10
    }
});

export type LPUSortableProps = 'regionName' | 'name' | 'oblast' | 'city';

interface IProps extends WithStyles<typeof styles> {
    toggleAll: () => void;
    propName: LPUSortableProps;
    anchor: HTMLElement;
    onClose: () => void;
    isLoading: boolean;

    order: SORT_ORDER;
    onOrderChange: (order: SORT_ORDER) => void;

    searchString: string;
    onSearchStringChange: (e: any) => void;
    applySearch: () => void;

    totalLength: number;
    suggestions: Array<{ id: number, value: string}>;
    ignoredItems: Array<{ id: number, value: string}>;
    itemClickHandler: (lpu: ILPU) => void;

    applyClickHandler: () => void;
}

@observer
class LpuFilterPopper extends Component<IProps> {
    readonly wrapperClasses: any;
    readonly anchorOrigin: any = {
        vertical: 'bottom',
        horizontal: 'center',
    };
    readonly transformOrigin: any = {
        vertical: 'top',
        horizontal: 'center',
    };
    readonly titles: Record<LPUSortableProps, string> = {
        'regionName': 'Регіон',
        'name': 'Назва',
        'oblast': 'Область',
        'city': 'Місто',
    };
    constructor(props: IProps) {
        super(props);
        this.wrapperClasses = { wrapper: props.classes.placeholder };
    }

    get title(): string {
        const { propName } = this.props;
        return this.titles[propName];
    }

    sortAtoZ = () => this.props.onOrderChange(SORT_ORDER.ASCENDING);

    sortZtoA = () => this.props.onOrderChange(SORT_ORDER.DESCENDING);

    render() {
        const {
            classes,
            anchor,
            onClose,
            isLoading,
            order,
            searchString,
            onSearchStringChange,
            applySearch,
            applyClickHandler,
            suggestions,
            itemClickHandler,
            ignoredItems,
            toggleAll
        } = this.props;

        return (
            <Popover
                anchorOrigin={this.anchorOrigin}
                transformOrigin={this.transformOrigin}
                onClose={onClose}
                anchorEl={anchor}
                open={!!anchor}>
                    <Grid className={classes.container} container direction='column'>
                        <Button
                            className={cx(classes.button, { active: order === SORT_ORDER.ASCENDING} )}
                            onClick={this.sortAtoZ}>
                                Сортувати від А до Я
                            </Button>
                        <Button
                            className={cx(classes.button, { active: order === SORT_ORDER.DESCENDING} )}
                            onClick={this.sortZtoA}>
                                Сортувати від Я до А
                            </Button>
                        <Divider className={classes.divider} />
                        <Input
                            disableUnderline
                            className={classes.input}
                            onChange={onSearchStringChange}
                            value={searchString}
                            endAdornment={
                                <IconButton
                                    onClick={applySearch}
                                    className={classes.iconButton} >
                                    <Search fontSize='small' />
                                </IconButton>
                            }
                        />
                        {
                            (!!suggestions && suggestions.length)
                            ? <SuggestList
                                title={this.title}
                                items={suggestions}
                                itemClickHandler={itemClickHandler}
                                renderPropName='value'
                                ignoredItems={ignoredItems}
                                isLoading={isLoading}
                                toggleAll={toggleAll}
                              />
                            : isLoading
                                ? <LoadingMask classes={this.wrapperClasses} size={20} />
                                : <Typography>
                                    {
                                        !!suggestions
                                            ? 'Відповідні дані відсутні'
                                            : 'Дані відсутні'
                                    }
                                </Typography>
                        }
                        <Grid className={classes.buttonGroup} container wrap='nowrap' alignItems='center'>
                            <Button onClick={onClose} className={classes.discardButton}>
                                Відмінити
                            </Button>
                            <Button onClick={applyClickHandler} className={classes.applyButton}>
                                Застосувати
                            </Button>
                        </Grid>
                    </Grid>
            </Popover>
        );
    }
}

export default withStyles(styles)(LpuFilterPopper);
