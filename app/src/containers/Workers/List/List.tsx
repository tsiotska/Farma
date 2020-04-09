import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IWorker } from '../../../interfaces/IWorker';
import ListItem from '../ListItem';
import { IPosition } from '../../../interfaces/IPosition';
import Sublist from '../Sublist';
import { IExpandedWorker } from '../../../stores/DepartmentsStore';
import { USER_ROLE } from '../../../constants/Roles';
import { toJS } from 'mobx';

const styles = (theme: any) => createStyles({
    header: {
        color: theme.palette.primary.gray.light,
        margin: '24px 0 10px',
        paddingLeft: ({ fired }: any) => fired ? 0 : 32,
        '& p': {
            fontFamily: 'Source Sans Pro SemiBold',
            paddingLeft: 5,
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        }
    },
    actionContainer: {
        width: 88
    },
    withPadding: {
        paddingLeft: 41
    }
});

interface IProps extends WithStyles<typeof styles> {
    workers: IWorker[];
    fired: boolean;
    positions: Map<number, IPosition>;
    expandable: boolean;
    headerAppend?: any;

    expandedWorker?: IExpandedWorker;
    setExpandedWorker?: (workerId: number | null) => void;
    role?: USER_ROLE;
}

@inject(({
    appState: {
        departmentsStore: {
            expandedWorker,
            setExpandedWorker
        },
        userStore: {
            role
        }
    }
}) => ({
    expandedWorker,
    setExpandedWorker,
    role
}))
@observer
class List extends Component<IProps> {
    get locationHeader(): string {
        const { fired, role } = this.props;

        if (fired) {
            return role === USER_ROLE.REGIONAL_MANAGER
                ? 'Місто'
                : 'Регіон';
        }
        return 'Посада';
    }

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
            expandedWorker,
            headerAppend
        } = this.props;

        return (
            <Grid direction='column' container>
                <Grid className={classes.header} alignItems='center' container>
                    <Grid xs={3} className={classes.withPadding} item zeroMinWidth>
                        {
                            fired !== true &&
                            <Typography variant='body2'>
                                Регіональні менеджери
                            </Typography>
                        }
                    </Grid>
                    <Grid xs item zeroMinWidth>
                        <Typography variant='body2'>
                            { this.locationHeader }
                        </Typography>
                    </Grid>
                    <Grid
                        xs={
                            fired
                                ? 2
                                : true
                            }
                        zeroMinWidth
                        item>
                        <Typography variant='body2'>
                            {
                                fired
                                    ? 'Початок-завершеня роботи'
                                    : 'Початок роботи'
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
                            № карти
                        </Typography>
                    </Grid>
                    <div className={classes.actionContainer}>
                        { headerAppend }
                    </div>
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
