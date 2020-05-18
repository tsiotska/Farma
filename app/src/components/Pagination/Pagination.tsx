import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Pagination as MuiPagination } from '@material-ui/lab';
import { createStyles } from '@material-ui/core';

interface IProps {
    className: string;
    dataLength: number;
    currentPage: number;
    itemsPerPage: number;
    setCurrentPage: (page: number) => void;
}

@observer
class Pagination extends Component<IProps> {
    get count(): number {
        const { dataLength, itemsPerPage } = this.props;
        const length = dataLength || 0;
        return 1 + Math.floor(length / itemsPerPage);
    }

    changeHandler = (e: any, page: number) => {
        this.props.setCurrentPage(page - 1);
    }

    render() {
        const { dataLength, currentPage, className } = this.props;

        if (dataLength === null) return null;
        return (
            <MuiPagination
                classes={{ root: className }}
                onChange={this.changeHandler}
                count={this.count}
                page={currentPage + 1}
                shape='rounded'
            />
        );
    }
}

export default Pagination;
