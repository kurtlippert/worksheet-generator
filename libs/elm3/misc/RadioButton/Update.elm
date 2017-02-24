module RadioButton.Update exposing (..)

import RadioButton.Types exposing (Msg(SwitchTo))
import RadioButton.Model exposing (Model)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SwitchTo newFontSize ->
            { model | fontSize = newFontSize } ! []
