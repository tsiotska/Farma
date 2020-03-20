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
        marginBottom: theme.spacing(2),
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
        // minHeight: '0px !important',
        border: '1px solid #ddd',
    },
    iconButton: {
        borderRadius: 2
    },
    gridItem: {
        overflow: 'hidden'
    }
});

interface IProps extends WithStyles<typeof styles> {
    position: IPosition;
    worker: IWorker;
    children?: any;
    fired?: boolean;
}

@observer
class ListItem extends Component<IProps> {
    readonly dateFormat: string = 'dd MMM yyyy';
    @observable expanded: boolean = false;

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

    changeHandler = (e: any, expanded: boolean) => {
        this.expanded = expanded;
    }

    render() {
        const {
            classes,
            children,
            position,
            fired,
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
                expanded={!!children && this.expanded}
                onChange={this.changeHandler}
                elevation={0} classes={{
                    root: classes.root,
                    expanded: classes.expanded
                }}>
                <ExpansionPanelSummary
                    expandIcon={fired === false && <KeyboardArrowDown fontSize='small' />}
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
                </ExpansionPanelSummary>
                {
                    children &&
                    <ExpansionPanelDetails>
                        {children}
                    </ExpansionPanelDetails>
                }
            </ExpansionPanel>
        );
    }
}

export default withStyles(styles)(ListItem);
