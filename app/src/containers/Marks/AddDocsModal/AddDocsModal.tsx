import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TextField,
    MenuItem,
    List,
    Divider,
    Button,
    Typography,
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Dialog from '../../../components/Dialog';
import { ADD_DOC_MODAL } from '../../../constants/Modals';
import { ISpecialty } from '../../../interfaces/ISpecialty';
import { observable, toJS, computed } from 'mobx';
import { ILPU } from '../../../interfaces/ILPU';
import { IDoctor } from '../../../interfaces/IDoctor';
import SuggestListItem from '../SuggestListItem';
import debounce from 'lodash/debounce';
import { IBonusInfo } from '../../../interfaces/IBonusInfo';
import { IUserLikeObject } from '../../../stores/DepartmentsStore';
import LoadingMask from '../../../components/LoadingMask';
import { IUser } from '../../../interfaces';

const styles = (theme: any) => createStyles({
    select: {
        marginTop: 22,
        maxWidth: '100%',
        '&:last-of-type': {
            marginTop: 0
        },
        '& > .MuiInput-root': {
            marginBottom: 0
        }
    },
    list: {
        height: 250,
        overflow: 'auto'
    },
    listItem: {
        height: 36,
        '& .MuiCheckbox-root': {
            padding: 0
        },
        '& .MuiListItemIcon-root': {
            minWidth: 20
        }
    },
    divider: {
        margin: '20px 0'
    },
    submitButton: {
        marginLeft: 'auto',
        marginTop: 22
    }
});

interface IProps extends WithStyles<typeof styles> {
    openedModal?: string;
    specialties?: ISpecialty[];
    LPUs?: ILPU[];
    openModal?: (modalName: string) => void;
    loadSpecialties?: () => void;
    loadLPUs?: () => void;
    addDocsToBonus?: (docs: IDoctor[]) => void;
    previewBonus?: IBonusInfo;
    docs: IDoctor[];
    // loadConfirmedDoctors?: (targetUser: IUserLikeObject) => IDoctor[];
    // clearDoctors?: () => void;
    // previewUser?: IUser;
}

@inject(({
    appState: {
        uiStore: {
            openedModal,
            openModal
        },
        departmentsStore: {
            loadSpecialties,
            specialties,
            loadLPUs,
            LPUs,
            // loadConfirmedDoctors,
            // clearDoctors
        },
        userStore: {
            addDocsToBonus,
            previewBonus,
            // previewUser
        }
    }
}) => ({
    previewBonus,
    openedModal,
    openModal,
    loadSpecialties,
    addDocsToBonus,
    specialties,
    loadLPUs,
    LPUs,
    // loadConfirmedDoctors,
    // clearDoctors,
    // previewUser
}))
@observer
class AddDocsModal extends Component<IProps> {
    @observable selectedSpecialty: string = '';
    @observable selectedPharmacy: string = '';
    @observable selectedDocs: IDoctor[] = [];
    @observable searchName: string = '';
    // @observable docs: IDoctor[] = [];
    // @observable docsLoaded: boolean = false;

    @computed
    get docsToPick(): IDoctor[] {
        const { previewBonus, docs } = this.props;
        const idsToFilter = (
            previewBonus
            ? previewBonus.agents
            : []
        ).map(({ id }) => id);
        return docs.filter(({ id }) => idsToFilter.includes(id) === false);
    }

    @computed
    get filteredDocs(): IDoctor[] {
        return this.docsToPick
        .filter(({ name, LPUName, specialty }) => (
            name.includes(this.searchName)
            && (this.selectedPharmacy ? this.selectedPharmacy === LPUName : true)
            && (this.selectedSpecialty ? this.selectedSpecialty === specialty : true)
        )).sort((a, b) => {
            const isAChecked = this.selectedDocs.includes(a);
            const isBChecked = this.selectedDocs.includes(b);
            if (isAChecked && isBChecked) return 0;
            return isAChecked
                ? -1
                : 1;
        });
    }

    searchChangeHandler = ({ target: { value }}: any) => {
        this.setSearchName(value);
    }

    setSearchName = debounce(
        (value: string) => {
            this.searchName = value;
        },
        200
    );

    pharmacyChangeHandler = ({ target: { value }}: any) => {
        this.selectedPharmacy = value;
    }

    specialtyChangeHandler = ({ target: { value }}: any) => {
        this.selectedSpecialty = value;
    }

