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
import { IBonusInfo, IMark } from '../../../interfaces/IBonusInfo';
import { ADD_DOC_MODAL } from '../../../constants/Modals';

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
});

interface IProps extends WithStyles<typeof styles> {
    isNested: boolean;
    position: USER_ROLE;
    agentsLoaded: boolean;
    previewBonus: IBonusInfo;
    hasAgents: boolean;

    clearChangedMarks?: () => void;
    changedMarks?: Map<number,  Map<number, IMark>>;
    openModal?: (modalName: string) => void;
    updateBonus?: (bonus: IBonusInfo, sale: boolean) => void;
}

@inject(({
    appState: {
        userStore: {
            changedMarks,
            clearChangedMarks,
            updateBonus
        },
        uiStore: {
            openModal
        }
    }
}) => ({
    changedMarks,
    clearChangedMarks,
    openModal,
    updateBonus
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
        const { agentsLoaded, hasAgents } = this.props;
        return agentsLoaded === true && hasAgents === false;
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
                                    disabled={!changedMarks.size}
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
