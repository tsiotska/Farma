import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, FormControlLabel, Checkbox, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { STAT_DISPLAY_MODE } from '../../stores/SalesStore';
import ExcelIcon from '../ExcelIcon';

const styles = (theme: any) => createStyles({
    root: {
        paddingLeft: 2,
        marginBottom: theme.spacing(2)
    },
    text: {
        marginRight: 8,
        color: theme.palette.primary.gray.light
    },
    label: {
        fontSize: theme.typography.pxToRem(14)
    },
    checkbox: {
        padding: 8
    },
    loadButton: {
        padding: 4,
        borderRadius: 2
    }
});

interface IProps extends WithStyles<typeof styles> {
    title?: string;
    displayMode?: STAT_DISPLAY_MODE;
    setDisplayMode?: (newMode: STAT_DISPLAY_MODE) => void;
    loadExcelHandler?: () => void;
}

@inject(({
    appState: {
        salesStore: {
            displayMode,
            setDisplayMode
        }
    }

}) => ({
    displayMode,
    setDisplayMode
}))
@observer
class SalesModeSwitch extends Component<IProps> {
    checkboxChangeHandler = (mode: STAT_DISPLAY_MODE) => () => this.props.setDisplayMode(mode);

    render() {
        const { classes, displayMode, title, loadExcelHandler } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' container>
                {
                    title &&
                    <Typography variant='body2' className={classes.text}>
                        { title }
                    </Typography>
                }

                <FormControlLabel
                    control={
                    <Checkbox
                        className={classes.checkbox}
                        color='default'
                        size='small'
                        checked={displayMode === STAT_DISPLAY_MODE.PACK}
                        onChange={this.checkboxChangeHandler(STAT_DISPLAY_MODE.PACK)}
                    />}
                    label='????????????????'
                    classes={{ label:  classes.label }}
                />
                <FormControlLabel
                    control={<Checkbox
                        className={classes.checkbox}
                        color='default'
                        size='small'
                        checked={displayMode === STAT_DISPLAY_MODE.CURRENCY}
                        onChange={this.checkboxChangeHandler(STAT_DISPLAY_MODE.CURRENCY)}
                    />}
                    label='????????????'
                    classes={{ label:  classes.label }}
                />
                {
                    loadExcelHandler &&
                    <IconButton onClick={loadExcelHandler} className={classes.loadButton}>
                        <ExcelIcon />
                    </IconButton>
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(SalesModeSwitch);