    closeHandler = () => this.props.openModal(null);

    listItemClickHandler = (doc: IDoctor) => {
        if (this.selectedDocs.includes(doc)) {
            this.selectedDocs = this.selectedDocs.filter(x => x.id !== doc.id);
        } else {
            this.selectedDocs.push(doc);
        }
    }

    submitHandler = () => {
        this.props.addDocsToBonus(this.selectedDocs);
        this.selectedDocs = [];
    }

    async componentDidUpdate(props: IProps) {
        const { openedModal: prevModal } = props;
        const {
            openedModal,
            loadSpecialties,
            loadLPUs,
            // loadConfirmedDoctors,
            // previewUser
        } = this.props;
        const becomeOpen = prevModal !== ADD_DOC_MODAL && openedModal === ADD_DOC_MODAL;
        const becomeClosed = prevModal === ADD_DOC_MODAL && openedModal !== ADD_DOC_MODAL;
        if (becomeClosed) {
            this.selectedSpecialty = '';
            this.selectedPharmacy = '';
            this.selectedDocs = [];
            this.searchName = '';
        } else if (becomeOpen) {
            await loadSpecialties();
            await loadLPUs();
            // const newDocs = await loadConfirmedDoctors(previewUser);
            // this.docs = newDocs || [];
            // this.docsLoaded = true;
        }
    }

    // componentWillUnmount() {
    //     this.props.clearDoctors();
    // }

    render() {
        const {
            classes,
            openedModal,
            specialties,
            LPUs,
        } = this.props;

        return (
            <Dialog
                closeIcon
                open={openedModal === ADD_DOC_MODAL}
                onClose={this.closeHandler}
                title='Додати лікаря'
                maxWidth='xs'
                fullWidth>
                <TextField
                    label='ЛПУ / Аптека'
                    select
                    value={this.selectedPharmacy}
                    onChange={this.pharmacyChangeHandler}
                    className={classes.select}
                    InputProps={{
                        disableUnderline: true,
                    }}
                    InputLabelProps={{
                        shrink: true
                    }}>
                    <MenuItem className={classes.listItem} value='' />
                    {
                        LPUs && LPUs.map(x => (
                            <MenuItem key={x.id} value={x.name}>
                                { x.name }
                            </MenuItem>
                        ))
                    }
                </TextField>
                <TextField
                    label='Спеціальність'
                    select
                    value={this.selectedSpecialty}
                    onChange={this.specialtyChangeHandler}
                    className={classes.select}
                    InputProps={{
                        disableUnderline: true,
                    }}
                    InputLabelProps={{
                        shrink: true
                    }}>
                    <MenuItem className={classes.listItem} value='' />
                    {
                        specialties.map(({ id, name }) => (
                            <MenuItem key={id} value={name}>
                                { name }
                            </MenuItem>
                        ))
                    }
                </TextField>
                <Divider className={classes.divider} />
                <TextField
                    className={classes.select}
                    onChange={this.searchChangeHandler}
                    InputProps={{
                        disableUnderline: true,
                    }}
                    InputLabelProps={{
                        shrink: true
                    }}
                    placeholder='Пошук'
                />
                {
                    this.filteredDocs.length
                    ? <List className={classes.list}>
                        {
                            this.filteredDocs.map(x => (
                                <SuggestListItem
                                    key={x.id}
                                    onClick={this.listItemClickHandler}
                                    checked={this.selectedDocs.includes(x)}
                                    doc={x}
                                />
                            ))
                        }
                        </List>
                    : <Typography className={classes.list}>
                        {
                            (
                                this.searchName
                                || this.selectedPharmacy
                                || this.selectedSpecialty
                            ) ? 'Жоден лікар не відповідає вказаним параметрам пошуку'
                            : 'Список лікарів пустий'
                        }
                        </Typography>
                }
                <Button
                    color='primary'
                    variant='contained'
                    onClick={this.submitHandler}
                    disabled={!this.selectedDocs.length}
                    className={classes.submitButton}>
                    Додати
                    {
                        !!this.selectedDocs.length
                        && ` ${this.selectedDocs.length} лікар${this.selectedDocs.length === 1 ? 'я' : 'ів'}`
                    }
                </Button>
            </Dialog>
        );
    }
}

export default withStyles(styles)(AddDocsModal);
