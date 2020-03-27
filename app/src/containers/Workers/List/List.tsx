import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IWorker } from '../../../interfaces/IWorker';
import ListItem from '../ListItem';
import { IPosition } from '../../../interfaces/IPosition';
import Sublist from '../Sublist';
import { observable } from 'mobx';
import { IExpandedWorker } from '../../../stores/DepartmentsStore';

const styles = (theme: any) => createStyles({
    header: {
        color: theme.palette.primary.gray.light,
        margin: '24px 0 10px',
        paddingLeft: ({ fired }: any) => fired
            ? 0
            : 34,
        '& > *:last-of-type': {
            marginRight: ({ fired }: any) => fired
                ? 0
                : 90
        },
        '& p': {
            fontFamily: 'Source Sans Pro SemiBold',
            paddingLeft: 5,
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        }
    },
});

interface IProps extends WithStyles<typeof styles> {
    workers: IWorker[];
    fired: boolean;
    positions: Map<number, IPosition>;
    expandable: boolean;

    expandedWorker?: IExpandedWorker;
    setExpandedWorker?: (workerId: number | null) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            expandedWorker,
            setExpandedWorker
        }
    }
}) => ({
    expandedWorker,
    setExpandedWorker
}))
@observer
class List extends Component<IProps> {
    expandChangeHandler = (workerId: number) => (event: any, expanded: boolean) => {
        const { setExpandedWorker, expandable } = this.props;
        if (expandable === false) return;
        setExpandedWorker(
            expanded
                ? workerId
                : null
        );
    }

    render() {
        const {
            classes,
            workers,
            positions,
            fired,
            expandable,
            expandedWorker
        } = this.props;

        return (
            <Grid direction='column' container>
                <Grid className={classes.header} alignItems='center' container>
                    <Grid xs={3} item zeroMinWidth>
                        {
                            fired !== true &&
                            <Typography variant='body2'>
                                Региональные менеджеры
                            </Typography>
                        }
                    </Grid>
                    <Grid xs item zeroMinWidth>
                        <Typography variant='body2'>
                            {
                                fired
                                    ? 'Регион'
                                    : 'Должность'
                            }
                        </Typography>
                    </Grid>
                    <Grid
                        xs={fired ? 2 : true}
                        zeroMinWidth
                        item>
                        <Typography variant='body2'>
                            {
                                fired
                                    ? 'Начало-завершение роботы'
                                    : 'Начало роботы'
                            }

                        </Typography>
                    </Grid>
                    <Grid xs item zeroMinWidth>
                        <Typography variant='body2'>
                            Email
                        </Typography>
                    </Grid>
                    <Grid xs item zeroMinWidth>
                        <Typography variant='body2'>
                            Телефон
                        </Typography>
                    </Grid>
                    <Grid xs item zeroMinWidth>
                        <Typography variant='body2'>
                            № карты
                        </Typography>
                    </Grid>
                </Grid>

                {
                    workers.map(x => (
                        <ListItem
                            key={x.id}
                            worker={x}
                            fired={fired}
                            expandable={expandable}
                            isExpanded={
                                expandedWorker
                                ? expandedWorker.id === x.id
                                : false
                            }
                            expandChangeHandler={this.expandChangeHandler(x.id)}
                            position={positions.get(x.position)}
                            children={expandable && <Sublist rmId={x.id} positions={positions} />}
                        />
                    ))
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(List);
