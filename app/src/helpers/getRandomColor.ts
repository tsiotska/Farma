// one-liner from stackOverflow
// export const getRandomColor = () => '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
export class ColorGenerator {
    static colors: string[] = [ '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4',  '#00BCD4',
        '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107',  '#FF9800', '#FF5722', '#795548', '#9E9E9E',
        '#607D8B', '#D50000', '#C51162', '#AA00FF', '#6200EA', '#00BFA5', '#00C853', '#64DD17', '#AEEA00', '#263238',
        '#212121',
    ];
    static count: number = 0;

    static getColor = () => {
        const newColor = ColorGenerator.colors[ColorGenerator.count] || ColorGenerator.getRandomColor();
        ColorGenerator.count += 1;
        return newColor;
    }

    static getRandomColor = () => '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
}
