import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    IconButton,
    Typography
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';

import { IMedicine } from '../../../interfaces/IMedicine';
import { Delete, Edit } from '@material-ui/icons';
import ImageLoader from '../../../components/ImageLoader';
import Config from '../../../../Config';

const styles = (theme: any) => createStyles({
    root: {
        minHeight: 86,
        backgroundColor: '#f5f5f5',
        padding: '0 10px',
        '&:nth-child(even)': {
            backgroundColor: theme.palette.primary.white
        },
        '&:first-child': {
            borderRadius: '4px 4px 0 0'
        },
        '&:last-child': {
            borderRadius: '0 0 4px 4px'
        },
        '& .MuiGrid-item': {
            minWidth: 80
        }
    },
    image: {
        width: 80,
        maxHeight: 80,
        margin: '0 10px 0 0',
    },
    bold: {
        fontFamily: 'Source Sans Pro SemiBold'
    },
    colorGreen: {
        color: theme.palette.primary.green.main
    }
});

interface IProps extends WithStyles<typeof styles> {
    medicine: IMedicine;
}

@observer
class ListItem extends Component<IProps> {
    render() {
        const {
            classes,
            medicine: {
                name,
                barcode,
                image,
                releaseForm,
                dosage,
                manufacturer,
                mark,
                price,
        } } = this.props;

        return (
            <Grid className={classes.root} wrap='nowrap' alignItems='center' container>
                <ImageLoader
                    className={classes.image}
                    loadPlaceholder={<p className={classes.image} />}
                    src={`${Config.ASSETS_URL}/${image}`}
                />

                <Grid xs container item zeroMinWidth>
                    <Typography variant='body2'>
                        { name }
                    </Typography>
                </Grid>
                <Grid xs container item zeroMinWidth>
                    <Typography variant='body2'>
                        { releaseForm }
                    </Typography>
                </Grid>
                <Grid xs container item zeroMinWidth>
                    <Typography variant='body2'>
                        { dosage }
                    </Typography>
                </Grid>
                <Grid xs container item zeroMinWidth>
                    <Typography variant='body2'>
                        { manufacturer }
                    </Typography>
                </Grid>
                <Grid xs container item zeroMinWidth>
                    <Typography variant='body2'>
                        { barcode }
                    </Typography>
                </Grid>
                <Grid xs container item zeroMinWidth>
                    <Typography className={classes.bold} variant='body2'>
                        { mark }
                    </Typography>
                </Grid>
                <Grid xs container item zeroMinWidth>
                    <Typography className={classes.bold} variant='body2'>
                        { price }
                    </Typography>
                </Grid>

                <IconButton className={classes.colorGreen}>
                    <Edit fontSize='small' />
                </IconButton>

                <IconButton>
                    <Delete fontSize='small' />
                </IconButton>
            </Grid>
        );
    }
}

export default withStyles(styles)(ListItem);
