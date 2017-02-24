module ClockTest exposing (..)

import Html exposing (Html, div, text, button)
import Html.Events exposing (onClick)
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Time exposing (Time, second)


--uncomment if needed -- import Html.App as App


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { time : Time
    , pause : Bool
    }


init : ( Model, Cmd Msg )
init =
    Model 0 False ! []



-- UPDATE


type Msg
    = Tick Time
    | Pause


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick newTime ->
            { model | time = newTime } ! []

        Pause ->
            { model | pause = True } ! []



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    if model.pause then
        Sub.none
    else
        Time.every second Tick



-- VIEW


view : Model -> Html Msg
view model =
    let
        angle =
            turns (Time.inMinutes model.time)

        handX =
            toString (50 + 40 * cos angle)

        handY =
            toString (50 + 40 * sin angle)

        minHandX =
            toString (50 + 40 * cos (angle / 60))

        minHandY =
            toString (50 + 40 * sin (angle / 60))
    in
        div []
            [ svg [ viewBox "0 0 100 100", width "300px" ]
                [ circle [ cx "50", cy "50", r "45", fill "#0B79CE" ] []
                , line [ x1 "50", y1 "50", x2 handX, y2 handY, stroke "#023963" ] []
                , line [ x1 "50", y1 "50", x2 minHandX, y2 minHandY, stroke "#023963" ] []
                ]
            , div []
                [ button [ onClick Pause ] [ Html.text "Pause" ] ]
            ]
