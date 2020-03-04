import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import robotoFont from '../assets/fonts/Roboto/Roboto-Regular.ttf';
import robotoMediumFont from '../assets/fonts/Roboto/Roboto-Medium.ttf';

const roboto = {
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontStyle: 'normal',
    src: `url(${robotoFont})`
};

const robotoMedium = {
    fontFamily: 'Roboto Medium',
    fontWeight: 'normal',
    fontStyle: 'normal',
    src: `url(${robotoMediumFont})`
};

const palette = {
    main: '#FAFCFE',
    white: '#fff',
    gray: {
        main: '#333',
        light: '#aaa',
        secondary: '#868698'
    },
    green: {
        main: '#25d174'
    }
};

const theme = createMuiTheme({
    palette: {
        primary: palette,
        secondary: red,
        text: {
            primary: palette.gray.main,
            secondary: palette.gray.secondary,
        }
    },
    typography: {
        fontFamily: 'Roboto, Roboto Medium'
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': [roboto, robotoMedium]
            }
        },
        MuiDrawer: {
            paper: {
                width: 70
            }
        },
        MuiTypography: {
            h5: {
                fontSize: '1.25rem'
            },
            h6: {
              fontSize: '1.125rem' // 18px
            },
            body1: {
                fontSize: '1rem' // 16px
            },
            body2: {
                fontSize: '0.875rem' // 14px
            },
            subtitle1: {
                fontSize: '0.8125rem' // 13px
            }
        }
    }
});

export default theme;
