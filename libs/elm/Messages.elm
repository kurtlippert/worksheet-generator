module Messages exposing (..)

import Navigation exposing (Location)
import Players.Messages
import Etls.Messages


type Msg
    = PlayersMsg Players.Messages.Msg
    | EtlsMsg Etls.Messages.Msg
    | OnLocationChange Location
