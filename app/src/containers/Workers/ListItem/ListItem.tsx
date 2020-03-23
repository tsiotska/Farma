import React, { Component } from 'react';
import {
    createStyles,
    WithStyles,
    Grid,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    IconButton,
    Avatar,
    Typography
} from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IWorker } from '../../../interfaces/IWorker';
import { NotInterested, Edit } from '@material-ui/icons';
import { observable } from 'mobx';
import { format, isValid } from 'date-fns';
import ru from 'date-fns/locale/ru';
import ImageLoader from '../../../components/ImageLoader';
import { IPosition } from '../../../interfaces/IPosition';

const styles = (theme: any) => createStyles({
    root: {
        width: '100%',
        marginBottom: 2,
        '&:before': {
            content: 'none'
        },
        '& p': {
            cursor: 'text !important',
            userSelect: 'all',
            paddingLeft: 5,
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        }
    },
    expanded: {
        marginTop: '0 !important'
    },
    avatar: {
        width: 32,
        height: 32
    },
    summaryContent: {
        alignItems: 'center',
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
        cursor: ({ children }: any) => children ? 'initial' : 'default !important',
        padding: 0,
        minHeight: '48px !important',
        // border: '1px solid #ddd',
    },
    iconButton: {
        borderRadius: 2
    },
    gridItem: {
        overflow: 'hidden'
    },
    details: {
        padding: '8px 0 24px 32px',
        backgroundColor: '#f5f5f5'
    },
    actions: {
        width: 88
    }
});

interface IProps extends WithStyles<typeof styles> {
    position: IPosition;
    worker: IWorker;
    fired: boolean;
    expandable?: boolean;
    children?: any;
    isExpanded?: boolean;
    expandChangeHandler?: (e: any, expanded: boolean) => void;
}

@observer
class ListItem extends Component<IProps> {
    readonly dateFormat: string = 'dd MMM yyyy';

    get position(): string {
        const { position } = this.props;
        return position ? position.alias : '-';
    }

    get region(): string {
        // const { region } = this.props;
        // return region ? region.name : '-';
        return '-';
    }

    get date(): string {
        const {
            worker: { hired, fired },
            fired: isFired
        } = this.props;

        const emptyPlaceholder = isFired
            ? '...'
            : '-';

        const from = isValid(hired)
            ? format(hired, this.dateFormat, { locale: ru })
            : emptyPlaceholder;

        if (isFired) {
            const to = isValid(fired)
                ? format(fired, this.dateFormat, { locale: ru })
                : emptyPlaceholder;

            return `${from} - ${to}`;
        }

        return from;
    }

    render() {
        const {
            classes,
            children,
            position,
            fired,
            expandable,
            expandChangeHandler,
            isExpanded,
            worker: {
                avatar,
                name,
                hired,
                email,
                phone,
                card,
                isVacancy
            }
        } = this.props;

        return (
            <ExpansionPanel
                TransitionProps={{
                    mountOnEnter: true,
                    unmountOnExit: true
                }}
                onChange={expandChangeHandler}
                expanded={isExpanded}
                elevation={0} classes={{
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
                    <Grid xs={3} className={classes.gridItem} wrap='nowrap' zeroMinWidth container item>
                        <ImageLoader
                            className={classes.avatar}
                            component={Avatar}
                            src={avatar}
                        />
                        <Typography variant='body2'>
                            {name}
                        </Typography>
                    </Grid>
                    <Grid xs className={classes.gridItem} container zeroMinWidth item>
                        <Typography variant='body2'>
                            {fired ? this.region : this.position}
                        </Typography>
                    </Grid>
                    <Grid xs={fired ? 2 : true} className={classes.gridItem} zeroMinWidth container item>
                        <Typography variant='body2'>
                            {this.date}
                        </Typography>
                    </Grid>
                    <Grid xs className={classes.gridItem} zeroMinWidth container item>
                        <Typography variant='body2'>
                            {email}
                        </Typography>
                    </Grid>
                    <Grid xs className={classes.gridItem} zeroMinWidth container item>
                        <Typography variant='body2'>
                            {phone}
                        </Typography>
                    </Grid>
                    <Grid xs className={classes.gridItem} zeroMinWidth container item>
                        <Typography variant='body2'>
                            {card}
                        </Typography>
                    </Grid>

                    <Grid justify='flex-end' className={classes.actions} container>
                        {
                            fired === false &&
                            <>
                                {
                                    isVacancy === false &&
                                    <IconButton className={classes.iconButton}>
                                        <NotInterested fontSize='small' />
                                    </IconButton>
                                }
                                <IconButton className={classes.iconButton}>
                                    <Edit fontSize='small' />
                                </IconButton>
                            </>
                        }
                    </Grid>
                </ExpansionPanelSummary>
                {
                    children &&
                    <ExpansionPanelDetails className={classes.details}>
                        {children}
                    </ExpansionPanelDetails>
                }
            </ExpansionPanel>
        );
    }
}

export default withStyles(styles)(ListItem);
