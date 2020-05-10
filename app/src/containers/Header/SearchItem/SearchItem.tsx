import React, { Component } from 'react';
import { createStyles, WithStyles, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { ISearchResult } from '../../../interfaces/ISearchResult';

const styles = (theme: any) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
    item: ISearchResult;
}

@observer
class SearchItem extends Component<IProps> {
    render() {
        const { item: { name }} = this.props;
        return (
            <Typography>
                { name }
            </Typography>
        );
    }
}

export default withStyles(styles)(SearchItem);
