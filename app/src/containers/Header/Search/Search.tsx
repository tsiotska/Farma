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
    CLEAR
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
    readonly mockItems: ISearchResult[] = [
        {
            address: 'просп. Перемоги (30-річчя Перемоги), 2',
            city: 'г. Кривой Рог',
            ffm: 2,
            id: 8587,
            lpuName: 'Криворізька міська клінічна лікарня №2 КЗ ДОР',
            mp: 184,
            mpName: 'Вакансия Кривой Рог (Шумакова) ',
            name: '. Вікторія Олексіївна',
            rm: 17,
        }
    ];
    @observable query: string = '';
    @observable isProcessing: boolean = false;
    @observable searchResult: ISearchResult[] = [...this.mockItems];
    // @observable searchResult: ISearchResult[] = null;
    @observable status: INPUT_STATE = INPUT_STATE.CLEAR;
    @observable page: number = 1;
    @observable inputRef = React.createRef<HTMLElement>();

    searchClickHandler = async () => {
        const { loadSearchQuery } = this.props;
        this.isProcessing = true;
        const res =  await loadSearchQuery(this.query, this.page);
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

    render() {
        const { classes } = this.props;
        // console.log(this.inputRef, this.inputRef.current);
        console.log(toJS(this.isProcessing), toJS(this.searchResult));
        return (
            <>
                <Input
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
                        anchor={this.inputRef.current}
                        items={this.searchResult}
                    />
                }
            </>
        );
    }
}

export default withStyles(styles)(Search);
