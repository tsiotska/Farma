import React, { Component } from 'react';
import { createStyles, WithStyles, Grid, IconButton } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { ArrowLeft, Add, ArrowRight } from '@material-ui/icons';
import TabItem from '../TabItem';
import { USER_ROLE } from '../../../constants/Roles';
import { IBonusInfo } from '../../../interfaces/IBonusInfo';
import { ADD_BONUS_MODAL } from '../../../constants/Modals';

const styles = (theme: any) => createStyles({
    iconButton: {
        borderRadius: 2,
        minHeight: 64
    },
});

interface IProps extends WithStyles<typeof styles> {
    isLoading: boolean;
    setBonusesYear?: (value: number, shouldPostData: boolean, loadData: boolean) => void;
    bonusesYear?: number;
    role?: USER_ROLE;
    bonuses: IBonusInfo[];
    previewBonusMonth?: number;
    openModal?: (modaName: string) => void;
}

@inject(({
    appState: {
        userStore: {
            setBonusesYear,
            bonusesYear,
            previewBonusMonth,
            role
        },
        uiStore: {
            openModal
        }
    }
}) => ({
    setBonusesYear,
    bonusesYear,
    previewBonusMonth,
    role,
    openModal
}))
@observer
class MontPicker extends Component<IProps> {
    readonly currentYear = new Date().getFullYear();

    incrementYear = () => {
        const { setBonusesYear, bonusesYear, role } = this.props;
        setBonusesYear(bonusesYear + 1, role === USER_ROLE.MEDICAL_AGENT, true);
    }

    decrementYear = () => {
        const { setBonusesYear, bonusesYear, role } = this.props;
        setBonusesYear(bonusesYear - 1, role === USER_ROLE.MEDICAL_AGENT, true);
    }

    createBonus = () => this.props.openModal(ADD_BONUS_MODAL);

    componentWillUnmount() {
        const { setBonusesYear, role } = this.props;
        setBonusesYear(
            new Date().getFullYear(),
            role === USER_ROLE.MEDICAL_AGENT,
            false
        );
    }

    render() {
        const {
            classes,
            bonuses,
            isLoading,
            bonusesYear,
            previewBonusMonth
        } = this.props;

        return (
            <Grid container alignItems='center'>
                <IconButton
                    onClick={this.decrementYear}
                    disabled={!bonuses || !bonuses.length}
                    className={classes.iconButton}>
                    <ArrowLeft fontSize='small' />
                </IconButton>
                <IconButton
                    onClick={this.createBonus}
                    disabled={isLoading}
                    className={classes.iconButton}>
                    <Add fontSize='small' />
                </IconButton>
                {
                    bonuses && bonuses.map(bonusInfo => (
                        <TabItem
                            key={bonusInfo.month}
                            bonus={bonusInfo}
                            selected={previewBonusMonth === bonusInfo.month}
                        />
                    ))
                }
                <IconButton
                    disabled={bonusesYear >= this.currentYear}
                    onClick={this.incrementYear}
                    className={classes.iconButton}>
                    <ArrowRight fontSize='small' />
                </IconButton>
            </Grid>
        );
    }
}

export default withStyles(styles)(MontPicker);
