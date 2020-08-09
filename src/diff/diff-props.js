import { isObject } from '../utils';

/**
 * Returns the given object or an empty object
 *
 * @param  {Object|undefined} diff
 * @return {Object}
 */
const getDiff = diff => (diff || {});

/**
 * @param  {Object} prevProps
 * @param  {Object} nextProps
 * @return {Object} diff
 */
export const diffProps = (prevProps, nextProps) => {
    let diff;

    // Diff the props
    Object
        .keys(prevProps)
        .forEach(prevPropKey => {
            // A prop has been removed
            if (!nextProps.hasOwnProperty(prevPropKey)) {
                diff = getDiff(diff);
                diff[prevPropKey] = undefined;
            }

            const prevProp = prevProps[prevPropKey];
            const nextProp = nextProps[prevPropKey];

            // Props are the same
            if (prevProp === nextProp) {
                // no op

            // Props are objects so we need to do additional checks
            } else if (isObject(prevProp) && isObject(nextProp)) {
                // Prototypes are different which means they are different
                if (Object.getPrototype(prevProp) !== Object.getPrototype(nextProp)) {
                    diff = getDiff();
                    diff[prevPropKey] = nextProp;

                // Prototypes are the same so find the diffs on those props
                } else {
                    const propDiff = diffProps(prevProp, nextProp);
                    if (propDiff) {
                        diff = getDiff(diff);
                        diff[prevPropKey] = propDiff;
                    }
                }

            // They are different
            } else {
                diff = getDiff(diff);
                diff[prevPropKey] = nextProp;
            }
        });

    // Check if there are any props that need to be added
    Object
        .keys(nextProps)
        .forEach(nextPropKey => {
            if (!prevProps.hasOwnProperty(nextPropKey)) {
                diff = getDiff(diff);
                diff[nextPropKey] = nextProps[nextPropKey];
            }
        });

    return diff;
};
