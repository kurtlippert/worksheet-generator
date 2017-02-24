module View exposing (..)

import Html exposing (Html, text, div, fieldset, section)
import RadioButton.Model exposing (Model)
import RadioButton.Types exposing (Msg(SwitchTo), FontSize(Small, Medium, Large))
import RadioButton.View exposing (radio)


view : Model -> Html Msg
view model =
    div []
        [ fieldset []
            [ radio (SwitchTo Small) "Small"
            , radio (SwitchTo Medium) "Medium"
            , radio (SwitchTo Large) "Large"
            ]
        , section [] [ text model.content ]
        ]
