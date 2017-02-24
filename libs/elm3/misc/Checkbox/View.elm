model Checkbox.View exposing (view)

import Html exposing (Html, text, label, input)
import Html.Attributes exposing (type_)
import Html.Events exposing (onClick)
import Checkbox.Model exposing (..)
import Checkbox.Types exposing (..)


view : msg -> String -> Html msg
view msg name =
    label []
        [ input [ type_ "checkbox", onClick msg ] []
        , text name
        ]