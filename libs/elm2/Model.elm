module Models exposing (..)

import Etl.Model exposing (..)
import Archive.Model exposing (..)
import Exceptions.Model exposing (..)
import Routing


type alias Model =
    { etl : Etl.Model.Model
    , archive : Archive.Model.Model
    , exceptions : Exceptions.Model.Model
    , route : Routing.Route
    }


initialModel : Routing.Route -> Model
initialModel route =
    { etl = Etl.Model.initialModel
    , archive = Archive.Model.initialModel
    , exceptions = Exceptions.Model.initialModel
    , route = route
    }
