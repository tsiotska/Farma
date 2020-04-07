import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableContainer,
    Table,
    TableBody,
    LinearProgress,
    Typography,
    Button
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IMedicine } from '../../interfaces/IMedicine';
import HeaderItem from './HeaderItem';
import Body from './Body';
import { STAT_DISPLAY_MODE } from '../../stores/SalesStore';
import cx from 'classnames';
import { ISalesStat } from '../../interfaces/ISalesStat';

import SummaryRow from './SummaryRow';
import InfoTableRow from './InfoTableRow';
import { ILocation } from '../../interfaces/ILocation';
import { IUserCommonInfo } from '../../interfaces/IUser';
import { observable, computed } from 'mobx';
import Header from './Header';

const styles = (theme: any) => createStyles({
    thCell: {
        height: 48,
        textOverflow: 'hidden',
        '&:first-of-type': {
            paddingLeft: 5,
            overflow: 'hidden',
            '& *': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
            [theme.breakpoints.up('md')]: {
                width: 220,
            }
        },
        '&:last-of-type': {
            width: 100,
            color: theme.palette.primary.gray.light
        },
        '&.alignBottom': {
            verticalAlign: 'bottom'
        },
        '&.displayNone': {
            display: 'none'
        }
    },
    table: {
        tableLayout: 'fixed'
    },
    container: {
        maxHeight: '33vw',
        transition: '0.3s',
        overflowX: 'visible',
        overflowY: 'auto'
    },
    retryButton: {
        marginBottom: 10
    },
    errorText: {
        margin: '10px 0'
    },
    body: {
        background: 'white'
    },
    marginBottom: {
        marginBottom: 40
    }
});

interface IProps extends WithStyles<typeof styles> {
    displayMode?: STAT_DISPLAY_MODE;
    currentDepartmentMeds?: IMedicine[];
    ignoredMeds?: Set<number>;

    shouldCalculateOffset?: boolean;
    ignoredItems: Set<number>;
    isLoading: boolean;
    salesStat: ISalesStat[];
    headerPrepend: any;
    rowPrepend: any;
    labelData: Map<number, ILocation | IUserCommonInfo>;
    onRetry: () => void;
}

interface ISettings {
    mantisLength: number;
    propName: 'money' | 'amount';
}

@inject(({
    appState: {
        salesStore: {
            displayMode,
            ignoredMeds
        },
        departmentsStore: {
            currentDepartmentMeds
        }
    }
}) => ({
    displayMode,
    currentDepartmentMeds,
    ignoredMeds
}))
@observer
class DrugsTable extends Component<IProps> {
    readonly modePressets: Record<STAT_DISPLAY_MODE, ISettings> = {
        [STAT_DISPLAY_MODE.CURRENCY]: { mantisLength: 2, propName: 'money' },
        [STAT_DISPLAY_MODE.PACK]: { mantisLength: 0, propName: 'amount' }
    };
    ref: any = React.createRef();
    @observable scrollBarWidth: number = 0;

    @computed
    get ignoredIds(): number[] {
        const { currentDepartmentMeds, ignoredMeds } = this.props;
        const res: number[] = [];
        currentDepartmentMeds.forEach(({ id }, i) => {
            if (ignoredMeds.has(id)) res.push(i);
        });
        return res;
    }

    @computed
    get medsArray(): IMedicine[] {
        const { currentDepartmentMeds, ignoredMeds } = this.props;
        return currentDepartmentMeds;
        // return currentDepartmentMeds.filter(({ id }) => ignoredMeds.has(id) === false);
    }

    @computed
    get modeSettings(): ISettings {
        return this.modePressets[this.props.displayMode];
    }

    updScrollbar = () => {
        if (!this.ref || !this.ref.current) return;
        const { offsetWidth, clientWidth } = this.ref.current;
        this.scrollBarWidth = offsetWidth - clientWidth;
    }

    componentDidMount() {
        window.addEventListener('resize', this.updScrollbar);
    }

    componentDidUpdate(prevProps: IProps) {
        this.updScrollbar();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updScrollbar);
    }

    render() {
        const {
            classes,
            salesStat,
            headerPrepend,
            rowPrepend,
            isLoading,
            onRetry,
            labelData,
            ignoredItems,
            shouldCalculateOffset
        } = this.props;

        return (
            <>
            {/* hack to make table head sticky */}
            <Header
                headerPrepend={headerPrepend}
                medsArray={this.medsArray}
                ignoredMeds={this.ignoredIds}
                shouldCalculateHeight={shouldCalculateOffset}
                classes={{
                    container: classes.container,
                    table: classes.table,
                    thCell: classes.thCell
                }}
            />
            <TableContainer ref={this.ref} className={cx(classes.container, classes.marginBottom)}>
                <Table padding='none' className={classes.table}>
                    <TableBody className={classes.body}>
                        {
                            Array.isArray(salesStat) && salesStat.length
                            ? <>
                                <Body
                                    meds={this.medsArray}
                                    ignoredMeds={this.ignoredIds}
                                    labelData={labelData}
                                    salesStat={salesStat || []}
                                    targetProp={this.modeSettings.propName}
                                    mantisLength={this.modeSettings.mantisLength}
                                    scrollBarWidth={this.scrollBarWidth}
                                    rowPrepend={rowPrepend}
                                    ignoredItems={ignoredItems}
                                />
                                <SummaryRow
                                    stat={salesStat}
                                    ignoredItems={ignoredItems}
                                    ignoredMeds={this.ignoredIds}
                                    targetProp={this.modeSettings.propName}
                                    mantisLength={this.modeSettings.mantisLength}
                                    meds={this.medsArray}
                                />
                              </>
                            : <InfoTableRow colSpan={this.medsArray.length + 3}>
                                {
                                    isLoading
                                        ? <LinearProgress />
                                        : salesStat === null
                                            ? <>
                                                <Typography className={classes.errorText} align='center'>
                                                    Не вдалося отримати дані
                                                </Typography>
                                                <Button
                                                    className={classes.retryButton}
                                                    onClick={onRetry}
                                                    variant='outlined'>
                                                    Повторити запит
                                                </Button>
                                            </>
                                            : <Typography className={classes.errorText}>
                                                Дані відсутні
                                            </Typography>
                                }
                              </InfoTableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            </>
        );
    }
}

export default withStyles(styles)(DrugsTable);
