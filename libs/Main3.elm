module Main exposing (..)

import Html exposing (Html, text, div, a)
import Html.Attributes exposing (classList)
import Html.Events exposing (onClick)


--uncomment if needed -- import Html.App as App


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : ( Model, Cmd Msg )
init =
    Model Home ! []


type alias Model =
    { area : Msg
    }


type Msg
    = Home
    | Import


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Home ->
            { model | area = Home } ! []

        Import ->
            { model | area = Import } ! []


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    div [ classList [ ( "ui", True ), ( "container", True ) ] ]
        [ div
            [ classList [ ( "ui", True ), ( "large", True ), ( "secondary", True ), ( "pointing", True ), ( "menu", True ) ] ]
            [ menuItem model Home
            , menuItem model Import
            ]
        ]


menuItem : Model -> Msg -> Html Msg
menuItem model msg =
    a
        [ classList
            [ ( "item", True )
            , ( "active"
              , if model.area == msg then
                    True
                else
                    False
              )
            ]
        , onClick msg
        ]
        [ text (toString msg) ]
