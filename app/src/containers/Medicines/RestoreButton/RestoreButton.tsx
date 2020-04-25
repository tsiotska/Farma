import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { IMedicine } from '../../../interfaces/IMedicine';
import { Button } from '@material-ui/core';
import { observable } from 'mobx';
import LoadingMask from '../../../components/LoadingMask';

interface IProps {
    className: string;
    restoreMedicine?: (medicine: IMedicine) => Promise<void>;
    medicine?: IMedicine;
}

@inject(({
    appState: {
        departmentsStore: {
            restoreMedicine
        }
    }
}) => ({
    restoreMedicine
}))
@observer
class RestoreButton extends Component<IProps> {
    @observable isLoading: boolean = false;

    clickHandler = async () => {
        const { medicine, restoreMedicine } = this.props;
        this.isLoading = true;
        await restoreMedicine(medicine);
        this.isLoading = false;
    }

    render() {
        const { className } = this.props;

        return (
            <Button onClick={this.clickHandler} variant='contained' className={className}>
                {
                    this.isLoading
                    ? <LoadingMask size={20} />
                    : 'Повернути'
                }
            </Button>
        );
    }
}

export default RestoreButton;
