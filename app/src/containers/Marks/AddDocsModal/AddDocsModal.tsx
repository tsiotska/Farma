import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    TextField,
    MenuItem,
    List,
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

const styles = (theme: any) => createStyles({
    select: {
        marginTop: 22,
        maxWidth: '100%',
        '& > .MuiInput-root': {
            marginBottom: 0
        }
    },
    list: {
        maxHeight: 250,
        overflow: 'auto'
    },
    listItem: {
        '& .MuiCheckbox-root': {
            padding: 0
        },
        '& .MuiListItemIcon-root': {
            minWidth: 20
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    openedModal?: string;
    openModal?: (modalName: string) => void;
    loadSpecialties?: () => void;
    specialties?: ISpecialty[];
    loadLPUs?: () => void;
    LPUs?: ILPU[];
    doctors?: IDoctor[];
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
            doctors
        }
    }
}) => ({
    openedModal,
    openModal,
    doctors,
    loadSpecialties,
    specialties,
    loadLPUs,
    LPUs
}))
@observer
class AddDocsModal extends Component<IProps> {
    @observable selectedSpecialty: string = '';
    @observable selectedPharmacy: string = '';
    @observable selectedDocs: IDoctor[] = [];

    @computed
    get filteredDocs(): IDoctor[] {
        const { doctors } = this.props;
        return doctors;
    }

    specialtyChangeHandler = ({ target: { value }}: any) => {
        this.selectedSpecialty = value;
    }

    pharmacyChangeHandler = ({ target: { value }}: any) => {
        this.selectedPharmacy = value;
    }

    closeHandler = () => this.props.openModal(null);

    listItemClickHandler = (doc: IDoctor) => {
        if (this.selectedDocs.includes(doc)) {
            this.selectedDocs = this.selectedDocs.filter(x => x.id !== doc.id);
        } else {
            this.selectedDocs.push(doc);
        }
    }

    componentDidUpdate(props: IProps) {
        const { openedModal: prevModal } = props;
        const { openedModal, loadSpecialties, loadLPUs } = this.props;
        const becomeOpen = prevModal !== ADD_DOC_MODAL && openedModal === ADD_DOC_MODAL;
        if (becomeOpen) {
            loadSpecialties();
            loadLPUs();
        }
    }

    render() {
        const {
            classes,
            openedModal,
            specialties,
            LPUs,
            doctors
        } = this.props;
        console.log('docs: ', toJS(doctors));
        return (
            <Dialog
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
                    <MenuItem value='' />
                    {
                        LPUs && LPUs.slice(0, 100).map(x => (
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
                    <MenuItem value='' />
                    {
                        specialties.map(({ id, name }) => (
                            <MenuItem key={id} value={name}>
                                { name }
                            </MenuItem>
                        ))
                    }
                </TextField>
                <TextField
                    className={classes.select}
                    InputProps={{
                        disableUnderline: true,
                    }}
                    InputLabelProps={{
                        shrink: true
                    }}
                />
                <List className={classes.list}>
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
            </Dialog>
        );
    }
}

export default withStyles(styles)(AddDocsModal);
