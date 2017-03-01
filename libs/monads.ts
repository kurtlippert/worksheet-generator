    const Right = (x: any) =>
    ({
        chain: (f: any) => f(x),
        fold: (_: any, g: any) => g(x),
        inspect: () => `Right(${x})`,
        map: (f: any) => Right(f(x)),
    })

    const Left = (x: any) =>
    ({
        chain: (_: any) => Left(x),
        fold: (f: any, _: any) => f(x),
        inspect: () => `Left(${x})`,
        map: (_: any) => Left(x),
    })

    export const LazyBox = (g: any) =>
    ({
        fold: (f: any) => f(g()),
        map: (f: any) => LazyBox(() => f(g())),
    })

    /**
     * Either monad, accepts Left and Right functions.
     * The Left function (the first parameter simply) is what to return if the value is null.
     * The Right function (second parameter) is what to return if the value is non-null
     * 
     * @param x consumed by Right monad, ignored by left
     */
    export const either = (x: any) =>
        x != null ? Right(x) : Left(null)

    /**
     * Try/Catch monad, accepts Left and Right functions.
     * The Left function (the first parameter simply) is what to return if the value is caught.
     * The Right function (second parameter) is what to return if the value is valid
     * 
     * @param x consumed by Right monad, ignored by left
     */
    export const tryCatch = (f: any) => {
        try {
            return Right(f())
        } catch (e) {
            return Left(e)
        }
    }
