module Etls.Models exposing (..)

--type alias EtlPath =
--    String


type alias File =
    { path : String
    , fileName : String
    , checked : Bool
    , fileSize : String
    , modified : String
    , created : String
    }


type alias Directory =
    { path : String
    , folderName : String
    }


newFile : File
newFile =
    { path = ""
    , fileName = ""
    , checked = False
    , fileSize = ""
    , modified = ""
    , created = ""
    }


newDirectory : Directory
newDirectory =
    { path = ""
    , folderName = ""
    }
