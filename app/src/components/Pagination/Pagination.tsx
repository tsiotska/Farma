import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Pagination as MuiPagination } from '@material-ui/lab';
import { ILPU } from '../../interfaces/ILPU';

interface IProps {
    className?: string;
    data?: ILPU[];

    currentPage?: number;
    itemsPerPage?: number;
    setCurrentPage?: (page: number) => void;
}

@inject(({
    appState: {
        uiStore: {
            currentPage,
            itemsPerPage,
            setCurrentPage
        }
    }
}) => ({
    currentPage,
    itemsPerPage,
    setCurrentPage
}))
@observer
class Pagination extends Component<IProps> {
    get count(): number {
        const { data, itemsPerPage } = this.props;
        const l = data
        ? data.length
        : 0;
        return 1 + Math.floor(l / itemsPerPage);
    }

    changeHandler = (e: any, page: number) => {
        this.props.setCurrentPage(page - 1);
    }

    render() {
        const { data, currentPage, className } = this.props;

        if (!data) return null;
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
