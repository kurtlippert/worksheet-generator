module RadioButton.View exposing (..)

import Html exposing (Html, text, label, input)
import Html.Attributes exposing (type_)
import Html.Events exposing (onClick)


radio : msg -> String -> Html msg
radio msg name =
    label []
        [ input [ type_ "radio", onClick msg ] []
        , text name
        ]
