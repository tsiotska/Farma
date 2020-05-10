import React, { Component } from 'react';
import { createStyles, WithStyles, Popper, Typography, Paper, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { ISearchResult } from '../../../interfaces/ISearchResult';
import SearchItem from '../SearchItem';
import { computed, observable } from 'mobx';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IUser } from '../../../interfaces';
import { USER_ROLE, multiDepartmentRoles } from '../../../constants/Roles';
import { DOCTORS_ROUTE } from '../../../constants/Router';

const styles = (theme: any) => createStyles({
    root: {
        zIndex: 1100
    },
    paper: {
        maxHeight: '30vh',
        overflow: 'hidden auto',
        padding: '10px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    loadButton: {
        marginTop: 16,
        marginBottom: 10
    }
});

interface IProps extends WithStyles<typeof styles>, Partial<RouteComponentProps<any>> {
    anchor: HTMLElement;
    items: ISearchResult[];
    loadMoreHandler: () => void;
    hideList: () => void;
    user?: IUser;
    getUser?: (userId: number) => IUser;
    historyReplace?: (users: IUser[]) => void;
    setCurrentDepartment?: (depId: number) => void;
    setPreviewDoctor?: (docId: number) => void;
}

@inject(({
    appState: {
        userStore: {
            getUser,
            historyReplace,
            user
        },
        departmentsStore: {
            setCurrentDepartment,
            setPreviewDoctor
        }
    }
}) => ({
    getUser,
    historyReplace,
    setCurrentDepartment,
    user,
    setPreviewDoctor
}))
@withRouter
@observer
class SearchList extends Component<IProps> {
    readonly maxCount: number = 50;

    @observable isLoading: boolean = false;

    @computed
    get anchorWidth(): number {
        return this.props.anchor.offsetWidth;
    }

    @computed
    get paperWidth(): { width: number } {
        return { width: this.anchorWidth };
    }

    get shouldDisplayData(): boolean {
        const { items } = this.props;
        return !!items && items.length > 0;
    }

    get hasNoData(): boolean {
        const { items } = this.props;
        return !items || !items.length;
    }

    clickHandler = (e: any) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    itemClickHandler = async ({ id, ffm, rm, mp }: ISearchResult) => {
        const {
            getUser,
            history,
            historyReplace,
            setCurrentDepartment,
            hideList,
            user,
            setPreviewDoctor
        } = this.props;
        this.isLoading = true;

        const presets: any = {
            default: [ffm, rm, mp],
            [USER_ROLE.FIELD_FORCE_MANAGER]: [rm, mp],
            [USER_ROLE.REGIONAL_MANAGER]: [mp],
            [USER_ROLE.MEDICAL_AGENT]: [],
        };
        const targetRoles = presets[user.position] || presets.default;
        const promises = targetRoles.map((x: number) => getUser(x));
        const loadedUsers: IUser[] = await Promise.all(promises);
        const filtered = loadedUsers.filter(x => !!x);
        this.isLoading = false;

        const targetDep = user.department ||  filtered[0].department;
        if (!targetDep) return;

        if (filtered.length > 1) {
            const isFromOneDepartment = filtered.reduce((flag, { department }) => flag && department === targetDep, true);
            const isValid = !!filtered.length
                && isFromOneDepartment
                && filtered[filtered.length - 1].position === USER_ROLE.MEDICAL_AGENT;
            if (!isValid) return;
            setCurrentDepartment(targetDep);
        }

        const newUserHistory = multiDepartmentRoles.includes(user.position)
            ? filtered
            : [ user, ...filtered ];
        historyReplace(newUserHistory);
        setPreviewDoctor(id);
        history.push(DOCTORS_ROUTE.replace(':departmentId', `${targetDep}`));
        hideList();
    }

    render() {
        const {
            items,
            anchor,
            classes,
            loadMoreHandler,
        } = this.props;

        return (
            <Popper
                onClick={this.clickHandler}
                className={classes.root}
                open={items !== null}
                anchorEl={anchor}>
                    <Paper className={classes.paper} style={this.paperWidth}>
                        <div>
                            {
                                this.shouldDisplayData &&
                                items.map(x => (
                                    <SearchItem
                                        key={`${x.id}${x.mp}`}
                                        maxWidth={this.anchorWidth}
                                        clickHandler={this.itemClickHandler}
                                        isLoading={this.isLoading}
                                        item={x}
                                    />
                                ))
                            }
                        </div>
                        {
                            this.hasNoData &&
                            <Typography>
                                За вашим пошуком нічого не знайдено
                            </Typography>
                        }
                        {
                            this.shouldDisplayData && items.length % this.maxCount === 0 &&
                            <Button onClick={loadMoreHandler} className={classes.loadButton} variant='contained' color='primary'>
                                Завантажити ще лікарів...
                            </Button>
                        }
                    </Paper>
            </Popper>
        );
    }
}

export default withStyles(styles)(SearchList);
