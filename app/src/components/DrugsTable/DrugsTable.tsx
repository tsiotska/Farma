import React, { Component } from 'react';
import { createStyles, WithStyles, TableContainer, Table, Paper, TableHead, TableBody, TableRow, TableCell, Typography, Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IMedicine } from '../../interfaces/IMedicine';
import HeaderItem from './HeaderItem';
import { ILocaleSalesStat } from '../../interfaces/ILocaleSalesStat';
import Body from './Body';
import { DisplayMode } from '../../stores/SalesStore';

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

    meds?: Map<number, IMedicine>;
    medsStat?: ILocaleSalesStat[];
    medsDisplayStatuses?: Map<number, boolean>;
    displayMode?: DisplayMode;

    rowPrepend?: React.Component;
    rowAppend?: React.Component;
    headerPrepend?: React.Component;
    headerAppend?: React.Component;
}

@inject(({
    appState: {
        uiStore: {
            salesHeaderHeight,
            setSalesHeaderHeight,
        },
        salesStore: {
            displayMode
        }
    }
}) => ({
    salesHeaderHeight,
    setSalesHeaderHeight,
    displayMode
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
            medsDisplayStatuses,
            medsStat,
            displayMode
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
                        <Body
                            meds={meds}
                            salesStat={medsStat}
                            displayStatuses={medsDisplayStatuses}
                            displayMode={displayMode}
                        />
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default withStyles(styles)(DrugsTable);
