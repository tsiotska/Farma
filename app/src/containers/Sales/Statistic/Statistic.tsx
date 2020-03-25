import React, { Component } from 'react';
import { createStyles, WithStyles, Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Header from './Header';
import ListHeader from './ListHeader';
import List from './List';
import { observable } from 'mobx';
import { IMedsSalesStat } from '../../../interfaces/ISalesStat';

const styles = (theme: any) => createStyles({
    root: {
        maxWidth: 350,
        maxHeight: 500,
        overflowY: 'auto',
        height: '33vw'
    },
    list: {
        overflowY: 'auto',
    }
});

interface IProps extends WithStyles<typeof styles> {
    chartSalesStat: IMedsSalesStat[];
}

@observer
class Statistic extends Component<IProps> {
    @observable scrollBarWidth: number = 0;
    ref: React.RefObject<HTMLInputElement> = React.createRef();

    updScrollbar = () => {
        if (!this.ref || !this.ref.current) return;
        const { offsetWidth, clientWidth } = this.ref.current;
        this.scrollBarWidth = offsetWidth - clientWidth;
    }

    componentDidUpdate() {
        this.updScrollbar();
    }

    componentDidMount() {
        window.addEventListener('resize', this.updScrollbar);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updScrollbar);
    }

    render() {
        const { classes, chartSalesStat } = this.props;

        return (
            <Grid className={classes.root} wrap='nowrap' direction='column' container>
                <Header />
                <ListHeader paddingRight={this.scrollBarWidth} />
                <List
                    rootRef={this.ref}
                    className={classes.list}
                    chartSalesStat={chartSalesStat} />
            </Grid>
        );
    }
}

export default withStyles(styles)(Statistic);
