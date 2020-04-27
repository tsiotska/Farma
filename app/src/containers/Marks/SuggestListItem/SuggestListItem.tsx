import React, { Component } from 'react';
import { createStyles, WithStyles, ListItem, ListItemIcon, Checkbox, ListItemText } from '@material-ui/core';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { IDoctor } from '../../../interfaces/IDoctor';

const styles = (theme: any) => createStyles({
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
    onClick: (doc: IDoctor) => void;
    doc: IDoctor;
    checked: boolean;
}

@observer
class SuggestListItem extends Component<IProps> {
    clickHandler = () => {
        const { onClick, doc } = this.props;
        onClick(doc);
    }

    render() {
        const { classes, checked, doc: { name }} = this.props;

        return (
            <ListItem
                className={classes.listItem}
                dense
                button
                onClick={this.clickHandler}>
                <ListItemIcon>
                    <Checkbox
                    checked={checked}
                    edge='start'
                    color='default'
                    disableRipple
                    />
                </ListItemIcon>
                <ListItemText primary={name} />
            </ListItem>
        );
    }
}

export default withStyles(styles)(SuggestListItem);
