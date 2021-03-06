import React, {Component} from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    Typography,
    Button,
    IconButton,
    LinearProgress
} from '@material-ui/core';
import {observer, inject} from 'mobx-react';
import {withStyles} from '@material-ui/styles';
import {USER_ROLE} from '../../../constants/Roles';
import {Close} from '@material-ui/icons';
import {IBonusInfo, IMark, IAgentInfo} from '../../../interfaces/IBonusInfo';
import {ADD_DOC_MODAL} from '../../../constants/Modals';
import cx from 'classnames';
import {IMarkFraction} from '../../../stores/UserStore';
import {ISalarySettings} from '../../../interfaces/ISalarySettings';
import {IUserLikeObject} from '../../../stores/DepartmentsStore';
import {IUserInfo} from '../Table/Table';
import {toJS, observable} from 'mobx';
import TableHeader from '../TableHeader';

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
    parentUser: IUserInfo & IUserLikeObject;
    agentsLoaded: boolean;
    previewBonus: IBonusInfo;
    agents: IUserInfo[];
    summedTotal: IMarkFraction;

    changedMarks?: Map<number, Map<number, IMark>>;
    salarySettings?: ISalarySettings;
    clearChangedMarks?: () => void;
    openModal?: (modalName: string) => void;
    updateBonus?: (bonus: IBonusInfo, sale: boolean) => void;
    isMedsDivisionValid?: boolean;
}

@inject(({
             appState: {
                 userStore: {
                     changedMarks,
                     clearChangedMarks,
                     updateBonus,
                     salarySettings,
                     isMedsDivisionValid
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
    salarySettings,
    isMedsDivisionValid
}))
@observer
class TableSubheader extends Component<IProps> {
    get userIsMedicalAgent(): boolean {
        const {parentUser: {position}} = this.props;
        return position === USER_ROLE.MEDICAL_AGENT;
    }

    get isEmpty(): boolean {
        const {agentsLoaded, agents} = this.props;
        // return agentsLoaded === true && !agents.length;
        return agents && !agents.length;
    }

    get isValid(): boolean {
        const { isMedsDivisionValid } = this.props;
        return isMedsDivisionValid;
    }

    openAddDocModal = () => this.props.openModal(ADD_DOC_MODAL);

    updateBonus = () => {
        const {updateBonus, previewBonus} = this.props;
        updateBonus(previewBonus, true);
    }

    render() {
        const {
            isNested,
            classes,
            parentUser,
            clearChangedMarks,
            agentsLoaded,
            previewBonus,
            changedMarks,
            agents,
        } = this.props;
        const {position} = parentUser;

        if (!isNested) return null;

        return (
            <>
                <Grid container className={classes.container} alignItems='center'>
                    <Typography>
                        {position === USER_ROLE.REGIONAL_MANAGER && '?????????????????????? ????????????????????????'}
                        {position === USER_ROLE.MEDICAL_AGENT && '????????????'}
                    </Typography>
                    {
                        agentsLoaded && this.userIsMedicalAgent && <>
                            <Button
                                disabled={!previewBonus}
                                className={classes.addDocButton}
                                onClick={this.openAddDocModal}>
                                ???????????? ????????????
                            </Button>
                            {
                                this.isEmpty === false && <>
                                    <Button
                                        className={cx(classes.saveButton, {invalid: !this.isValid})}
                                        disabled={!changedMarks.size || !this.isValid}
                                        onClick={this.updateBonus}>
                                        ???????????????? ??????????
                                    </Button>
                                    <IconButton
                                        disabled={!changedMarks.size}
                                        onClick={clearChangedMarks}
                                        className={classes.cancelChanges}>
                                        <Close fontSize='small'/>
                                    </IconButton>
                                </>
                            }
                        </>
                    }
                    {
                        agentsLoaded === false &&
                        <LinearProgress className={classes.progress}/>
                    }
                    {
                        agentsLoaded && this.isEmpty &&
                        <Typography variant='body2' className={classes.emptyText}>
                            ???????????? {this.userIsMedicalAgent ? '??????????????' : '??????????????????????'} ????????????
                        </Typography>
                    }
                </Grid>
                {
                    agentsLoaded && this.isEmpty === false &&
                    <TableHeader
                        agents={agents}
                        isMedicalAgent={this.userIsMedicalAgent}
                        previewBonus={previewBonus}
                        hideName
                        isNested
                        parentUser={parentUser}
                    />
                }
            </>
        );
    }
}

export default withStyles(styles)(TableSubheader);
