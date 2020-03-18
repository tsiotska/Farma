import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import SansProSource from '../assets/fonts/SansPro/SansPro-Regular.ttf';
import SansProMediumSource from '../assets/fonts/SansPro/SansPro-SemiBold.ttf';

const sansPro = {
    fontFamily: 'Source Sans Pro',
    fontWeight: 'normal',
    fontStyle: 'normal',
    src: `url(${SansProSource})`
};

const SansProMedium = {
    fontFamily: 'Source Sans Pro SemiBold',
    fontWeight: 'normal',
    fontStyle: 'normal',
    src: `url(${SansProMediumSource})`
};

const palette = {
    main: '#F0F1F6',
    white: '#fff',
    gray: {
        main: '#333',
        mainLight: '#555',
        light: '#aaa',
        secondary: '#868698'
    },
    green: {
        main: '#25d174'
    },
    blue: '#2196F3',
    error: 'red'
};

const typographyOverrides: any = {
    h5: {
        fontSize: '1.25rem' // 20 px
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
        fontFamily: 'Source Sans Pro, Source Sans Pro SemiBold'
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': [sansPro, SansProMedium]
            }
        },
        MuiDrawer: {
            paper: {
                width: 70
            }
        },
        MuiLinearProgress: {
            colorPrimary: {
                backgroundColor: '#e5e7e8'
            },
            barColorPrimary: {
                backgroundColor: palette.green.main
            }
        },
        MuiCircularProgress: {
            colorPrimary: {
                color: '#002afd'
            }
        },
        MuiInput: {
            formControl: {
                border: `1px solid ${palette.gray.light}`,
                marginBottom: 20,
                borderRadius: 1,
                '&.Mui-error': {
                    borderColor: palette.error
                }
            }
        },
        MuiInputLabel: {
            formControl: {
                color: palette.gray.mainLight,
                '&.Mui-focused': {
                    color: palette.gray.mainLight
                },
                '&.Mui-error': {
                    color: palette.error
                }
            },
            shrink: {
                transform: 'translateY(-5px)',
                fontSize: typographyOverrides.subtitle1.fontSize,
            },
        },
        MuiButton: {
            root: {
                textTransform: 'none'
            },
            // usually this is submit button
            containedPrimary: {
                color: palette.white,
                backgroundColor: palette.blue,
                '&:hover': {
                    backgroundColor: '#1d8ce4',
                }
            }
        },
        MuiFormHelperText: {
            root: {
                position: 'absolute',
                bottom: 0
            }
        },
        MuiTypography: typographyOverrides
    }
});

export default theme;
