import React, { Component } from 'react';
import {
    WithStyles,
    TableCell,
    Grid,
    Tooltip,
    Divider
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { IMark } from '../../../interfaces/IBonusInfo';
import { observable } from 'mobx';

const styles = {
    cell: {},
    tooltip: {},
    divider: {},
    span: {}
};

interface IProps extends WithStyles<typeof styles> {
    mark: IMark;
    tooltip: string;
}

@observer
class HoverableCell extends Component<IProps> {
    @observable openTooltip: boolean = false;

    onHover = () => {
        this.openTooltip = true;
    }

    onMouseLeave = () => {
        this.openTooltip = false;
    }

    render() {
        const { classes, mark, tooltip } = this.props;

        return (
            <TableCell className={classes.cell}>
                <Grid
                    onMouseOver={this.onHover}
                    onMouseLeave={this.onMouseLeave}
                    direction='column'
                    alignItems='center'
                    container>
                    <span className={classes.span}>
                        {
                            mark
                            ? mark.payments
                            : 0
                        }
                    </span>
                    <Tooltip
                        arrow
                        open={this.openTooltip}
                        placement='right'
                        title={tooltip}
                        TransitionProps={{
                            timeout: this.openTooltip
                            ? 300
                            : 0
                        }}
                        classes={{ tooltip: classes.tooltip }}>
                        <Divider className={classes.divider} />
                    </Tooltip>
                    <span className={classes.span}>
                        {
                            mark
                            ? mark.deposit
                            : 0
                        }
                    </span>
                </Grid>
            </TableCell>
        );
    }
}

export default HoverableCell;
