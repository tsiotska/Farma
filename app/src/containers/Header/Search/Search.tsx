import React, { Component } from 'react';
import { createStyles, WithStyles, Input, IconButton, Fade } from '@material-ui/core';
import { Search as SearchIcon, Clear } from '@material-ui/icons';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable, toJS, action, runInAction } from 'mobx';
import { ISearchResult } from '../../../interfaces/ISearchResult';
import SearchList from '../SearchList';

const styles = (theme: any) => createStyles({
    input: {
        border: '1px solid #aaa',
        borderRadius: 2,
        width: '100%',
        paddingLeft: 5
    },
    iconButton: {
        borderRadius: 2,
        padding: 6,
    }
});

interface IProps extends WithStyles<typeof styles> {
    loadSearchQuery?: (query: string, page: number) => ISearchResult[];
}

enum INPUT_STATE {
    SEARCH,
    CLEAR,
    HIDDEN
}

@inject(({
    appState: {
        departmentsStore: {
            loadSearchQuery
        }
    }
}) => ({
    loadSearchQuery
}))
@observer
class Search extends Component<IProps> {
    @observable query: string = '';
    @observable isProcessing: boolean = false;
    @observable searchResult: ISearchResult[] = null;
    @observable status: INPUT_STATE = INPUT_STATE.CLEAR;
    @observable page: number = 1;
    @observable inputRef = React.createRef<HTMLElement>();

    get suggestItems(): ISearchResult[] {
        return this.status === INPUT_STATE.HIDDEN
            ? null
            : this.searchResult;
    }

    searchClickHandler = async () => {
        const { loadSearchQuery } = this.props;
        this.isProcessing = true;
        const res = await loadSearchQuery(this.query, this.page);
        runInAction(() => {
            this.searchResult = res;
            this.isProcessing = false;
        });
    }

    changeHandler = ({ target: { value }}: any) => {
        this.query = value;
        this.searchResult = null;
        this.status = INPUT_STATE.SEARCH;
    }

    clearSearch = () => {
        this.query = '';
        this.status = INPUT_STATE.CLEAR;
        this.searchResult = null;
    }

    loadMoreHandler = async () => {
        const { loadSearchQuery } = this.props;
        this.page = this.page + 1;
        this.isProcessing = true;
        const res = await loadSearchQuery(this.query, this.page);
        runInAction(() => {
            this.searchResult = !!this.searchResult
                ? [ ...this.searchResult, ...res ]
                : res;
            this.isProcessing = false;
        });
    }

    hideList = () => {
        this.status = INPUT_STATE.HIDDEN;
    }

    enterPressHandler = ({ keyCode }: any) => {
        if (keyCode === 13) this.searchClickHandler();
    }

    focusHandler = () => {
        document.addEventListener('keypress', this.enterPressHandler);
    }

    blurHandler = () => {
        document.removeEventListener('keypress', this.enterPressHandler);
    }

    clickHandler =  (e: any) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.status = INPUT_STATE.SEARCH;
    }

    globalClickHandler = () => {
        this.status = INPUT_STATE.HIDDEN;
    }

    componentDidMount() {
        document.addEventListener('click', this.globalClickHandler);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.globalClickHandler);
    }

    render() {
        const { classes } = this.props;

        return (
            <>
                <Input
                    onClick={this.clickHandler}
                    onFocus={this.focusHandler}
                    onBlur={this.blurHandler}
                    ref={this.inputRef}
                    className={classes.input}
                    value={this.query}
                    onChange={this.changeHandler}
                    startAdornment={
                        <IconButton
                            disabled={this.isProcessing}
                            onClick={this.searchClickHandler}
                            className={classes.iconButton}>
                            <SearchIcon fontSize='small' />
                        </IconButton>
                    }
                    endAdornment={
                        <Fade in={!!this.query}>
                            <IconButton
                                disabled={this.isProcessing}
                                onClick={this.clearSearch}
                                className={classes.iconButton}>
                                <Clear fontSize='small' />
                            </IconButton>
                        </Fade>
                    }
                    disableUnderline
                />
                {
                    !!this.inputRef && !!this.inputRef.current &&
                    <SearchList
                        hideList={this.hideList}
                        anchor={this.inputRef.current}
                        items={this.suggestItems}
                        loadMoreHandler={this.loadMoreHandler}
                    />
                }
            </>
        );
    }
}

export default withStyles(styles)(Search);
