// 当前 44px，紧邻43px，其他42px
const HEIGHT_RATIO = [44, 43];

export const DEFAULT_HEIGHT_RATIO = 42;

export default function formatHeight(itemsCount = 0, selectedIdx) {
    let previewHeight = 0;
    const result = [];
    const heightRatioCounts = HEIGHT_RATIO.length;

    for (let i = 0; i < itemsCount; i++) {
        const gap = Math.abs(i - selectedIdx);
        const currentHeight = gap < heightRatioCounts ? HEIGHT_RATIO[gap] : DEFAULT_HEIGHT_RATIO;

        // 都是负数
        result.push(-previewHeight);
        previewHeight += currentHeight;
    }

    return result;
}
