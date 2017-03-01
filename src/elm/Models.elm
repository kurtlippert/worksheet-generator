module Models exposing (..)

import Etls.Models exposing (File, Directory)


type alias Model =
    { files : List File
    , directories : List Directory
    }


initialModel : Model
initialModel =
    { files =
        [ File "C:\\dev\\etl-explorer\\etl-testbed\\ETL\\stat_dmy_stat_dmy_seg4911870.txt"
            "stat_dmy_stat_dmy_seg4911870.txt"
            False
            "5 KB"
            "2/24/2017 8:59:50 PM"
            "2/24/2017 8:59:50 PM"
        ]
    , directories =
        [ Directory "C:\\dev\\etl-explorer\\etl-testbed\\ETL\\Services"
            "Services"
        ]
    }
