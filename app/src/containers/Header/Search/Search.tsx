import React, { Component } from 'react';
import { createStyles, WithStyles, Input, IconButton } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import { observable } from 'mobx';

const styles = (theme: any) => createStyles({
    input: {
        border: '1px solid #aaa',
        borderRadius: 2,
        width: '100%',
        paddingLeft: 5
    },
    iconButton: {
        borderRadius: 2,
        padding: 6,
    }
});

interface IProps extends WithStyles<typeof styles> {

}

@observer
class Search extends Component<IProps> {
    @observable query: string = '';

    searchClickHandler = () => {
        console.log('should search');
    }

    changeHandler = ({ target: { value }}: any) => {
        this.query = value;
    }

    render() {
        const { classes } = this.props;
        return (
            <Input
                className={classes.input}
                value={this.query}
                onChange={this.changeHandler}
                endAdornment={
                    <IconButton onClick={this.searchClickHandler} className={classes.iconButton}>
                        <SearchIcon fontSize='small' />
                    </IconButton>
                }
                disableUnderline
            />
        );
    }
}

export default withStyles(styles)(Search);
