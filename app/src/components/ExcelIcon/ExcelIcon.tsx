import React, { Component } from 'react';
import { createStyles, WithStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Icon from '-!react-svg-loader!../../../assets/icons/excel.svg';

const styles = (theme: any) => createStyles({
    root: {
        fill: '#7F888C'
    }
});

interface IProps extends WithStyles<typeof styles>, Omit<React.SVGProps<any>, 'width' | 'height'> {
    size?: number;
}

@observer
class ExcelIcon extends Component<IProps> {
    readonly defaultSize: number = 24;

    render() {
        const { classes, size, ...props } = this.props;

        const width = size || this.defaultSize;
        const height = size || this.defaultSize;

        return (
            <Icon
                width={width}
                height={height}
                className={classes.root}
                {...props}
            />
        );
    }
}

export default withStyles(styles)(ExcelIcon);
