export const REMOVE = 1;
export const INSERT = 0;

const getKey = item => {
    if (!item || !item.props || !item.props.key) {
        return null;
    }

    return item.props.key;
}

/**
 * Separates keyed and unkeyed items from a list
 *
 * @param  {Array}  list
 * @return {Object} keyMap
 */
export const getKeyMap = list => {
    const keyed = {};
    const unkeyed = [];

    list.forEach((listItem, index) => {
        const key = getKey(listItem);
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
 * If the lists are keyed, then it can optimize a bit.
 * Idea is to a new list that makes it easier for Diff.diff to work
 * Examples A:
 *   Input:
 *      prevList: [ { val: 'a', key: 'a' }, { val: 'b', key: 'b' } ]
 *      nextList: [ { val: 'b', key: 'b' }, { val: 'a', key: 'a' } ]
 *   Return:
 *      {
 *        list: [ { val: 'b', key: 'b' }, { val: 'a', key: 'a' } ],
 *        moves: {
 *          inserts: [ { key: 'b', to: 0   } ],
 *          removes: [ { key: 'b', from: 1 } ],
 *        },
 *      }
 *
 * Examples A:
 *   Input:
 *      prevList: [ { val: 'a', key: 'a' }, { val: 'b', key: 'b' } ]
 *      nextList: [ { val: 'a', key: 'a' }, { val: 'z', key: 'z' } ]
 *   Return:
 *      {
 *        list: [ { val: 'b', key: 'b' }, null, { val: 'a', key: 'a' } ],
 *        moves: null,
 *      }
 *   Notice how a remove has been inserted to the list
 *   Diff.diff can then remove that null node and insert the non-null node
 *
 * @param  {Array} prevList
 * @param  {Array} nextList
 * @return {Object}
 */
export const listDiff = (prevList, nextList) => {
    const nextKeyMap = getKeyMap(nextList);
    const prevKeyMap = getKeyMap(prevList);

    // If everything is unkeyed, there's nothing we can do
    if ((nextKeyMap.unkeyed.length === nextList.length) &&
        (prevKeyMap.unkeyed.length === prevList.length)) {
        return {
            list: nextList,
            moves: null,
        };
    }

    const newList = [];
    let unkeyedIndex = 0;

    // Iterate through the previous list and remove items that no longer exist
    prevList.forEach(prevListItem => {
        const prevKey = getKey(prevListItem);

        // The previous item is keyed and is in the next list
        if (prevKey && nextKeyMap.keyed.hasOwnProperty(prevKey)) {
            const index = nextKeyMap.keyed[prevKey];
            newList.push(nextList[index]);

        // The previous item is keyed but does not exist in the next list
        } else if (prevKey) {
            newList.push(null);

        // The previous item is not keyed
        } else {
            /*
             * Try to grab the an unkeyed item from the nextList
             *
             * If it doesn't exists, give it a null value
             */
            const unkeyedItem = nextKeyMap.unkeyed[unkeyedIndex] || null;
            unkeyedIndex += 1;

            newList.push(unkeyedItem);
        }
    });

    // Take the greater index
    let lengthThreshold = nextKeyMap.unkeyed[unkeyedIndex];
    if (unkeyedIndex >= nextKeyMap.unkeyed.length) {
        lengthThreshold = nextList.length;
    }

    // Iterate through the next list and add any items that didn't previously exist
    nextList.forEach((nextListItem, nextListIndex) => {
        const nextKey = getKey(nextListItem);

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
            newList.push(nextListItem);
        }
    });

    // TODO: Turn clonedList into a linked list
    const clonedList = newList.slice();
    let clonedListIndex = 0;
    let nextListIndex = 0;
    // Need this to find the true index when splicing
    let clonedListRemoves = 0;
    const removes = [];
    const inserts = [];

    while (nextListIndex < nextList.length) {
        // Remove the nulls
        while (clonedList[clonedListIndex] === null && clonedListIndex < clonedList.length) {
            removes.push({ from: clonedListIndex - clonedListRemoves, key: null });
            clonedListIndex += 1;
            clonedListRemoves += 1;
        }
        
        const nextItem = nextList[nextListIndex];
        const clonedItem = clonedList[clonedListIndex];

        const nextItemHasKey = !!getKey(getKey(nextItem.key));
        const clonedItemExists = !!clonedItem;
        const clonedItemHasKey = clonedItemExists && !!getKey(clonedItem.key);

        if (!clonedItemExists || getKey(clonedItem.key) !== getKey(nextItem.key)) {
            if (nextItemHasKey && clonedItemHasKey) {
                // Try inserting the clonedItem
                if (nextKeyMap.keyed[getKey(clonedItem.key)] === nextListIndex + 1) {
                    inserts.push({ to: nextListIndex, key: getKey(nextItem.key) })

                /*
                 * Otherwise, move the clonedItem somewhere else in the list
                 * 
                 * Note: Moving means removing and inserting
                 */
                } else {
                    removes.push({ from: clonedListIndex - clonedListRemoves, key: getKey(clonedItem.key) });
                    clonedListRemoves += 1;
                    clonedListIndex += 1;
                    const nextClonedItem = clonedList[clonedListIndex];

                    /*
                     * If the nextClonedItem doesn't match the nextItem, we have to
                     * insert
                     */
                    if (!nextClonedItem || nextClonedItem.key !== getKey(nextItem.key)) {
                        inserts.push({ to: nextListIndex, key: getKey(nextItem.key) });

                    // Otherwise, removing the clonedItem shifted things into place
                    } else {
                        clonedListIndex += 1;
                    }
                }
                nextListIndex += 1;

            } else if ((nextItemHasKey && !clonedItemHasKey) || !clonedItemExists) {
                inserts.push({ key: getKey(nextItem.key), to: nextListIndex });
                nextListIndex += 1;

            } else if (!nextItemHasKey && clonedItemHasKey) {
                removes.push({ from: clonedListIndex - clonedListRemoves, key: getKey(clonedItem.key) });
                clonedListIndex += 1;
                clonedListRemoves += 1;
            }
        } else {
            nextListIndex += 1;
            clonedListIndex += 1;
        }
    }

    while (clonedListIndex < clonedList.length) {
        const clonedItem = clonedList[clonedListIndex];
        removes.push({ from: clonedListIndex - clonedListRemoves, key: clonedItem && getKey(clonedItem.key) });
        clonedListIndex += 1;
        clonedListRemoves += 1;
    }
    
    // If there are only removals, let the normal diff take care of it
    if (removes.length && !inserts.length) {
        return {
            list: newList,
            moves: null,
        };
    }

    return {
        list: newList,
        moves: {
            inserts,
            removes,
        },
    };
};
