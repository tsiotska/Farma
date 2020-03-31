import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Grid
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import HeaderItem from '../HeaderItem';
import { IMedicine } from '../../../interfaces/IMedicine';
import differenceBy from 'lodash/differenceBy';
import ommitBy from 'lodash/omitBy';
import cx from 'classnames';

const styles = createStyles({
    container: {},
    table: {},
    thCell: {},
});

interface IProps extends WithStyles<typeof styles> {
    headerPrepend: any;
    medsArray: IMedicine[];
    shouldCalculateHeight?: boolean;

    salesHeaderHeight?: number;
    setSalesHeaderHeight?: (value: number) => void;
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
class Header extends Component<IProps> {
    readonly headerHeight: number = 20;
    headerRefs: any = {};
    calculateTopMargin: () => void;

    constructor(props: IProps) {
        super(props);
        if (props.shouldCalculateHeight) {
            this.headerRefs = {};
            this.calculateTopMargin = () => {
                const refs = [...Object.values(this.headerRefs)];
                const heights = refs.map((current: any) => current && current.getBoundingClientRect().height);
                const newValue = Math.max(...heights);
                this.props.setSalesHeaderHeight(newValue - 48);
            };
        }
    }

    get marginTop(): number {
        return this.props.salesHeaderHeight || this.headerHeight;
    }

    get showTotal(): boolean {
        return !!this.props.medsArray.length;
    }

    componentDidMount() {
        if (this.props.shouldCalculateHeight) this.calculateTopMargin();
    }

    componentDidUpdate(prevProps: IProps) {
        const { medsArray: prevMeds } = prevProps;
        const { medsArray: actualMeds, shouldCalculateHeight } = this.props;

        if (!shouldCalculateHeight) return;

        if (prevMeds !== actualMeds) {
            const removedMeds = differenceBy(prevMeds, actualMeds, 'id')
                .map(({ id }: IMedicine) => `${id}`);
            this.headerRefs = ommitBy(
                this.headerRefs,
                (value, key) => removedMeds.includes(key)
            );
        }
        this.calculateTopMargin();
    }

    getContent = () => {
        const { classes, medsArray, shouldCalculateHeight } = this.props;
        return medsArray.map(medicine => (
            <TableCell key={medicine.id} className={cx(classes.thCell, { alignBottom: true })}>
                <Grid container>
                    <HeaderItem
                        medicine={medicine}
                        componentRef={
                            shouldCalculateHeight
                            ? (el: any) => this.headerRefs[medicine.id] = el
                            : null
                        }
                    />
                </Grid>
            </TableCell>
        ));
    }

    render() {
        const { classes, headerPrepend } = this.props;
        return(
            <TableContainer
                style={{ paddingTop: this.marginTop }}
                className={classes.container}>
                <Table padding='none' className={classes.table}>
                <TableHead>
                    <TableRow >
                            <TableCell colSpan={2} className={classes.thCell}>
                                { headerPrepend }
                            </TableCell>

                            { this.getContent() }

                            {
                                this.showTotal &&
                                <TableCell className={classes.thCell}>
                                    Сума
                                </TableCell>
                            }
                        </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
        );
    }
}

export default Header;
