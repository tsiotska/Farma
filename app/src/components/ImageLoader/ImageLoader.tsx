import React, { Component, ImgHTMLAttributes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    invisible: {
        display: 'none'
    }
});

interface IProps extends WithStyles<typeof styles>, ImgHTMLAttributes<HTMLImageElement> {
    className: string;
    loadPlaceholder?: JSX.Element;
}

@observer
class ImageLoader extends Component<IProps> {
    @observable imageLoaded: boolean = false;

    imageLoadHandler = () => {
        this.imageLoaded = true;
    }

    render(): any {
        const {
            className,
            loadPlaceholder,
            classes,
            ...imageProps
        } = this.props;

        return <>
            <img
                className={cx(className, { [classes.invisible]: !this.imageLoaded })}
                onLoad={this.imageLoadHandler}
                {...imageProps}
            />
            {
                (!this.imageLoaded && loadPlaceholder)
                ? loadPlaceholder
                : null
            }
        </>;
    }
}

export default withStyles(styles)(ImageLoader);