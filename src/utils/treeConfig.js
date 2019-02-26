/**
 * Created by DELL on 2018/3/29.
 */
export function arrayConfig(arr) {
    var newarr = [];
    for (var i in arr) {
        if (arr[i].parentId == (arguments[1] ? arguments[1] : -1)) {
            var child = arrayConfig(arr, arr[i].id);
            if (child.length > 0) {
                arr[i].child = child;
            }
            newarr.push(arr[i]);
        }
    }
    return newarr;
}

export default arrayConfig;
