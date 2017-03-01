port module Etls.List exposing (..)

import Html exposing (..)
import Html.Attributes exposing (class)
import Etls.Messages exposing (..)
import Etls.Models exposing (File, Directory)


--view : List Etl -> Html Msg
--view etls =
--  div []
--    []
--
--update : Msg -> Model -> ( Model, Cmd Msg )
--update msg model
--  case msg of
--    NoOp ->
--      ( model, Cmd.none )
--
--    Folder newFolderContents ->
--        ()
--
--
--port fsFolder : String -> Cmd msg
--
--subscriptions : Model -> Sub Msg
--subscriptions model =
--  fsFolder Folder


view : List Directory -> List File -> Html Msg
view directories files =
    div []
        [ listDirectories directories
        , listFiles files
        ]


listDirectories : List Directory -> Html Msg
listDirectories directories =
    div [ class "p2" ]
        [ table []
            [ thead []
                [ tr []
                    [ td [] [ text "Subdirectories" ]
                    ]
                ]
            , tbody [] (List.map directoryRow directories)
            ]
        ]


listFiles : List File -> Html Msg
listFiles files =
    div [ class "p2" ]
        [ table []
            [ thead []
                [ tr []
                    [ td [] [ text "Selected" ]
                    , td [] [ text "Filename" ]
                    , td [] [ text "File Size" ]
                    , td [] [ text "Modified" ]
                    , td [] [ text "Created" ]
                    ]
                ]
            , tbody [] (List.map fileRow files)
            ]
        ]


directoryRow : Directory -> Html Msg
directoryRow directory =
    tr []
        [ td [] [ text directory.folderName ] ]


fileRow : File -> Html Msg
fileRow file =
    tr []
        [ td [] [ text (toString file.checked) ]
        , td [] [ text file.fileName ]
        , td [] [ text file.fileSize ]
        , td [] [ text file.modified ]
        , td [] [ text file.created ]
        ]
