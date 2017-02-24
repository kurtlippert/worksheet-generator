module View exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Types exposing (..)
import Model exposing (..)
import Routing exposing (Route(..))
import Home.Index as home
import Archive.Index as archive
import Exceptions.Index as exceptions

view : Model -> Html Msg
view model =
    section [ classList [ ( "content-wrapper", True ), ( "main-content", True ), ( "clear-fix" ) ] ]
        [ page model ]

directoryView : Model -> Html Msg
directoryView model =



page : Model -> Html Msg
page model =
    case model.route of
        EtlRoute ->
            home.view

        EtlArchive ->
            home.view

        EtlExceptions ->
            home.view

        NotFoundRoute ->
            notFoundView

notFoundView : Html Msg
notFoundView =
    div [ id "error_index" ]
        [ text "this be an error boi" ]    