import React, {Component} from 'react';
import {
    createStyles,
    MenuItem,
    Select, Typography,
    withStyles,
    WithStyles
} from '@material-ui/core';
import { Language } from '@material-ui/icons';
import {inject, observer} from 'mobx-react';
import {generate} from 'shortid';
import {LOCALES} from '../../stores/LocalizationStore';
import cx from 'classnames';

const styles = (theme: any) => createStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        '&.secondary': {
            color: theme.palette.primary.text
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    currentLocale?: string;
    changeLanguage?: (key: string) => void;
    color?: 'default' | 'secondary';
}

@inject(({
    appState: {
        localizationStore: {
            currentLocale,
            changeLanguage
        }
    }
}) => ({
    currentLocale,
    changeLanguage
}))
@observer
class SwitchLanguage extends Component<IProps> {
    handleSelectChange = ({ target: { value } }: any) => {
        this.props.changeLanguage(value);
    }

    render() {
        const { currentLocale, classes, color } = this.props;
        const renderValue: string = (LOCALES
            .find(({ locale, name }) => locale === currentLocale) || {name: 'English'})
            .name;

        return (
            <Select
                classes={{ root: cx(classes.root, { secondary: color === 'secondary' }) }}
                renderValue={() => <><Language fontSize='small' />{renderValue}</>}
                disableUnderline
                value={currentLocale}
                onChange={this.handleSelectChange}>
                {
                    LOCALES.map(({ locale, name }) => (
                        <MenuItem value={locale} key={generate()}>
                            <Typography>
                                {name}
                            </Typography>
                        </MenuItem>
                    ))
                }
            </Select>
        );
    }
}

export default withStyles(styles)(SwitchLanguage);
