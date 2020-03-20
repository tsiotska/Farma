import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IWorker } from '../../../interfaces/IWorker';
import ListItem from '../ListItem';
import { IPosition } from '../../../interfaces/IPosition';

const styles = (theme: any) => createStyles({
    header: {
        color: theme.palette.primary.gray.light,
        margin: '20px 0 10px',
        paddingLeft: ({ fired }: any) => fired ? 0 : 34,
        '& > *:last-of-type': {
            marginRight: ({ fired }: any) => fired ? 0 : 88
        },
        '& p': {
            fontFamily: 'Source Sans Pro SemiBold',
            paddingRight: 5,
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        }
    },
});

interface IProps extends WithStyles<typeof styles> {
    workers: IWorker[];
    fired?: boolean;
    positions: Map<number, IPosition>;
}

@observer
class List extends Component<IProps> {
    render() {
        const {
            classes,
            workers,
            positions,
            fired
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
                            position={positions.get(x.position)}
                            fired={fired}
                        />
                    ))
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(List);
