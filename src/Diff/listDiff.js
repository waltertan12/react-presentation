/**
 * Separates keyed and unkeyed items from a list
 *
 * @param  {Array}  list
 * @return {Object} keyMap
 */
const getKeyMap = list => {
    const keyed = {};
    const unkeyed = [];

    list.forEach((listItem, index) => {
        const key = listItem.key;
        if (key) {
            keyed[key] = index;
        } else {
            unkeyed.push(index);
        }
    });

    return {
        keyed,
        unkeyed,
    };
};

/**
 * Diffs two lists
 *
 * @param  {Array} prevList
 * @param  {Array} nextList
 * @return {Object}
 */
const listDiff = (prevList, nextList) => {
    const nextKeyMap = getKeyMap(nextList);
    const prevKeyMap = getKeyMap(prevList);

    // If everything is unkeyed, there's nothing we can do
    if ((nextKeyMap.unkeyed.length === nextList.length) &&
        (prevKeyMap.unkeyed.length === prevList.length)) {
        return {
            list: nextList,
            moves: [],
        };
    }

    const newListItems = [];
    let unkeyedIndex = 0;

    // Iterate through the previous list and remove items that no longer exist
    prevList.forEach(prevListItem => {
        const prevKey = prevListItem.key;

        // The previous item is keyed and is in the next list
        if (prevKey && nextKeyMap.keyed.hasOwnProperty(prevKey)) {
            const index = nextKeyMap.keyed[prevKey];
            newListItems.push(nextList[index]);

        // The previous item is keyed but does not exist in the next list
        } else if (prevKey) {
            newListItems.push(null);

        // The previous item is not keyed
        } else {
            /*
             * Try to grab the an unkeyed item from the nextList
             *
             * If it doesn't exists, give it a null value
             */
            const unkeyedItem = nextKeyMap.unkeyed[unkeyedIndex] || null;
            unkeyedIndex += 1;

            newListItems.push(unkeyedItem);
        }
    });

    // Take the greater index
    let lengthThreshold = nextKeyMap.unkeyed[unkeyedIndex];
    if (unkeyedIndex >= nextKeyMap.unkeyed.length) {
        lengthThreshold = nextList.length;
    }

    // Iterate through the next list and add any items that didn't previously exist
    nextList.forEach((nextListItem, nextListIndex) => {
        const nextKey = nextListItem.key;

        /*
         * If the item is keyed and didn't exist in the previous list
         *
         * OR
         *
         * If the item is unkeyed and has an index greater than the previous list 
         * a.k.a. doesn't exist in the previous list
         */
        if ((nextKey && !prevKeyMap.keyed.hasOwnProperty(nextKey)) ||
            (!nextKey && nextListIndex >= lengthThreshold)) {
            newListItems.push(nextListItem);
        }
    });

    const clonedListItems = newListItems.splice();
    const removes = [];
    const inserts = [];
};
