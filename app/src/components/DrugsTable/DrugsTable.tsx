import React, { Component } from 'react';
import { createStyles, WithStyles, TableContainer, Table, Paper, TableHead, TableBody, TableRow, TableCell, Typography, Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import isEqual from 'lodash/isEqual';

const styles = (theme: any) => createStyles({
    td: {},
    th: {},
    thRow: {},
    thCell: {
        '&:last-of-type': {
            width: 100
        }
    },
    headerText: {
        transformOrigin: 'left top',
        transform: 'rotate(-30deg)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'flex',
        alignItems: 'center',
        '&::before': {
            content: '""',
            width: 10,
            height: 10,
            backgroundColor: 'red',
            marginRight: 8,
            borderRadius: 2
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
        overflow: 'visible',
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
    headers?: string[];

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
        const heights = refs.map((current: any) => current.getBoundingClientRect().height);
        const newValue = Math.max(...heights) - this.headerHeight;
        this.props.setSalesHeaderHeight(newValue);
    }

    componentDidMount() {
        this.calculateTopMargin();
    }

    componentDidUpdate(prevProps: IProps) {
        const { headers: prevHeaders } = prevProps;
        const { headers: actualHeaders } = this.props;

        const headersChanged = !isEqual(
            [...prevHeaders].sort(),
            [...actualHeaders].sort()
        );

        if (headersChanged) {
            this.headerRefs = prevHeaders.reduce(
                (refs, header) => {
                    if (actualHeaders.includes(header)) return refs;

                    const { [header]: omitted, ...rest } = refs;

                    return rest;
                },
                this.headerRefs
            );
            this.calculateTopMargin();
        }
    }

    render() {
        const {
            classes,
            headers,
            headerAppend,
            headerPrepend,
            data
        } = this.props;

        return (
            <TableContainer style={{paddingTop: this.marginTop}} component={Paper} className={classes.container} >
                <Table padding='none' className={classes.table}>
                    <TableHead className={classes.th}>
                        <TableRow className={classes.thRow}>
                            { headerPrepend }

                            {
                                headers.map(header => <TableCell key={header} className={classes.thCell}>
                                        <Grid container>
                                            <Typography variant='subtitle1' ref={el => this.headerRefs[header] = el} className={classes.headerText}>
                                                { header }
                                            </Typography>
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
