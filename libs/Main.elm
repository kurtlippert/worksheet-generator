module Main exposing (..)

import Html exposing (Html, text, div, fieldset, label, input)
import Html.Attributes exposing (type_)
import Html.Events exposing (onClick)


--uncomment if needed -- import Html.App as App


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { notifications : Bool
    , autoplay : Bool
    , location : Bool
    }


init : ( Model, Cmd Msg )
init =
    Model False False False ! []


type Msg
    = ToggleNotifications
    | ToggleAutoplay
    | ToggleLocation


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ToggleNotifications ->
            { model | notifications = not model.notifications } ! []

        ToggleAutoplay ->
            { model | autoplay = not model.autoplay } ! []

        ToggleLocation ->
            { model | location = not model.location } ! []


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    fieldset []
        [ checkbox ToggleNotifications "Email Notifications"
        , checkbox ToggleAutoplay "Video Autoplay"
        , checkbox ToggleLocation "Use Location"
        ]


checkbox : msg -> String -> Html msg
checkbox msg name =
    label []
        [ input [ type_ "checkbox", onClick msg ] []
        , text name
        ]
