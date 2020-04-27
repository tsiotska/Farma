import React, { Component } from 'react';
import { createStyles, WithStyles, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Grid, Typography, LinearProgress } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IUserSalary } from '../../../interfaces/IUserSalary';
import { KeyboardArrowDown } from '@material-ui/icons';
import { IUser } from '../../../interfaces';
import UserShortInfo from '../../../components/UserShortInfo';
import { IAsyncStatus } from '../../../stores/AsyncStore';
import { computed } from 'mobx';

const styles = (theme: any) => createStyles({
    root: {
        width: '100%',
        marginBottom: 2,
        '&:before': {
            content: 'none'
        },
        '& p': {
            // cursor: 'text !important',
            userSelect: 'all',
            paddingLeft: 5,
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        }
    },
    expanded: {
        marginTop: '0 !important',
        marginBottom: '0 !important'
    },
    avatar: {
        width: 32,
        height: 32
    },
    image: {
        width: 20,
        height: 20
    },
    summaryContent: {
        alignItems: 'stretch',
        margin: 0,
        order: 1,
        '&.Mui-expanded': {
            margin: 0,
        }
    },
    expandIcon: {
        order: 0,
        padding: 6,
        margin: 0
    },
    summaryRoot: {
        padding: 0,
        minHeight: '48px !important',
    },
    gridItem: {
        overflow: 'hidden',
        borderRadius: 2,
        transition: '0.3s',
        '&:first-of-type:hover': {
            backgroundColor: ({ disableClick }: any) => disableClick
                ? 'transparent'
                : '#f1f1f1'
        }
    },
    details: {
        padding: '8px 0 24px 32px',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column'
    },
    placeholderImage: {
        margin: '8px 6px 8px 10px'
    },
    contantCol: {
        width: 300 - 32
    },
    icon: {
        display: ({ user }: any) => user && user.avatar ? 'block' : 'none',
        width: 40,
        height: 40,
    },
    userTextContainer: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        padding: '8px 0 8px 8px'
    },
    text: {
        fontSize: '14px',
        fontFamily: 'Source Sans Pro',
        color: theme.palette.primary.gray.mainLight
    },
    emptyPlaceholder: {
        marginTop: 10
    }
});

interface IProps extends WithStyles<typeof styles> {
    expandable: boolean;
    isExpanded: boolean;
    userSalary: IUserSalary;
    position: 'РМ' | 'МП';
    locationsAgents: Map<number, IUser>;
    onExpand?: (userSalary: IUserSalary, e: any, expanded: boolean) => void;
    getAsyncStatus?: (key: string) => IAsyncStatus;
}

@inject(({
    appState: {
        departmentsStore: {
            getAsyncStatus,
            locationsAgents
        }
    }
}) => ({
    getAsyncStatus,
    locationsAgents
}))
@observer
class ListItem extends Component<IProps> {
    @computed
    get isLoading(): boolean {
        return this.props.getAsyncStatus('loadSubSalaries').loading;
    }

    expandChangeHandler = (e: any, expanded: boolean) => {
        const { onExpand, userSalary } = this.props;
        if (onExpand) onExpand(userSalary, e, expanded);
    }

    render() {
        const {
            expandable,
            isExpanded,
            classes,
            locationsAgents,
            position,
            userSalary: {
                id,
                level,
                salary,
                extraCosts,
                bonus,
                kpi,
                money,
                total,
                subSalaries,
            },
        } = this.props;

        return (
            <ExpansionPanel
                onChange={this.expandChangeHandler}
                expanded={isExpanded}
                elevation={0}
                TransitionProps={{
                    mountOnEnter: true,
                    unmountOnExit: true
                }}
                classes={{
                    root: classes.root,
                    expanded: classes.expanded
                }}>
                <ExpansionPanelSummary
                    expandIcon={expandable && <KeyboardArrowDown fontSize='small' />}
                    classes={{
                        content: classes.summaryContent,
                        root: classes.summaryRoot,
                        expandIcon: classes.expandIcon
                    }}>
                        <Grid className={classes.contantCol} wrap='nowrap' container item>
                            <UserShortInfo
                                user={locationsAgents.get(id)}
                                classes={{
                                    avatar: classes.icon,
                                    textContainer: classes.userTextContainer,
                                    credentials: classes.text,
                                    position: classes.text,
                                }}
                                disableClick
                                hideLevel
                            />
                        </Grid>
                        <Grid xs justify='center' alignItems='center' container item>
                            { position }
                        </Grid>
                        <Grid xs justify='center' alignItems='center' container item>
                            { money }
                        </Grid>
                        <Grid xs justify='center' alignItems='center' container item>
                            { position }
                            { level }
                        </Grid>
                        <Grid xs justify='center' alignItems='center' container item>
                            { salary }
                        </Grid>
                        <Grid xs justify='center' alignItems='center' container item>
                            { extraCosts }
                        </Grid>
                        <Grid xs justify='center' alignItems='center' container item>
                            { kpi }
                        </Grid>
                        <Grid xs justify='center' alignItems='center' container item>
                            { bonus }
                        </Grid>
                        <Grid xs justify='center' alignItems='center' container item>
                            { total }
                        </Grid>

                </ExpansionPanelSummary>
                {
                    position === 'РМ' &&
                    <ExpansionPanelDetails className={classes.details}>
                        <Typography>
                            Медичні представники
                        </Typography>
                        {
                            (subSalaries && subSalaries.length)
                            ? subSalaries.map(x => (
                                <ListItem
                                    key={x.id}
                                    classes={classes}
                                    locationsAgents={locationsAgents}
                                    expandable={false}
                                    isExpanded={false}
                                    userSalary={x}
                                    position='МП'
                                />
                            ))
                            : this.isLoading
                                ? <LinearProgress />
                                : <Typography variant='body2' className={classes.emptyPlaceholder}>
                                    Список МП пустий
                                </Typography>

                        }
                    </ExpansionPanelDetails>
                }
            </ExpansionPanel>
        );
    }
}

export default withStyles(styles)(ListItem);
