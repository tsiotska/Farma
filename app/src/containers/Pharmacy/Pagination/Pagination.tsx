import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { ILPU } from '../../../interfaces/ILPU';

interface IProps {
    preparedPharmacies?: ILPU[];
}

@inject(({
    appState: {
        departmentsStore: {
            preparedPharmacies
        }
    }
}) => ({
    preparedPharmacies
}))
@observer
class Pagination extends Component<IProps> {
    render() {
        const { preparedPharmacies } = this.props;
        if (!preparedPharmacies.length) return null;
        return (
            <p>
                pagination
            </p>
        );
    }
}

export default Pagination;
