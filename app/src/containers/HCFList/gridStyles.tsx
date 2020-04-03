import { createStyles } from '@material-ui/core';

export const gridStyles = (theme: any) => createStyles({
    cell: {
        paddingRight: 8,
        '&:last-of-type': {
            paddingRight: 0
        }
    },
    name: {
        paddingLeft: 8
    },
    region: {
        minWidth: 130,
    },
    oblast: {
        minWidth: 130,
    },
    city: {
        minWidth: 130,
    },
    address: {},
    phone: {
        minWidth: 170,
        '&.widder': {
            minWidth: 220
        }
    },
});
