import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { DisplayMode } from '../../../../stores/SalesStore';

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
    }
});

interface IProps extends WithStyles<typeof styles> {
    displayMode?: DisplayMode;
    setDisplayMode?: (newMode: DisplayMode) => void;
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
class Header extends Component<IProps> {
    checkboxChangeHandler = (mode: DisplayMode) => () => this.props.setDisplayMode(mode);

    render() {
        const { classes, displayMode } = this.props;

        return (
            <Grid className={classes.root} alignItems='center' container>
                <Typography variant='body2' className={classes.text}>
                    Зміни:
                </Typography>
                <FormControlLabel
                    control={
                    <Checkbox
                        className={classes.checkbox}
                        color='default'
                        size='small'
                        checked={displayMode === 'pack'}
                        onChange={this.checkboxChangeHandler('pack')}
                    />}
                    label='Упаковки'
                    classes={{ label:  classes.label }}
                />
                <FormControlLabel
                    control={<Checkbox
                        className={classes.checkbox}
                        color='default'
                        size='small'
                        checked={displayMode === 'currency'}
                        onChange={this.checkboxChangeHandler('currency')}
                    />}
                    label='Гривні'
                    classes={{ label:  classes.label }}
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(Header);
