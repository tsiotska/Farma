import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Pagination as MuiPagination } from '@material-ui/lab';
import { ILPU } from '../../../interfaces/ILPU';

interface IProps {
    className: string;

    pharmacies?: ILPU[];
    currentPage?: number;
    itemsPerPage?: number;
    setCurrentPage?: (page: number) => void;
}

@inject(({
    appState: {
        departmentsStore: {
            pharmacies,
            currentPage,
            itemsPerPage,
            setCurrentPage
        }
    }
}) => ({
    pharmacies,
    currentPage,
    itemsPerPage,
    setCurrentPage
}))
@observer
class Pagination extends Component<IProps> {
    get count(): number {
        const { pharmacies, itemsPerPage } = this.props;
        const l = pharmacies
        ? pharmacies.length
        : 0;
        return 1 + Math.floor(l / itemsPerPage);
    }

    changeHandler = (e: any, page: number) => {
        this.props.setCurrentPage(page - 1);
    }

    componentWillUnmount() {
        this.props.setCurrentPage(0);
    }

    render() {
        const { pharmacies, currentPage, className } = this.props;

        if (!pharmacies) return null;
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
