import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableContainer,
    Table,
    Paper,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Grid,
    LinearProgress,
    Typography,
    Button
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IMedicine } from '../../interfaces/IMedicine';
import HeaderItem from './HeaderItem';
import Body from './Body';
import { DisplayMode } from '../../stores/SalesStore';
import cx from 'classnames';
import { ISalesStat } from '../../interfaces/ISalesStat';

import SummaryRow from './SummaryRow';
import InfoTableRow from './InfoTableRow';

const styles = (theme: any) => createStyles({
    td: {},
    th: {},
    thRow: {},
    thCell: {
        height: 48,
        '&:first-of-type': {
            paddingLeft: 5,
            [theme.breakpoints.up('md')]: {
                width: 220,
            }
        },
        '&:last-of-type': {
            width: 100,
        },
        '&.alignBottom': {
            verticalAlign: 'bottom'
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
        marginBottom: '2vh'
    },
    retryButton: {
        marginBottom: 10
    },
    errorText: {
        margin: '10px 0'
    },
    prepend: {},
    append: {},
    body: {},

});

interface IProps extends WithStyles<typeof styles> {
    salesHeaderHeight?: number;
    setSalesHeaderHeight?: (value: number) => void;
    displayMode?: DisplayMode;
    meds?: Map<number, IMedicine>;
    medsDisplayStatus?: Map<number, boolean>;

    title: string;
    isLoading: boolean;
    salesStat: ISalesStat[];
    headerPrepend: any;
    rowPrepend: any;
    onRetry: () => void;
}

interface ISettings {
    mantisLength: number;
    propName: 'money' | 'amount';
}

@inject(({
    appState: {
        uiStore: {
            salesHeaderHeight,
            setSalesHeaderHeight,
        },
        salesStore: {
            displayMode,
            medsDisplayStatus
        },
        departmentsStore: {
            meds
        }
    }
}) => ({
    salesHeaderHeight,
    setSalesHeaderHeight,
    displayMode,
    meds,
    medsDisplayStatus
}))
@observer
class DrugsTable extends Component<IProps> {
    readonly modePressets: Record<DisplayMode, ISettings> = {
        currency: { mantisLength: 2, propName: 'money' },
        pack: { mantisLength: 0, propName: 'amount' }
    };
    readonly headerHeight: number = 20;
    headerRefs: any = {};

    get medsArray(): IMedicine[] {
        return [...this.props.meds.values()]
            .filter(({ id }) => this.props.medsDisplayStatus.get(id) === true);
    }

    get marginTop(): number {
        return this.props.salesHeaderHeight || this.headerHeight;
    }

    get modeSettings(): ISettings {
        return this.modePressets[this.props.displayMode];
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

        const medsIsChanged = prevMeds !== actualMeds
        || prevMeds.size !== actualMeds.size;

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
            medsDisplayStatus,
            salesStat,
            headerPrepend: HeaderPrepend,
            rowPrepend,
            isLoading,
            onRetry,
            title
        } = this.props;

        return (
            <TableContainer
                style={{ paddingTop: this.marginTop }}
                className={classes.container}
                component={Paper}>
                <Table padding='none' className={classes.table}>
                    <TableHead className={classes.th}>
                        <TableRow className={classes.thRow}>
                            <TableCell colSpan={2} className={classes.thCell}>
                                <HeaderPrepend value={title} />
                            </TableCell>

                            {
                                this.medsArray.map(medicine =>
                                    <TableCell key={medicine.id} className={cx(classes.thCell, { alignBottom: true })}>
                                        <Grid container>
                                            <HeaderItem medicine={medicine} componentRef={(el: any) => this.headerRefs[medicine.id] = el} />
                                        </Grid>
                                    </TableCell>
                                )
                            }

                            {
                                !!this.medsArray.length &&
                                <TableCell className={classes.thCell}>
                                    total
                                </TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.body}>
                        {
                            Array.isArray(salesStat) && salesStat.length
                            ? <>
                                <Body
                                    meds={meds}
                                    salesStat={salesStat || []}
                                    displayStatuses={medsDisplayStatus}
                                    targetProp={this.modeSettings.propName}
                                    mantisLength={this.modeSettings.mantisLength}
                                    rowPrepend={rowPrepend}
                                />
                                <SummaryRow
                                    stat={salesStat}
                                    targetProp={this.modeSettings.propName}
                                    mantisLength={this.modeSettings.mantisLength}
                                    meds={meds}
                                    displayStatus={medsDisplayStatus}
                                />
                              </>
                            : <InfoTableRow colSpan={this.medsArray.length + 3}>
                                {
                                    isLoading
                                        ? <LinearProgress />
                                        : salesStat === null
                                            ? <>
                                                <Typography className={classes.errorText} align='center'>
                                                    Не удалось получить данные
                                                </Typography>
                                                <Button
                                                    className={classes.retryButton}
                                                    onClick={onRetry}
                                                    variant='outlined'>
                                                    Повторить Запрос
                                                </Button>
                                            </>
                                            : <Typography className={classes.errorText}>
                                                Нету данных
                                            </Typography>
                                }
                              </InfoTableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default withStyles(styles)(DrugsTable);
