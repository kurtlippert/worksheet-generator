module Routing exposing (..)

import Navigation exposing (Location)
import UrlParser exposing (..)


type Route
    = EtlRoute
    | EtlArchiveRoute
    | EtlExceptionsRoute
    | NotFoundRoute


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map EtlRoute top
        , map EtlRoute (s "etls")
        , map EtlArchiveRoute (s "etl-archive")
        , map EtlExceptionsRoute (s "etl-exceptions")
        ]


parseLocation : Location -> Route
parseLocation location =
    case (parseHash matchers location) of
        Just route ->
            route

        Nothing ->
            NotFoundRoute
