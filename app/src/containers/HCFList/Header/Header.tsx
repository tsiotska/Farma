import React, { Component } from 'react';
import { WithStyles, createStyles, Grid, Typography, withStyles, IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { gridStyles } from '../gridStyles';
import { FilterList } from '@material-ui/icons';
import { observable } from 'mobx';
import LpuFilterPopper from '../../../components/LpuFilterPopper';
import { SortableProps } from '../../../components/LpuFilterPopper/LpuFilterPopper';

const styles = (theme: any) => createStyles({
    ...gridStyles(theme),
    root: {
        marginBottom: 12
    },
    text: {
        fontFamily: 'Source Sans Pro SemiBold',
        color: theme.palette.primary.gray.light
    },
    iconButton: {
        padding: 4,
        borderRadius: 2,
        marginLeft: 5
    }
});

interface IProps extends WithStyles<typeof styles> {}

@observer
class Header extends Component<IProps> {
    @observable filterPopperAnchor: HTMLElement = null;
    @observable propName: SortableProps = null;

    popoverCloseHandler = () => {
        this.filterPopperAnchor = null;
        this.propName = null;
    }

    buttonClickHandler = (propName: SortableProps) => ({ target }: any) => {
        this.filterPopperAnchor = target;
        this.propName = propName;
    }

    render() {
        const { classes } = this.props;

        return (
            <>
            <Grid className={classes.root} container alignItems='center'>
                <Grid className={cx(classes.cell, classes.name)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Назва
                        <IconButton
                            onClick={this.buttonClickHandler('name')}
                            className={classes.iconButton}>
                            <FilterList fontSize='small' />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.region)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Регіон
                        <IconButton
                            disabled
                            onClick={this.buttonClickHandler('region')}
                            className={classes.iconButton}>
                            <FilterList fontSize='small' />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.oblast)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Область
                        <IconButton
                            onClick={this.buttonClickHandler('oblast')}
                            className={classes.iconButton}>
                            <FilterList fontSize='small' />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.city)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Місто
                        <IconButton
                            disabled
                            onClick={this.buttonClickHandler('city')}
                            className={classes.iconButton}>
                            <FilterList fontSize='small' />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.address)} xs alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Адрес
                    </Typography>
                </Grid>
                <Grid className={cx(classes.cell, classes.phone)} xs={1} alignItems='center' container item>
                    <Typography className={classes.text} variant='body2'>
                        Телефон
                    </Typography>
                </Grid>
            </Grid>
            <LpuFilterPopper
                onClose={this.popoverCloseHandler}
                anchor={this.filterPopperAnchor}
                propName={this.propName} />
            </>
        );
    }
}

export default withStyles(styles)(Header);
