import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { ISearchResult } from '../../../interfaces/ISearchResult';

const styles = (theme: any) => createStyles({
    root: {
        transition: '0.3s',
        padding: 8,
        minHeight: 48,
        cursor: 'pointer',
        maxWidth: ({ maxWidth }: any) => maxWidth,
        '&:hover': {
            backgroundColor: '#f3f3f3'
        },
        // '&:not(:last-of-type)': {
        borderBottom: '1px solid #aaa',
        // }
    },
    mpText: {
        color: '#aaa',
        whiteSpace: 'nowrap',
    },
    item: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: 0,
        marginRight: 6,
    }
});

interface IProps extends WithStyles<typeof styles> {
    item: ISearchResult;
    maxWidth: number;
}

@observer
class SearchItem extends Component<IProps> {
    render() {
        const {
            classes,
            item: {
                name,
                mpName,
                lpuName,
                city,
                address
        } } = this.props;

        return (
            <Grid className={classes.root} container alignItems='flex-start'>
                <Grid className={classes.item} direction='column' xs container item  zeroMinWidth>
                    <Typography className={classes.mpText} variant='body2'>
                        МП: { mpName }
                    </Typography>
                    <Typography variant='body2'>
                        { name }
                    </Typography>
                </Grid>
                <Grid className={classes.item} xs container item zeroMinWidth>
                    <Typography variant='body2'>
                        { lpuName }
                    </Typography>
                </Grid>
                <Grid className={classes.item} xs container item zeroMinWidth>
                    <Typography variant='body2'>
                        { city }
                    </Typography>
                </Grid>
                <Grid className={classes.item} xs container item zeroMinWidth>
                    <Typography variant='body2'>
                        { address }
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(SearchItem);
