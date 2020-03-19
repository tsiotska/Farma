import React, { Component } from 'react';
import { createStyles, WithStyles, TableContainer, Table, Paper, TableHead, TableBody, TableRow, TableCell, Typography, Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IMedicine } from '../../interfaces/IMedicine';
import HeaderItem from './HeaderItem';

const styles = (theme: any) => createStyles({
    td: {},
    th: {},
    thRow: {},
    thCell: {
        '&:last-of-type': {
            width: 100
        }
    },
    tr: {},
    cell: {
        paddingLeft: 5,
        '&:last-of-type': {
            backgroundColor: 'red'
        }
    },
    table: {
        tableLayout: 'fixed'
    },
    container: {
        // overflow: 'visible',
        overflowY: 'hidden',
        transition: '0.3s',
    },
    prepend: {},
    append: {},
    body: {}
});

interface IProps extends WithStyles<typeof styles> {
    salesHeaderHeight?: number;
    setSalesHeaderHeight?: (value: number) => void;

    data?: any[][];
    meds?: Map<number, IMedicine>;
    medsDisplayStatuses?: Map<number, boolean>;

    rowPrepend?: React.Component;
    rowAppend?: React.Component;
    headerPrepend?: React.Component;
    headerAppend?: React.Component;
}

@inject(({
    appState: {
        uiStore: {
            salesHeaderHeight,
            setSalesHeaderHeight
        }
    }
}) => ({
    salesHeaderHeight,
    setSalesHeaderHeight
}))
@observer
class DrugsTable extends Component<IProps> {
    readonly headerHeight: number = 20;
    headerRefs: any = {};

    get marginTop(): number {
        return this.props.salesHeaderHeight || this.headerHeight;
    }

    calculateTopMargin = () => {
        const refs = [...Object.values(this.headerRefs)];
        const heights = refs.map((current: any) => current && current.getBoundingClientRect().height);
        const newValue = Math.max(...heights);
        this.props.setSalesHeaderHeight(newValue);
    }

    componentDidMount() {
        this.calculateTopMargin();
    }

    componentDidUpdate(prevProps: IProps) {
        const { meds: prevMeds } = prevProps;
        const { meds: actualMeds } = this.props;

        const medsIsChanged = prevMeds !== actualMeds || prevMeds.size !== actualMeds.size;

        if (medsIsChanged) {
            this.headerRefs = [...prevMeds.values()].reduce(
                (refs, meds) => {
                    if (actualMeds.has(meds.id)) return refs;
                    const { [meds.id]: omitted, ...rest } = refs;
                    return rest;
                },
                this.headerRefs
            );
        }

        this.calculateTopMargin();
    }

    render() {
        const {
            classes,
            meds,
            headerAppend,
            headerPrepend,
            data,
            medsDisplayStatuses
        } = this.props;

        return (
            <TableContainer style={{paddingTop: this.marginTop}} component={Paper} className={classes.container} >
                <Table padding='none' className={classes.table}>
                    <TableHead className={classes.th}>
                        <TableRow className={classes.thRow}>
                            { headerPrepend }

                            {
                                [...meds.values()].map(medicine =>
                                    medsDisplayStatuses.get(medicine.id) &&
                                    <TableCell key={medicine.id} className={classes.thCell}>
                                        <Grid container>
                                            <HeaderItem medicine={medicine} componentRef={(el: any) => this.headerRefs[medicine.id] = el} />
                                        </Grid>
                                    </TableCell>
                                )
                            }

                            <TableCell className={classes.thCell}>
                                total
                            </TableCell>

                            { headerAppend }
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.body}>
                        {
                            data.map((rowValues, ind) => {
                                let total: number = 0;

                                const cells = rowValues.map((value, i) => {
                                    total += value;
                                    return (
                                        <TableCell key={`${i}${value}`} className={classes.cell}>
                                            { value }
                                        </TableCell>
                                    );
                                });

                                return (
                                    <TableRow key={ind} className={classes.tr}>
                                        { cells }
                                        <TableCell className={classes.cell}>
                                            { total }
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default withStyles(styles)(DrugsTable);
