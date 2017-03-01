module Update exposing (..)

import Messages exposing (Msg(..))
import Models exposing (Model)
import Etls.Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FilesMsg subMsg ->
            let
                ( reprocessedEtls, cmd ) =
                    Etls.Update.updateFiles subMsg model.files
            in
                ( { model | files = reprocessedEtls }, Cmd.map FilesMsg cmd )
