

export function printProperties<T extends Iterable<any, any, any>>(objects: T, ...keys: string[] ) {
    console.log("---");
    for (const obj of objects) {
        for (const key of keys) {
            console.log(obj[key]);
        }
    }
    console.log("---");
}
