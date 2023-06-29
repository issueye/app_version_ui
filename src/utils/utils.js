// 数组单元素去重
export const ArrItemDedup = (arr) => {
    if (Array.isArray(arr)) {
        const uniqueArr = arr.filter((item, index) => {
            return arr.indexOf(item) === index
        })

        return uniqueArr
    }
}

// 数组对象去重
export const ArrObjItemDedup = (arr) => {
    if (Array.isArray(arr)) {
        const result = Array.from(new Set(arr.map(JSON.stringify)), JSON.parse);
        return result
    }
}
