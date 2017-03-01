module Etls.Update exposing (..)

import Etls.Messages exposing (Msg(..))
import Etls.Models exposing (File, Directory)


updateFiles : Msg -> List File -> ( List File, Cmd Msg )
updateFiles msg files =
    case msg of
        NoOp ->
            ( files, Cmd.none )


updateDirectories : Msg -> List Directory -> ( List Directory, Cmd Msg )
updateDirectories msg directories =
    case msg of
        NoOp ->
            ( directories, Cmd.none )
