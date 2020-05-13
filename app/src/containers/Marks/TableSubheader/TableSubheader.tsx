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

const styles = (theme: any) => createStyles({
    emptyText: {
        marginBottom: 12
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
        // marginBottom: 12,
        width: '100%'
    },
    saveButton: {
        '&.Mui-disabled.invalid': {
            background: '#EE6969',
            color: 'white'
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
    agents: IAgentInfo[];
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

    get showButtons(): boolean {
        const { isNested } = this.props;
        return isNested && this.userIsMedicalAgent;
    }

    get isEmpty(): boolean {
        const { agentsLoaded, agents } = this.props;
        return agentsLoaded === true && !agents.length;
    }

    get isValid(): boolean {
        const {
            summedTotal: { payments, deposit },
            salarySettings
        } = this.props;
        const current = (deposit * 100) / (payments + deposit);
        const settingsPayments = (salarySettings ? salarySettings.payments : 1) * 100;
        console.log('total: ', current, settingsPayments);
        return current >= settingsPayments;
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
            changedMarks
        } = this.props;

        if (!isNested) return null;

        return (
            <Grid container className={classes.emptyText} alignItems='center'>
                <Typography>
                    { position === USER_ROLE.REGIONAL_MANAGER && 'Медицинські представники' }
                    { position === USER_ROLE.MEDICAL_AGENT && 'Лікарі' }
                </Typography>
                {
                    agentsLoaded && <>
                        <Button
                            disabled={!previewBonus}
                            className={classes.addDocButton}
                            onClick={this.openAddDocModal}>
                            Додати лікаря
                        </Button>
                        {
                            this.showButtons && <>
                                <Button
                                    onClick={this.updateBonus}
                                    variant='contained'
                                    disabled={!changedMarks.size || !this.isValid}
                                    className={cx(classes.saveButton, { invalid: !this.isValid })}
                                    // className={cx({ [classes.isInvalid]: !this.isValid })}
                                    color='primary'>
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
                    this.isEmpty &&
                    <Typography variant='body2' className={classes.emptyText}>
                        Список { this.userIsMedicalAgent ? 'лікарів' : 'працівників' } пустий
                    </Typography>
                }
            </Grid>
        );
    }
}

export default withStyles(styles)(TableSubheader);
