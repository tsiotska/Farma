export const specialtyNormalizer = ({ data: { data }}: any) => {
    if (!Array.isArray(data)) return;

    return data.map((x, i) => ({
        id: i,
        name: x
    }));
};
