module Main exposing (..)

import Html exposing (Html)
import RadioButton.Model exposing (..)
import View exposing (..)
import RadioButton.Update exposing (..)
import RadioButton.Types exposing (..)


init : ( Model, Cmd Msg )
init =
    Model Small "" ! []


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
