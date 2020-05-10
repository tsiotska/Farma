import React, { Component, RefObject } from 'react';
import { createStyles, WithStyles, Popper, Typography, Paper } from '@material-ui/core';
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
        overflowY: 'auto'
    }
});

interface IProps extends WithStyles<typeof styles> {
    anchor: HTMLElement;
    // anchor: HTMLElement | RefObject<HTMLElement>;
    items: ISearchResult[];
}

@observer
class SearchList extends Component<IProps> {
    @computed
    get paperWidth(): { width: number } {
        const { anchor } = this.props;
        return { width: anchor.offsetWidth };
    }

    get shouldDisplayData(): boolean {
        const { items } = this.props;
        return !!items && items.length > 0;
    }

    get hasNoData(): boolean {
        const { items } = this.props;
        return !items || !items.length;
    }

    render() {
        const { items, anchor, classes } = this.props;

        return (
            <Popper
                className={classes.root}
                open={items !== null}
                anchorEl={anchor}>
                    <Paper className={classes.paper} style={this.paperWidth}>
                        {
                            this.shouldDisplayData &&
                            items.map(x => (
                                <SearchItem key={`${x.id}${x.mp}`} item={x} />
                            ))
                        }
                        {
                            this.hasNoData &&
                            <Typography>
                                За вашим пошуком нічого не знайдено
                            </Typography>
                        }
                    </Paper>
            </Popper>
        );
    }
}

export default withStyles(styles)(SearchList);
