from functools import (reduce)
from itertools import (chain)

# A generalised wrapper for the built-in `all` function,
# extending its range to non-Boolean lists.
# _all :: (a -> Bool) -> [a] -> Bool


def _all(p):
    return lambda xs: all(map(p, xs))


# concatMap :: (a -> [b]) -> [a] -> [b]
def concatMap(f):
    return lambda xs: list(chain.from_iterable(map(f, xs)))


# notList :: a -> Bool
def notList(x):
    return not isinstance(x, list)


# until :: (a -> Bool) -> (a -> a) -> a -> a
def until(p):
    def go(f, x):
        v = x
        while not p(v):
            v = f(v)
        return v
    return lambda f: lambda x: go(f, x)


def flatten(xs):
    return reduce(
        lambda a, x: a + until(_all(notList))(
            concatMap(list)
        )([x]),
        xs, []
    )
