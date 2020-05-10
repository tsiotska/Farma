import React, { Component, RefObject } from 'react';
import { createStyles, WithStyles, Popper, Typography, Paper, Button } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { ISearchResult } from '../../../interfaces/ISearchResult';
import SearchItem from '../SearchItem';
import { computed } from 'mobx';

const styles = (theme: any) => createStyles({
    root: {
        zIndex: 1100
    },
    paper: {
        maxHeight: '30vh',
        overflow: 'hidden auto',
        padding: '10px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    loadButton: {
        marginTop: 16,
        marginBottom: 10
    }
});

interface IProps extends WithStyles<typeof styles> {
    anchor: HTMLElement;
    items: ISearchResult[];
    loadMoreHandler: () => void;
}

@observer
class SearchList extends Component<IProps> {
    readonly maxCount: number = 50;

    @computed
    get anchorWidth(): number {
        return this.props.anchor.offsetWidth;
    }

    @computed
    get paperWidth(): { width: number } {
        return { width: this.anchorWidth };
    }

    get shouldDisplayData(): boolean {
        const { items } = this.props;
        return !!items && items.length > 0;
    }

    get hasNoData(): boolean {
        const { items } = this.props;
        return !items || !items.length;
    }

    clickHandler = (e: any) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    render() {
        const { items, anchor, classes, loadMoreHandler } = this.props;

        return (
            <Popper
                onClick={this.clickHandler}
                className={classes.root}
                open={items !== null}
                anchorEl={anchor}>
                    <Paper className={classes.paper} style={this.paperWidth}>
                        <div>
                            {
                                this.shouldDisplayData &&
                                items.map(x => (
                                    <SearchItem
                                        key={`${x.id}${x.mp}`}
                                        maxWidth={this.anchorWidth}
                                        item={x}
                                    />
                                ))
                            }
                        </div>
                        {
                            this.hasNoData &&
                            <Typography>
                                За вашим пошуком нічого не знайдено
                            </Typography>
                        }
                        {
                            this.shouldDisplayData && items.length % this.maxCount === 0 &&
                            <Button onClick={loadMoreHandler} className={classes.loadButton} variant='contained' color='primary'>
                                Завантажити ще лікарів...
                            </Button>
                        }
                    </Paper>
            </Popper>
        );
    }
}

export default withStyles(styles)(SearchList);
