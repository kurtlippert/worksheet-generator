module RadioButton.Model exposing (..)

import RadioButton.Types exposing (FontSize)


type alias Model =
    { fontSize : FontSize
    , content : String
    }
