module Etls.Update exposing (..)

import Etls.Messages exposing (Msg(..))
import Etls.Models exposing (Etl, EtlId)
import Etls.Commands exposing (save)
import Navigation


update : Msg -> Etl -> List Etls
update message etls =
    case message of
        OnFetchAll (Ok newEtls) ->
            ( newEtls, Cmd.none )

        OnFetchAll (Err error) ->
            ( etls, Cmd.none )

        ShowEtls ->
            ( etls, Navigation.newUrl "#etls" )
