import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Typography,
    Button,
    IconButton,
    LinearProgress
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { USER_ROLE } from '../../../constants/Roles';
import { Close } from '@material-ui/icons';
import { IBonusInfo, IMark, IAgentInfo } from '../../../interfaces/IBonusInfo';
import { ADD_DOC_MODAL } from '../../../constants/Modals';
import cx from 'classnames';
import { IMarkFraction } from '../../../stores/UserStore';
import { ISalarySettings } from '../../../interfaces/ISalarySettings';
import { IUserLikeObject } from '../../../stores/DepartmentsStore';
import { IUserInfo } from '../Table/Table';
import { toJS } from 'mobx';

const styles = (theme: any) => createStyles({
    emptyText: {
        marginBottom: 12,
        width: '100%'
    },
    container: {
        marginBottom: 12,
    },
    addDocButton: {
        marginLeft: 'auto',
        color: theme.palette.primary.green.main,
        borderColor: theme.palette.primary.green.main,
        backgroundColor: 'white',
        border: '1px solid',
        minWidth: 150,
        marginRight: 12,
        '&:hover': {
            backgroundColor: '#f3f3f3',
        }
    },
    cancelChanges: {
        borderRadius: 2,
        padding: 8,
        marginLeft: 8
    },
    progress: {
        marginTop: 8,
        width: '100%'
    },
    saveButton: {
        backgroundColor: '#25D174',
        borderTop: '1px solid white',
        color: 'white',
        '&:hover': {
            background: '#21bb68'
        },
        '&.Mui-disabled': {
            color: 'white',
            backgroundColor: '#69e4a2',
            '&.invalid': {
                background: '#EE6969',
            }
        }
    },
    isInvalid: {
        background: 'red'
    }
});

interface IProps extends WithStyles<typeof styles> {
    isNested: boolean;
    position: USER_ROLE;
    agentsLoaded: boolean;
    previewBonus: IBonusInfo;
    agents: IUserInfo[];
    summedTotal: IMarkFraction;

    changedMarks?: Map<number,  Map<number, IMark>>;
    salarySettings?: ISalarySettings;
    clearChangedMarks?: () => void;
    openModal?: (modalName: string) => void;
    updateBonus?: (bonus: IBonusInfo, sale: boolean) => void;
}

@inject(({
    appState: {
        userStore: {
            changedMarks,
            clearChangedMarks,
            updateBonus,
            salarySettings
        },
        uiStore: {
            openModal
        }
    }
}) => ({
    changedMarks,
    clearChangedMarks,
    openModal,
    updateBonus,
    salarySettings
}))
@observer
class TableSubheader extends Component<IProps> {
    get userIsMedicalAgent(): boolean {
        const { position } = this.props;
        return position === USER_ROLE.MEDICAL_AGENT;
    }

    get isEmpty(): boolean {
        const { agentsLoaded, agents } = this.props;
        // return agentsLoaded === true && !agents.length;
        return agents && !agents.length;
    }

    get isValid(): boolean {
        const {
            summedTotal: { payments, deposit },
            salarySettings
        } = this.props;
        const current = (deposit * 100) / (payments + deposit);
        const initValue = salarySettings
            ? salarySettings.payments
            : 0;
        const settingsPayments = (1 - initValue) * 100;
        return settingsPayments >= 0 && settingsPayments <= 100
            ? current >= settingsPayments
            : false;
    }

    openAddDocModal = () => this.props.openModal(ADD_DOC_MODAL);

    updateBonus = () => {
        const { updateBonus, previewBonus } = this.props;
        updateBonus(previewBonus, true);
    }

    render() {
        const {
            isNested,
            classes,
            position,
            clearChangedMarks,
            agentsLoaded,
            previewBonus,
            changedMarks,
            agents,
        } = this.props;

        if (!isNested) return null;
        console.log(
            previewBonus
            ? toJS(previewBonus.sales)
            : null
        );
        return (
            <Grid container className={classes.container} alignItems='center'>
                <Typography>
                    { position === USER_ROLE.REGIONAL_MANAGER && 'Медицинські представники' }
                    { position === USER_ROLE.MEDICAL_AGENT && 'Лікарі' }
                </Typography>
                {
                    agentsLoaded && this.userIsMedicalAgent && <>
                        <Button
                            disabled={!previewBonus}
                            className={classes.addDocButton}
                            onClick={this.openAddDocModal}>
                            Додати лікаря
                        </Button>
                        {
                            this.isEmpty === false && <>
                                <Button
                                    className={cx(classes.saveButton, { invalid: !this.isValid })}
                                    disabled={!changedMarks.size || !this.isValid}
                                    onClick={this.updateBonus}>
                                        Зберегти зміни
                                </Button>
                                <IconButton
                                    disabled={!changedMarks.size}
                                    onClick={clearChangedMarks}
                                    className={classes.cancelChanges}>
                                    <Close fontSize='small' />
                                </IconButton>
                            </>
                        }
                    </>
                }
                {
                    agentsLoaded === false &&
                    <LinearProgress className={classes.progress} />
                }
                {
                    agentsLoaded && this.isEmpty &&
                    <Typography variant='body2' className={classes.emptyText}>
                        Список { this.userIsMedicalAgent ? 'лікарів' : 'працівників' } пустий
                    </Typography>
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(TableSubheader);
