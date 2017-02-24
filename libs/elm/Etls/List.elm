
module Etls.List exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Etls.Messages exposing (..)
import Etls.Models exposing (Etl)


view : List Etl -> Html Msg
view etls =
    div []
        [ nav etls
        , list etls
        ]


nav : List Etl -> Html Msg
nav etls =
    div [ class "clearfix mb2 white bg-black" ]
        [ span [ class "left p2" ] [ text "Etls" ]
        , span [ class "left p2" onClick (ShowEtls) ] [ text "ETL" ]
        ]


list : List Etl -> Html Msg
list etls =
    div [ class "p2" ]
        [ table []
            [ thead []
                [ tr []
                    [ th [] [ text "Sub directories" ] ]
                ]
            , tbody [] (List.map etlRow etls)
            ]
        ]


etlRow : Etl -> Html Msg
etlRow etl =
    let
        imgStyle : Attribute msg
        imgStyle =
            style
                [ ("width", "20px")
                , ("height", "20px")
                , ("border", "none")
                ]
    in
        tr []
            [ td []
                [ img [ src "/Content/folder.png" alt "Folder Logo" align "top" style myStyle ] []
                , a [ href (text etl.link) ]
                    [ text etl.name ]
                ]
            ]
