module Routing exposing (..)

import Navigation exposing (Location)
import Players.Models exposing (PlayerId)
import Etls.Models exposing (..)
import UrlParser exposing (..)


type Route
    = PlayersRoute
    | PlayerRoute PlayerId
    | EtlRoute
    | NotFoundRoute


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map PlayersRoute top
        , map PlayerRoute (s "players" </> string)
        , map PlayersRoute (s "players")
        , map EtlRoute (s "etls")
        ]


parseLocation : Location -> Route
parseLocation location =
    case (parseHash matchers location) of
        Just route ->
            route

        Nothing ->
            NotFoundRoute
